import assert from 'node:assert/strict';
import test from 'node:test';
import { countDailyReviews } from '../app/domain/daily-summary';
import { buildReviewEvent } from '../app/domain/review-event';
test('daily count uses actual events on the local calendar day', () => {
  const now = new Date(2026, 0, 2, 12);
  const base = { userId: 'u', questionId: 'q', correctness: 'correct' as const, hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember' as const, effectiveRating: 'remember' as const, responseTimeMs: 1, contentVersion: '0.1.0' };
  const events = [new Date(2026, 0, 2, 1), new Date(2026, 0, 2, 10), new Date(2026, 0, 1, 23)].map(date => buildReviewEvent({ ...base, attemptedAt: date.toISOString() }));
  assert.equal(countDailyReviews(events, now), 2);
  assert.equal(countDailyReviews([], now), 0);
});
