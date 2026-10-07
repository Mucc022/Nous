import type { StorageLike } from './repository';
import type { ReviewEvent } from './review-event';
import { nextLearningState, type LearningState } from './scheduler';
import { ReviewJournal } from './review-journal';
import { parseReviewRequest } from './api-contract';
export function commitJournalReview(input: { userId: string; storage: StorageLike; event: ReviewEvent }): LearningState {
  const event = parseReviewRequest(input.event, input.userId);
  const journal = new ReviewJournal(input.userId, input.storage);
  const data = journal.read();
  const previous = data.states.find(state => state.questionId === event.questionId);
  const recorded = data.events.find(item => item.eventId === event.eventId);
  if (recorded) {
    const keys = Object.keys(event) as (keyof ReviewEvent)[];
    if (keys.length !== Object.keys(recorded).length || keys.some(key => JSON.stringify(recorded[key]) !== JSON.stringify(event[key]))) throw new Error('Review event conflict');
    if (!previous) throw new Error('Review state missing');
    return previous;
  }
  const current = previous ?? { userId: input.userId, questionId: event.questionId, phase: 'new' as const, dueAt: null, reviewLevel: 0, lapses: 0, successfulReviews: 0 };
  if (event.sessionRepaired && !previous?.dueAt) throw new Error('Repair requires prior scheduled state');
  const next = event.sessionRepaired ? current : nextLearningState(current, event.effectiveRating, new Date(event.attemptedAt));
  journal.commit(next, event);
  return next;
}
