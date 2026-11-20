// Loads the exported Tigrinya dialect model (public/models/tdi_model.json) once and exposes it to the UI.
//
//  * The model is plain data: a TF-IDF character n-gram vocabulary plus logistic-regression weights.
//    All scoring runs in the visitor's browser (src/lib/tdiInfer.mjs); no server and no text ever leaves the page.
//  * Integrity: the SHA-256 of the model file is fixed at BUILD time (see vite.config.ts). If the file served to the
//    browser differs by even one byte (corruption, a bad CDN cache, tampering), it is refused and the UI says so.
import { useEffect, useState } from 'react';
import { explain, predict, prepareModel } from './tdiInfer.mjs';

export type VarietyCode = 'Z' | 'L' | 'D';

export interface TdiModelCard {
  name: string;
  model: { family: string; C: number; profile: string; min_df: number; max_features: number };
  data: { sentences_kept: number; native_sentences: number; triples_raw: number };
  evaluation_train_only_model_on_heldout_test: {
    n_test_sentences: number; n_test_triples: number; accuracy: number; macro_f1: number; macro_f1_95ci: string; ece: number;
  };
  limitations: string[];
  created: string;
}

export interface TdiPrediction {
  ok: boolean;
  reason?: string;
  label?: VarietyCode;
  name?: string;
  confidence?: number;
  probabilities?: Record<VarietyCode, number>;
}

declare const __TDI_MODEL_SHA256__: string;

const BASE = import.meta.env.BASE_URL || '/';
const MODEL_URL = `${BASE}models/tdi_model.json`;
const CARD_URL = `${BASE}models/model_card.json`;

let model: any = null;
let card: TdiModelCard | null = null;
let loading: Promise<void> | null = null;

async function sha256Hex(buf: ArrayBuffer): Promise<string | null> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return null; // plain-http page on a LAN address: hashing is unavailable, so the check is skipped
  const digest = await subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Fetch, verify and prepare the model. Safe to call many times: the work happens once. */
export function loadTdiModel(): Promise<void> {
  if (model) return Promise.resolve();
  if (!loading) {
    loading = (async () => {
      const res = await fetch(MODEL_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`model download failed (HTTP ${res.status})`);
      const buf = await res.arrayBuffer();
      const hash = await sha256Hex(buf);
      if (hash && hash !== __TDI_MODEL_SHA256__) throw new Error('model file failed its integrity check');
      model = prepareModel(JSON.parse(new TextDecoder().decode(buf)));
      try {
        const c = await fetch(CARD_URL);
        if (c.ok) card = await c.json();
      } catch { /* the card is optional */ }
    })().catch((e) => { loading = null; throw e; }); // allow a retry after a failure
  }
  return loading;
}

export const isTdiModelReady = (): boolean => model !== null;
export const getTdiCard = (): TdiModelCard | null => card;

/** Classify one text. Call only after the model is ready (useTdiModel / loadTdiModel). */
export function classifyText(text: string): TdiPrediction {
  if (!model) return { ok: false, reason: 'model not loaded' };
  return predict(model, text) as TdiPrediction;
}

/** The character n-grams that pushed the text towards its predicted variety ("␣" marks a word boundary). */
export function explainText(text: string, topN = 6): { gram: string; contribution: number }[] {
  return model ? explain(model, text, topN) : [];
}

export type TdiStatus = 'loading' | 'ready' | 'error';

/** React hook: starts loading the model and reports its status. */
export function useTdiModel(): { status: TdiStatus; card: TdiModelCard | null; error: string | null; retry: () => void } {
  const [status, setStatus] = useState<TdiStatus>(isTdiModelReady() ? 'ready' : 'loading');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    if (isTdiModelReady()) { setStatus('ready'); return; }
    setStatus('loading'); setError(null);
    loadTdiModel().then(() => alive && setStatus('ready')).catch((e) => { if (alive) { setStatus('error'); setError(String(e?.message || e)); } });
    return () => { alive = false; };
  }, [attempt]);
  return { status, card: getTdiCard(), error, retry: () => setAttempt((a) => a + 1) };
}
