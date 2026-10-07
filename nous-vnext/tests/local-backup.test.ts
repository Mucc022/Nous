import assert from 'node:assert/strict';
import test from 'node:test';
import { createLocalBackup } from '../app/domain/local-backup';
test('backup preserves original Nous values including corrupt JSON but excludes unrelated secrets', () => {
  const values: Record<string,string> = { 'nous.cards.v1': '{broken', 'nous.sources.v1': '[]', 'nous.note.v1:["u","q"]': 'note', 'auth.token': 'secret', 'other-app': 'private' };
  const keys = Object.keys(values);
  const backup = JSON.parse(createLocalBackup({ length: keys.length, key: index => keys[index] ?? null, getItem: key => values[key] ?? null }));
  assert.equal(backup.format, 'nous-local-backup-v1');
  assert.equal(backup.entries['nous.cards.v1'], '{broken');
  assert.equal(backup.entries['nous.note.v1:["u","q"]'], 'note');
  assert.equal(backup.entries['auth.token'], undefined);
  assert.equal(backup.entries['other-app'], undefined);
});
test('backup includes unified journals, immutable content and scoped notes', () => {
  const values: Record<string, string> = {
    'nous.folders.v1': '[{"id":"folder:1","name":"课程","parentId":null}]',
    'nous.folder-edits.v1': '{"folder:1":{"name":"课程","icon":"Book","color":null}}',
    'nous.review-journal.v1:u': '{"states":[],"events":[]}',
    'nous.content.v1:pkg_example': '{"contentVersion":"0.1.0"}',
    'nous.note.v1:["u","q"]': 'my note',
    'nous.auth.token': 'must-not-export',
  };
  const keys = Object.keys(values);
  const result = JSON.parse(createLocalBackup({ length: keys.length, key: index => keys[index] ?? null, getItem: key => values[key] ?? null }));
  assert.equal(result.entries['nous.review-journal.v1:u'], values['nous.review-journal.v1:u']);
  assert.equal(result.entries['nous.content.v1:pkg_example'], values['nous.content.v1:pkg_example']);
  assert.equal(result.entries['nous.note.v1:["u","q"]'], 'my note');
  assert.equal(result.entries['nous.folders.v1'], values['nous.folders.v1']);
  assert.equal(result.entries['nous.folder-edits.v1'], values['nous.folder-edits.v1']);
  assert.equal(result.entries['nous.auth.token'], undefined);
});
