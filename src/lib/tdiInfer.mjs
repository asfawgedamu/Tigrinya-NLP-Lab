// Tigrinya dialect identification (Z / L / D), client-side inference.
//
// A faithful JavaScript port of the Python pipeline in notebooks/02_classical_models.ipynb:
//   normalise_text -> scikit-learn "char_wb" 1-4-gram TF-IDF (sublinear tf, L2) -> multinomial logistic regression.
// The model is plain data (models/tdi_model.json), so no server and no ML library are needed.
//
// KEEP IN SYNC with tdi/text.py. `node deploy/test_parity.mjs` proves the two implementations agree.

const URL_RE = /https?:\/\/[^ \t\r\n]+|www\.[^ \t\r\n]+/g;
const MENTION_RE = /@[A-Za-z0-9_]+/g;
const LATIN_RE = /[A-Za-z]+/g;
const EMPTY_BRACKETS_RE = /\([ ]*\)/g;
const WS_RE = /[ \t\n\r\f\v\x1c-\x1f\x85\u00a0\u1680\u2000-\u200d\u2028\u2029\u202f\u205f\u3000\ufeff]+/g;

/** Same cleaning as `tdi.text.normalise_text`. */
export function normaliseText(text) {
  let t = String(text ?? '').normalize('NFC');
  t = t.replace(URL_RE, ' ').replace(MENTION_RE, ' ').replace(/#/g, ' ').replace(/_/g, ' ');
  t = t.replace(LATIN_RE, ' ').replace(EMPTY_BRACKETS_RE, ' ').replace(WS_RE, ' ');
  return t.replace(/^ +| +$/g, '');
}

const isEthiopic = (cp) => cp >= 0x1200 && cp <= 0x139f;

/** Same guard as `tdi.text.is_tigrinya_script`: refuse empty, Latin-only or mostly non-Ge'ez input. */
export function isTigrinyaScript(text, minRatio = 0.8, minLetters = 3) {
  let letters = 0, ethiopic = 0;
  for (const ch of String(text ?? '')) {
    if (/\p{L}/u.test(ch)) {
      letters += 1;
      if (isEthiopic(ch.codePointAt(0))) ethiopic += 1;
    }
  }
  return letters >= minLetters && ethiopic / letters >= minRatio;
}

/** scikit-learn's `char_wb` analyser: n-grams inside each space-padded word. */
export function charWbNgrams(clean, minN, maxN) {
  const grams = [];
  for (const word of clean.split(' ')) {
    if (!word) continue;
    const w = Array.from(` ${word} `); // code points, like Python's str
    for (let n = minN; n <= maxN; n++) {
      let offset = 0;
      grams.push(w.slice(offset, offset + n).join(''));
      while (offset + n < w.length) {
        offset += 1;
        grams.push(w.slice(offset, offset + n).join(''));
      }
      if (offset === 0) break; // a word shorter than n is counted once, exactly like scikit-learn
    }
  }
  return grams;
}

/** Fetch and prepare the exported model (call once, reuse the result). */
export async function loadModel(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load model (${res.status})`);
  return prepareModel(await res.json());
}

/** Build lookup tables from the parsed JSON. Works in Node and in the browser. */
export function prepareModel(json) {
  if (json.format !== 'tdi-linear-v1') throw new Error(`Unsupported model format: ${json.format}`);
  const index = new Map(json.tfidf.features.map((f, i) => [f, i]));
  return { ...json, _index: index };
}

/** Sparse, L2-normalised TF-IDF vector of an already-normalised text: Map(featureIndex -> raw weight) and the L2 norm. */
function tfidfVector(model, clean) {
  const [minN, maxN] = model.tfidf.ngram_range;
  const counts = new Map();
  for (const g of charWbNgrams(clean, minN, maxN)) {
    const j = model._index.get(g);
    if (j !== undefined) counts.set(j, (counts.get(j) ?? 0) + 1);
  }
  // sublinear TF-IDF, then L2 normalisation (divide each weight by `norm`)
  const weights = new Map();
  let sq = 0;
  for (const [j, c] of counts) {
    const v = (1 + Math.log(c)) * model.tfidf.idf[j];
    weights.set(j, v);
    sq += v * v;
  }
  return { weights, norm: Math.sqrt(sq) || 1 };
}

/**
 * Classify `text`.
 * @returns {{ok:false, reason:string} | {ok:true, label:string, name:string, confidence:number, probabilities:Object<string,number>}}
 */
export function predict(model, text) {
  if (typeof text !== 'string' || text.trim() === '') return { ok: false, reason: 'empty input' };
  if (!isTigrinyaScript(text, model.guard.min_ethiopic_ratio, model.guard.min_letters)) {
    return { ok: false, reason: "not Ge'ez-script text" };
  }
  const clean = normaliseText(text);
  if (!clean) return { ok: false, reason: 'nothing left after cleaning' };

  const { weights, norm } = tfidfVector(model, clean);

  const { coef, intercept } = model.classifier;
  const z = model.labels.map((_, k) => {
    let s = intercept[k];
    for (const [j, v] of weights) s += coef[k][j] * (v / norm);
    return s;
  });
  const zmax = Math.max(...z);
  const e = z.map((v) => Math.exp(v - zmax));
  const total = e.reduce((a, b) => a + b, 0);
  const probabilities = {};
  model.labels.forEach((l, k) => { probabilities[l] = e[k] / total; });
  const label = model.labels.reduce((a, b) => (probabilities[a] >= probabilities[b] ? a : b));
  return { ok: true, label, name: model.label_names[label], confidence: probabilities[label], probabilities };
}

/**
 * Explain a prediction: the character n-grams that push the text towards the predicted variety the most.
 * Each contribution is  (tf-idf weight) x (coefficient for the predicted variety - mean coefficient of the other varieties).
 * "␣" in a returned n-gram marks a word boundary (e.g. "␣ድ" = a word that starts with ድ).
 * @returns {Array<{gram:string, contribution:number}>}  empty if the text is refused
 */
export function explain(model, text, topN = 6) {
  const r = predict(model, text);
  if (!r.ok) return [];
  const { weights, norm } = tfidfVector(model, normaliseText(text));
  const k = model.labels.indexOf(r.label);
  const others = model.labels.map((_, i) => i).filter((i) => i !== k);
  const { coef } = model.classifier;
  const out = [];
  for (const [j, v] of weights) {
    const diff = coef[k][j] - others.reduce((a, i) => a + coef[i][j], 0) / others.length;
    out.push({ gram: model.tfidf.features[j].replace(/ /g, '\u2423'), contribution: (v / norm) * diff });
  }
  return out.filter((o) => o.contribution > 0).sort((a, b) => b.contribution - a.contribution).slice(0, topN);
}
