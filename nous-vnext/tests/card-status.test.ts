import assert from 'node:assert/strict';
import test from 'node:test';
import { cardStatus } from '../app/domain/card-status';
test('one successful child cannot imply the whole card is mastered', () => {
  const state = { userId: 'u', questionId: 'a', phase: 'learning' as const, dueAt: '2026-01-01T00:30:00Z', reviewLevel: 0, lapses: 0, successfulReviews: 1 };
  const now = new Date('2026-01-01T00:00:00Z');
  assert.equal(cardStatus(['a'], [state], now), 'learning');
  assert.equal(cardStatus(['a', 'b'], [state], now), 'new');
  assert.equal(cardStatus(['a'], [state], new Date('2026-01-01T00:30:00Z')), 'due');
});
