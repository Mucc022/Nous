import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryStorage } from '../app/domain/repository';
import { buildReviewEvent } from '../app/domain/review-event';
import { ReviewJournal } from '../app/domain/review-journal';
import { commitJournalReview } from '../app/domain/journal-review-service';
test('journal service schedules once and retries without extra evidence', () => {
  const storage = createMemoryStorage();
  const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0' });
  const input = { userId: 'u', storage, event };
  const first = commitJournalReview(input);
  assert.equal(first.dueAt, '2026-01-01T00:30:00.000Z');
  assert.deepEqual(commitJournalReview(input), first);
  assert.equal(new ReviewJournal('u', storage).read().events.length, 1);
});
