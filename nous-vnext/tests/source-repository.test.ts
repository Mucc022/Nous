import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryStorage } from '../app/domain/repository';
import { SourceRepository } from '../app/domain/source-repository';

test('saved original survives a repository reconstruction', async () => {
  const storage = createMemoryStorage();
  const saved = await new SourceRepository(storage).addText('Notes', 'abc');
  assert.equal(saved.sourceId, 'src_ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.deepEqual(new SourceRepository(storage).list(), [saved]);
});
test('equivalent originals deduplicate without renaming saved content', async () => {
  const repo = new SourceRepository(createMemoryStorage());
  const saved = await repo.addText('Original', 'abc');
  assert.deepEqual(await repo.addText('Different title', '\uFEFFabc\r\n'), saved);
  assert.equal(repo.list().length, 1);
});
test('parallel additions do not lose an original', async () => {
  const storage = createMemoryStorage();
  await Promise.all([new SourceRepository(storage).addText('A', 'a'), new SourceRepository(storage).addText('B', 'b')]);
  assert.equal(new SourceRepository(storage).list().length, 2);
});
test('corruption is reported and never overwritten by an empty replacement', async () => {
  const storage = createMemoryStorage({ 'nous.sources.v1': '{broken' });
  const repo = new SourceRepository(storage);
  assert.throws(() => repo.list(), /损坏/);
  await assert.rejects(repo.addText('A', 'a'));
  assert.equal(storage.getItem('nous.sources.v1'), '{broken');
});
test('wrong storage shape is reported, not treated as empty', () => {
  for (const value of ['{}', '[null]', '[{"sourceId":"x"}]']) {
    assert.throws(() => new SourceRepository(createMemoryStorage({ 'nous.sources.v1': value })).list());
  }
});
test('write failure propagates instead of claiming a saved source', async () => {
  const storage = createMemoryStorage();
  storage.setItem = () => { throw new Error('Quota exceeded'); };
  await assert.rejects(new SourceRepository(storage).addText('A', 'a'), /Quota/);
});
