import assert from 'node:assert/strict';
import test from 'node:test';
import { buildReviewEvent } from '../app/domain/review-event';
import { replayReviews } from '../app/domain/replay-reviews';
test('history replay preserves delayed due across wrong and repair events', () => {
  const wrong = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'wrong', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'forgot', responseTimeMs: 1, contentVersion: '0.1.0' });
  const repaired = buildReviewEvent({ ...wrong, attemptedAt: '2026-01-01T00:05:00Z', correctness: 'correct', effectiveRating: 'remember', sessionRepaired: true });
  const states = replayReviews('u', [repaired, wrong]);
  assert.equal(states.length, 1);
  assert.equal(states[0].dueAt, '2026-01-01T00:30:00.000Z');
  assert.equal(states[0].successfulReviews, 0);
  assert.equal(states[0].lapses, 1);
  assert.deepEqual(replayReviews('u', [wrong, wrong, repaired]), states);
  assert.throws(() => replayReviews('other', [wrong]));
});
test('conflicting duplicate event evidence blocks replay without mutating input', () => {
  const first = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0' });
  const conflict = { ...first, responseTimeMs: 99 };
  const events = [first, conflict];
  const before = structuredClone(events);
  assert.throws(() => replayReviews('u', events), /conflict/i);
  assert.deepEqual(events, before);
});
