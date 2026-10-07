import assert from 'node:assert/strict';
import test from 'node:test';
import { readBoundedJson } from '../app/domain/bounded-json';
test('JSON reader rejects oversized actual bytes even without content-length', async () => {
  await assert.rejects(readBoundedJson(new Request('http://localhost', { method: 'POST', body: JSON.stringify({ text: 'x'.repeat(100) }) }), 20), /large/i);
});
test('JSON reader returns parsed value within byte limit', async () => {
  assert.deepEqual(await readBoundedJson(new Request('http://localhost', { method: 'POST', body: '{"ok":true}' }), 20), { ok: true });
});
