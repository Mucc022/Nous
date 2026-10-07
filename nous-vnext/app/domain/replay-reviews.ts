import type { ReviewEvent } from './review-event';
import type { LearningState } from './scheduler';
import { createMemoryStorage } from './repository';
import { commitJournalReview } from './journal-review-service';
import { ReviewJournal } from './review-journal';
import { parseReviewRequest } from './api-contract';
export function replayReviews(userId: string, events: readonly ReviewEvent[]): LearningState[] {
  const ordered = events.map(event => parseReviewRequest(event, userId)).sort((a, b) => Date.parse(a.attemptedAt) - Date.parse(b.attemptedAt));
  const storage = createMemoryStorage();
  for (const event of ordered) commitJournalReview({ userId, storage, event });
  return new ReviewJournal(userId, storage).read().states;
}
