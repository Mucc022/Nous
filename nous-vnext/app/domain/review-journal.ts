import type { StorageLike } from './repository';
import type { LearningState } from './scheduler';
import type { ReviewEvent } from './review-event';
import { parseReviewRequest } from './api-contract';
import { validState, LearningStateRepository, ReviewEventRepository } from './learning-repository';
export type ReviewJournalData = { states: LearningState[]; events: ReviewEvent[] };
export class ReviewJournal {
  constructor(private readonly userId: string, private readonly storage: StorageLike) {}
  private get key(): string { return `nous.review-journal.v1:${this.userId}`; }
  read(): ReviewJournalData {
    const raw = this.storage.getItem(this.key);
    const data: ReviewJournalData = raw === null
      ? { states: new LearningStateRepository(this.userId, this.storage).list(), events: new ReviewEventRepository(this.userId, this.storage).list() }
      : JSON.parse(raw) as ReviewJournalData;
    if (!data || !Array.isArray(data.states) || !Array.isArray(data.events)) throw new Error('Invalid review journal');
    data.events.forEach(event => parseReviewRequest(event, this.userId));
    if (data.states.some(state => !state || state.userId !== this.userId || !validState({ ...state, id: `${state.userId}:${state.questionId}` }))) throw new Error('Invalid journal state');
    if (new Set(data.states.map(state => state.questionId)).size !== data.states.length || new Set(data.events.map(event => event.eventId)).size !== data.events.length) throw new Error('Duplicate journal identity');
    return data;
  }
  commit(state: LearningState, event: ReviewEvent): void {
    parseReviewRequest(event, this.userId);
    if (state.userId !== this.userId || state.questionId !== event.questionId) throw new Error('Journal identity mismatch');
    if (!validState({ ...state, id: `${state.userId}:${state.questionId}` })) throw new Error('Invalid journal state');
    const previous = this.read();
    const existing = previous.events.find(item => item.eventId === event.eventId);
    if (existing) {
      const fields = Object.keys(event) as (keyof ReviewEvent)[];
      if (fields.length !== Object.keys(existing).length || fields.some(field => JSON.stringify(existing[field]) !== JSON.stringify(event[field]))) throw new Error('Journal event conflict');
      return;
    }
    const next = { states: [...previous.states.filter(item => item.questionId !== state.questionId), state], events: [...previous.events, event] };
    this.storage.setItem(this.key, JSON.stringify(next));
  }
}
