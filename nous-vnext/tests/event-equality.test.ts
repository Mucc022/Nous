import assert from 'node:assert/strict';
import test from 'node:test';
import { sameReviewEvent } from '../app/domain/event-equality';
import { buildReviewEvent } from '../app/domain/review-event';
test('event equality ignores object key order but preserves response order and evidence', () => {
  const a = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0', response: ['a','b'] });
  const reordered = Object.fromEntries(Object.entries(a).reverse()) as typeof a;
  assert.equal(sameReviewEvent(a, reordered), true);
  assert.equal(sameReviewEvent(a, { ...a, response: ['b','a'] }), false);
  assert.equal(sameReviewEvent(a, { ...a, revealedAnswer: true }), false);
});
