import assert from 'node:assert/strict';
import test from 'node:test';
import fixture from '../fixtures/valid-package.json';
import type { NousPackage } from '../app/domain/content';
import { ContentRepository } from '../app/domain/content-repository';
import { createMemoryStorage } from '../app/domain/repository';
test('immutable packages survive reopening and changed content keeps both versions', async () => {
  const storage = createMemoryStorage();
  const repo = new ContentRepository(storage);
  const original = fixture as NousPackage;
  const first = await repo.save(original);
  assert.deepEqual(new ContentRepository(storage).get(first), original);
  const changed = structuredClone(original); changed.contentVersion = '0.2.0';
  const second = await repo.save(changed);
  assert.notEqual(first, second);
  assert.deepEqual(repo.get(first), original);
  assert.deepEqual(repo.get(second), changed);
});
