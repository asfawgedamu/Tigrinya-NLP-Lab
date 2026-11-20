#!/usr/bin/env node
// Installs a trained model bundle into this site and verifies it.
//   node scripts/install-model.mjs <folder-with-bundle>
// The folder must contain: tdi_model.json, model_card.json, data_report.json, parity_cases.json
// (the four files notebook 02 writes to its models/ and reports/ folders).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) { console.error('Usage: node scripts/install-model.mjs <folder-with-bundle>'); process.exit(2); }

const need = { 'tdi_model.json': 'public/models/tdi_model.json', 'model_card.json': 'public/models/model_card.json',
  'data_report.json': 'public/models/data_report.json', 'parity_cases.json': 'tests/fixtures/parity_cases.json' };
const find = (name) => {
  for (const d of [src, path.join(src, 'models'), path.join(src, 'reports'), path.join(src, 'deploy')]) {
    const f = path.join(d, name); if (fs.existsSync(f)) return f;
  }
  return null;
};
const missing = Object.keys(need).filter((n) => !find(n));
if (missing.length) { console.error('Missing from bundle: ' + missing.join(', ')); process.exit(1); }

const model = JSON.parse(fs.readFileSync(find('tdi_model.json'), 'utf8'));
if (model.format !== 'tdi-linear-v1') { console.error(`Unsupported model format "${model.format}" (expected tdi-linear-v1)`); process.exit(1); }
if (!model.labels?.length || model.tfidf.features.length !== model.tfidf.idf.length) { console.error('Model file is inconsistent.'); process.exit(1); }
for (const l of ['Z', 'L', 'D']) if (!model.labels.includes(l)) { console.error('Model lacks label ' + l); process.exit(1); }

for (const [name, dest] of Object.entries(need)) {
  fs.mkdirSync(path.dirname(path.join(root, dest)), { recursive: true });
  fs.copyFileSync(find(name), path.join(root, dest));
  console.log('copied', name, '->', dest);
}
const sha = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, need['tdi_model.json']))).digest('hex');
const card = JSON.parse(fs.readFileSync(find('model_card.json'), 'utf8')).evaluation_train_only_model_on_heldout_test;
console.log(`\nInstalled. sha256 ${sha}\nheld-out accuracy ${card.accuracy}, macro-F1 ${card.macro_f1} (${card.macro_f1_95ci})`);
console.log('Next: npm run test:model && npm run typecheck && npm run build');
