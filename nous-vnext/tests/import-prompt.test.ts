import assert from 'node:assert/strict';
import test from 'node:test';
import { buildImportPrompt } from '../app/domain/import-prompt';
import { createSourceDocument } from '../app/domain/source-store';

test('prompt exports actual saved source identifiers, text and schema contract', async () => {
  const source = await createSourceDocument('src_test', 'Notes', 'Retrieval strengthens memory.');
  const prompt = buildImportPrompt([source]);
  assert.ok(prompt.includes(JSON.stringify([source], null, 2)));
  assert.ok(prompt.includes('nous-package-v0.1'));
  assert.ok(prompt.includes('sourceRefs'));
  assert.ok(prompt.includes('additionalProperties'));
});
test('prompt cannot be generated without original sources', () => {
  assert.throws(() => buildImportPrompt([]), /原文/);
});
