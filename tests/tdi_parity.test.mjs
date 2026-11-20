// Proves the browser model gives the same probabilities as the Python (scikit-learn) model it was exported from.
// Run: npm run test:model
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { prepareModel, predict, explain } from '../src/lib/tdiInfer.mjs';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url));
const modelBytes = read('../public/models/tdi_model.json');
const model = prepareModel(JSON.parse(modelBytes.toString('utf8')));
const cases = JSON.parse(read('./fixtures/parity_cases.json').toString('utf8'));
const list = cases;

test('model file is the expected format and has 3 labels', () => {
  assert.equal(model.format, 'tdi-linear-v1');
  assert.deepEqual([...model.labels].sort(), ['D', 'L', 'Z']);
  assert.equal(model.tfidf.features.length, model.tfidf.idf.length);
});

test('model card and model file are present together', () => {
  const card = JSON.parse(read('../public/models/model_card.json').toString('utf8'));
  assert.ok(card.evaluation_train_only_model_on_heldout_test.macro_f1 > 0.5);
  assert.match(crypto.createHash('sha256').update(modelBytes).digest('hex'), /^[0-9a-f]{64}$/);
});

test(`JavaScript matches Python on all ${list.length} fixture cases`, () => {
  let worst = 0;
  let classified = 0;
  for (const c of list) {
    const r = predict(model, c.text);
    if (!c.accepted) { assert.equal(r.ok, false, `should refuse: ${JSON.stringify(c.text)}`); continue; }
    assert.equal(r.ok, true, `should classify: ${JSON.stringify(c.text)}`);
    assert.equal(r.label, c.label, `label differs for ${JSON.stringify(c.text)}`);
    for (const l of model.labels) worst = Math.max(worst, Math.abs(r.probabilities[l] - c.probs[l]));
    classified++;
  }
  assert.ok(classified > 0);
  assert.ok(worst < 1e-9, `largest probability difference ${worst}`);
});

test('explain() returns sorted, positive contributions and nothing for refused text', () => {
  assert.deepEqual(explain(model, 'hello world'), []);
  const e = explain(model, list.find((c) => c.accepted).text, 6);
  assert.ok(e.length > 0);
  for (let i = 0; i < e.length; i++) { assert.ok(e[i].contribution > 0); if (i) assert.ok(e[i - 1].contribution >= e[i].contribution); }
});
