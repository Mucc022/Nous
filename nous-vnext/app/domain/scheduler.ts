import type { EffectiveRating } from './study-engine';
export type Phase = 'new' | 'learning' | 'review' | 'relearning';
export type LearningState = { userId: string; questionId: string; phase: Phase; dueAt: string | null; reviewLevel: number; lapses: number; successfulReviews: number };
const intervals = [30, 60, 1440, 4320, 10080, 43200];
function due(now: Date, minutes: number): string { return new Date(now.getTime() + minutes * 60_000).toISOString(); }
export function nextLearningState(state: LearningState, rating: EffectiveRating, now: Date): LearningState {
  if (!Number.isFinite(now.getTime())) throw new Error('Invalid scheduler clock');
  if (![state.reviewLevel, state.lapses, state.successfulReviews].every(value => Number.isSafeInteger(value) && value >= 0)
    || state.reviewLevel >= intervals.length) throw new Error('Invalid learning counters');
  if (!['new', 'learning', 'review', 'relearning'].includes(state.phase) || !['remember', 'fuzzy', 'forgot'].includes(rating)) throw new Error('Invalid scheduling phase or rating');
  if (rating === 'forgot') return { ...state, phase: 'relearning', dueAt: due(now, 30), reviewLevel: 0, lapses: state.lapses + 1 };
  if (rating === 'fuzzy') {
    const level = Math.max(0, state.reviewLevel);
    return { ...state, phase: state.phase === 'new' ? 'learning' : state.phase, dueAt: due(now, intervals[level] ?? intervals.at(-1)!), reviewLevel: level, successfulReviews: state.successfulReviews + 1 };
  }
  const level = state.phase === 'new' ? 0 : Math.min(state.reviewLevel + 1, intervals.length - 1);
  return { ...state, phase: level >= 2 ? 'review' : 'learning', dueAt: due(now, intervals[level]), reviewLevel: level, successfulReviews: state.successfulReviews + 1 };
}
