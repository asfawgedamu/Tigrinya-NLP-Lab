# Packaging and deploying the Tigrinya dialect model

This guide takes a trained classical model from the training notebooks to the live Tigrinya-NLP-Lab site, and explains how to replace it when you retrain. Everything runs in the visitor's browser: there is no server, no API key, and no text is uploaded.

**Currently deployed:** TF-IDF character n-grams (`char_wb`, 1–4) + multinomial logistic regression, format `tdi-linear-v1`, trained 2026-11-18 on 9,443 sentences. Held-out test (1,899 sentences, 663 parallel triples unseen in training): accuracy 0.937, macro-F1 0.937 (95% CI 0.923–0.948), ECE 0.014.

---

## 1. How it fits together

```
notebook 02  ──►  tdi_model.json  ──►  public/models/        (served as a static file)
                  model_card.json      public/models/        (shown in the Lab's "Deployed model" panel)
                  data_report.json     public/models/        (audit trail of the data)
                  parity_cases.json    tests/fixtures/       (Python's answers, used by the test)

src/lib/tdiInfer.mjs   JavaScript port of the Python pipeline (normalise → n-grams → TF-IDF → logistic regression)
src/lib/tdiModel.ts    loads the model once, checks its SHA-256, exposes classifyText() / explainText() / useTdiModel()
vite.config.ts         computes the model's SHA-256 at build time and bakes it into the bundle
TigrinyaDialectLab.tsx / dynamic/TigrinyaNlpExplorer.tsx   use the model
```

The model file (~2.9 MB, ~0.6 MB gzipped by most hosts) is **downloaded lazily**, only when a visitor opens a page that classifies text.

---

## 2. Files you need

| File | Produced by | Goes to | Purpose |
|---|---|---|---|
| `tdi_model.json` | notebook 02 | `public/models/` | the model (vocabulary, IDF, weights) |
| `model_card.json` | notebook 02 | `public/models/` | accuracy, data, limitations shown on the site |
| `data_report.json` | notebook 01/02 | `public/models/` | data audit (counts, hashes, versions) |
| `parity_cases.json` | notebook 02 | `tests/fixtures/` | Python's probabilities for test sentences |
| `tdiInfer.mjs` | already in `src/lib/` | — | only replace it if the notebook's export format changes |

Only `format: "tdi-linear-v1"` is supported. The installer and the loader both refuse anything else.

---

## 3. Deploy a new model (step by step)

Work in the site folder (the one containing `package.json`). Node 20+ is required.

1. **Collect the four files** from the notebook's output folders into one folder, e.g. `~/tdi-bundle/` (the installer also searches `models/`, `reports/` and `deploy/` sub-folders, so you can point it at the notebook project root).

2. **Install and validate the bundle**
   ```bash
   npm run model:install -- ~/tdi-bundle
   ```
   It checks that all files exist, the format is `tdi-linear-v1`, all three labels Z/L/D are present and the vocabulary matches the IDF vector; then copies the files to the right places and prints the model's SHA-256 and held-out scores.

3. **Run the parity test** – proves the JavaScript gives the same probabilities as Python (tolerance 1e-9) and that out-of-script text is refused:
   ```bash
   npm run test:model
   ```
   Do not deploy if this fails.

4. **Typecheck and build**
   ```bash
   npm run typecheck
   npm run build
   ```
   The build prints no model-specific output; it silently injects the SHA-256 of `public/models/tdi_model.json` into the bundle.

5. **Try it locally**
   ```bash
   npm run preview        # open the printed URL → Projects → Dialect Lab
   ```
   Check that the "Deployed model" panel says *Loaded*, shows your new scores, and that a Z, an L and a D sentence are classified sensibly.

6. **Publish** the `dist/` folder to your static host exactly as you publish the rest of the site (the model files are inside it under `dist/models/`). Make sure the host serves `.json` with `Content-Type: application/json`.

7. **Hard-refresh** the live site (Ctrl/Cmd+Shift+R). The loader requests the model with `cache: 'no-cache'`, so visitors revalidate it on every visit and never get a stale model with a new page.

> Always deploy the **whole `dist/` folder together.** The page code contains the model's hash; if you upload a new `tdi_model.json` without a rebuilt page (or the reverse), the integrity check fails by design and the Lab shows "Model unavailable".

---

## 3b. Replacing the model after retraining

Re-run notebooks 01 → 02 (more sentences, new grid, etc.), then repeat section 3 from step 1. Nothing else changes. Keep the previous `dist/` folder until the new site is verified so you can roll back by re-uploading it.

---

## 4. Security and integrity

* **Integrity check.** After download, the browser hashes the model (SHA-256, `crypto.subtle`) and compares with the value fixed at build time. A corrupted, truncated or swapped file is rejected and nothing is classified. (On a plain-`http` page `crypto.subtle` does not exist, so the check is skipped; serve the site over HTTPS.)
* **Same origin only.** The site's Content-Security-Policy allows `connect-src 'self'`, and the model is fetched from the same origin. No third party is contacted.
* **No code in the model.** `tdi_model.json` is parsed with `JSON.parse` and used as numbers and strings only; it is never evaluated.
* **Privacy.** Classified text stays in the page. Nothing is sent to Firebase or anywhere else (feedback/report features only send what a visitor explicitly submits).
* **Limits of the check.** The hash protects against accidents and tampering with the served file, not against someone who can modify your build or hosting account. Protect those with the normal measures (2-factor login, least-privilege tokens, review before publishing).

---

## 5. What is *not* deployed

* **Neural models** (CNN, BiLSTM, Afro-XLMR…) cannot run through this JSON/JavaScript path. They would need either a small inference API or an ONNX model in the browser; neither is built. The Lab says so on its panel instead of offering selectable models.
* The **paper's published results** (e.g. 92.98% for the character CNN) were measured on an earlier dataset and are not the numbers of the deployed model. The Lab shows the deployed model's own held-out numbers from `model_card.json`.
* In notebook 02, Naive Bayes and the linear SVM scored about 1.5 points higher than logistic regression. Logistic regression was chosen because it gives calibrated probabilities (ECE 0.014) and exports to a simple JSON file. If you prefer raw accuracy, an SVM export would be a new format and needs its own port and parity test.

## 6. Model behaviour you should know

* **Guards before the model.** Text that is not mostly Ge'ez script (< 80% Ethiopic letters, < 3 letters) is refused. A separate Amharic stop-word check (`src/data/amharicStopWords.ts`) refuses likely Amharic, because the model only knows Z, L and D and would otherwise assign Amharic to one of them.
* **Low confidence (< 60%)** is flagged in the interface. Very short inputs (one or two words) are unreliable.
* **Domain.** The training corpus is mostly social-media text; expect lower accuracy on news, religious or formal text.
* **Explanations.** The "key tokens" are the character sequences that pushed the decision most towards the predicted variety (`␣` marks a word boundary). They are computed exactly from the model weights, not guessed.

---

## 7. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Panel says **Model unavailable – failed its integrity check** | `dist/` mixes old and new files, or a CDN/browser cache serves an old `tdi_model.json`. Re-upload all of `dist/`, purge the CDN cache, hard-refresh. |
| **Model download failed (HTTP 404)** | `models/` folder missing from the published site, or the site is served from a sub-path and not built with the matching `base` setting in `vite.config.ts`. |
| `npm run model:install` says **Unsupported model format** | The notebook exported a different format. Re-run the export cell of notebook 02 (it writes `tdi-linear-v1`). |
| **Parity test fails** | The JavaScript and the Python normalisation have drifted apart (see `tdi/text.py` vs `normaliseText`). Fix before deploying. |
| Everything is classified as one variety | Check the model file is the one from the final training run and the test above passes. |
| Page loads slowly on mobile | The model is ~2.9 MB. Ensure gzip/brotli is enabled on the host; it is only fetched when needed. |

---

## 8. Commands reference

| Command | What it does |
|---|---|
| `npm run model:install -- <folder>` | validate and install a model bundle |
| `npm run test:model` | JS-vs-Python parity and sanity tests |
| `npm run typecheck` | TypeScript check |
| `npm run build` | production build into `dist/` (injects the model hash) |
| `npm run preview` | serve the built site locally |
