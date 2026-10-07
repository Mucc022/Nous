import assert from 'node:assert/strict';
import test from 'node:test';
import { buildReviewEvent } from '../app/domain/review-event';

test('event response is a snapshot independent of mutable answer arrays', () => {
  const response = ['a', 'b'];
  const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0', response });
  response[0] = 'changed';
  assert.deepEqual(event.response, ['a', 'b']);
});

test('distinct user/question tuples cannot collide through delimiter ambiguity', () => {
  const base = { attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct' as const, hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember' as const, effectiveRating: 'remember' as const, responseTimeMs: 1, contentVersion: '0.1.0' };
  const a = buildReviewEvent({ ...base, userId: 'a:b', questionId: 'c' });
  const b = buildReviewEvent({ ...base, userId: 'a', questionId: 'b:c' });
  assert.notEqual(a.eventId, b.eventId);
});
test('review event preserves evidence needed to replay scheduling', () => {
  const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 1, revealedAnswer: false, userRating: 'remember', effectiveRating: 'fuzzy', responseTimeMs: 1234, contentVersion: '0.1.0' });
  assert.equal(event.eventId.length > 10, true); assert.equal(event.schedulerVersion, 'baseline-v1'); assert.equal(event.effectiveRating, 'fuzzy');
});
test('event IDs are deterministic for the same event identity', () => {
  const input = { userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'wrong' as const, hintLevelUsed: 0, revealedAnswer: false, userRating: 'forget' as const, effectiveRating: 'forgot' as const, responseTimeMs: 2, contentVersion: '0.1.0' };
  assert.equal(buildReviewEvent(input).eventId, buildReviewEvent(input).eventId);
});
