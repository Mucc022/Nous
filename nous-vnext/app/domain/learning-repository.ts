import type { ReviewEvent } from './review-event';
import type { LearningState } from './scheduler';
import type { StorageLike } from './repository';
import { parseReviewRequest } from './api-contract';

export type StoredLearningState = LearningState & { id: string };
const stateKey = (userId: string) => `nous.learning.v1:${userId}`;
const eventKey = (userId: string) => `nous.review-events.v1:${userId}`;

export function validState(value: unknown): value is StoredLearningState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<StoredLearningState>;
  return typeof state.id === 'string' && typeof state.userId === 'string' && typeof state.questionId === 'string'
    && state.id === `${state.userId}:${state.questionId}` && ['new', 'learning', 'review', 'relearning'].includes(state.phase as string)
    && (state.dueAt === null || (typeof state.dueAt === 'string' && Number.isFinite(Date.parse(state.dueAt))))
    && Number.isInteger(state.reviewLevel) && state.reviewLevel! >= 0
    && Number.isInteger(state.lapses) && state.lapses! >= 0
    && Number.isInteger(state.successfulReviews) && state.successfulReviews! >= 0;
}

export class LearningStateRepository {
  constructor(private readonly userId: string, private readonly storage: StorageLike) {}
  list(): StoredLearningState[] {
    const raw = this.storage.getItem(stateKey(this.userId));
    if (raw === null) return [];
    let parsed: unknown; try { parsed = JSON.parse(raw); } catch { throw new Error('学习状态存储已损坏，未覆盖原数据。'); }
    if (!Array.isArray(parsed) || !parsed.every(validState) || parsed.some(state => state.userId !== this.userId)) throw new Error('学习状态存储已损坏，未覆盖原数据。');
    return parsed;
  }
  get(questionId: string): StoredLearningState | undefined { return this.list().find(state => state.questionId === questionId); }
  ensure(questionId: string): StoredLearningState {
    return this.get(questionId) ?? { id: `${this.userId}:${questionId}`, userId: this.userId, questionId, phase: 'new', dueAt: null, reviewLevel: 0, lapses: 0, successfulReviews: 0 };
  }
  save(state: LearningState): StoredLearningState {
    if (state.userId !== this.userId) throw new Error('不能写入其他用户的学习状态');
    const record = { ...state, id: `${state.userId}:${state.questionId}` };
    if (!validState(record)) throw new Error('无效学习状态，未覆盖原数据。');
    const next = [...this.list().filter(item => item.questionId !== state.questionId), record];
    this.storage.setItem(stateKey(this.userId), JSON.stringify(next)); return record;
  }
  remove(questionId: string): void { this.storage.setItem(stateKey(this.userId), JSON.stringify(this.list().filter(item => item.questionId !== questionId))); }
}

export class ReviewEventRepository {
  constructor(private readonly userId: string, private readonly storage: StorageLike) {}
  list(): ReviewEvent[] {
    const raw = this.storage.getItem(eventKey(this.userId));
    if (raw === null) return [];
    let parsed: unknown; try { parsed = JSON.parse(raw); } catch { throw new Error('复习事件存储已损坏，未覆盖原数据。'); }
    if (!Array.isArray(parsed)) throw new Error('复习事件存储已损坏，未覆盖原数据。');
    return parsed.map(event => parseReviewRequest(event, this.userId));
  }
  append(event: ReviewEvent): void {
    parseReviewRequest(event, this.userId);
    if (event.userId !== this.userId) throw new Error('不能写入其他用户的复习事件');
    const events = this.list();
    const existing = events.find(item => item.eventId === event.eventId);
    if (existing) {
      const fields = Object.keys(event) as (keyof ReviewEvent)[];
      if (Object.keys(existing).length !== fields.length || fields.some(field => JSON.stringify(existing[field]) !== JSON.stringify(event[field]))) throw new Error('复习事件身份冲突，原记录已保留');
      return;
    }
    this.storage.setItem(eventKey(this.userId), JSON.stringify([...events, event]));
  }
}
