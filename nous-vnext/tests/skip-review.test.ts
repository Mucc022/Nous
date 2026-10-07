import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryStorage } from '../app/domain/repository';
import { buildReviewEvent } from '../app/domain/review-event';
import { commitReview } from '../app/domain/review-service';
import { ReviewEventRepository } from '../app/domain/learning-repository';

test('skip records evidence and a delayed retrieval time', () => {
  const storage = createMemoryStorage();
  const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'skipped', hintLevelUsed: 0, revealedAnswer: false, userRating: 'skip', effectiveRating: 'forgot', responseTimeMs: 100, contentVersion: '0.1.0', response: '' });
  const next = commitReview({ userId: 'u', storage, event, now: new Date(event.attemptedAt) });
  assert.equal(next.dueAt, '2026-01-01T00:30:00.000Z');
  assert.equal(next.phase, 'relearning');
  assert.equal(new ReviewEventRepository('u', storage).list()[0].correctness, 'skipped');
});
