import assert from 'node:assert/strict';
import test from 'node:test';
import fixture from '../fixtures/valid-package.json';
import type { NousPackage } from '../app/domain/content';
import { packageIdentity } from '../app/domain/package-identity';
test('package identity is stable across object key order but changes with content', async () => {
  const a = fixture as NousPackage;
  const b = { cards: a.cards, sources: a.sources, title: a.title, contentVersion: a.contentVersion, format: a.format };
  assert.equal(await packageIdentity(a), await packageIdentity(b));
  const changed = structuredClone(a); changed.cards[0].questions[0].prompt += ' Changed';
  assert.notEqual(await packageIdentity(a), await packageIdentity(changed));
});
