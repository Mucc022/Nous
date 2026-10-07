import type { EffectiveRating, UserRating } from './study-engine';
export type Correctness = 'correct' | 'wrong' | 'self_assessed' | 'skipped';
export type ReviewEvent = { eventId: string; userId: string; questionId: string; attemptedAt: string; correctness: Correctness; hintLevelUsed: number; revealedAnswer: boolean; userRating: UserRating; effectiveRating: EffectiveRating; responseTimeMs: number | null; contentVersion: string; schedulerVersion: 'baseline-v1'; sessionRepaired?: boolean; response?: string | string[] };
export function buildReviewEvent(input: Omit<ReviewEvent, 'eventId' | 'schedulerVersion'>): ReviewEvent {
  const identity = JSON.stringify([input.userId, input.questionId, input.attemptedAt]);
  const snapshot = Array.isArray(input.response) ? { ...input, response: [...input.response] } : { ...input };
  return { ...snapshot, eventId: `evt_v2_${encodeURIComponent(identity)}`, schedulerVersion: 'baseline-v1' };
}
