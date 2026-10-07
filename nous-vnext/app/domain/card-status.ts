import type { LearningState } from './scheduler';
export function cardStatus(ids: readonly string[], states: readonly LearningState[], now: Date): 'new' | 'due' | 'learning' | 'review' {
  const children = ids.map(id => states.find(state => state.questionId === id));
  if (children.some(state => state?.dueAt && Date.parse(state.dueAt) <= now.getTime())) return 'due';
  if (!children.length || children.some(state => !state || state.phase === 'new')) return 'new';
  if (children.some(state => state?.phase !== 'review')) return 'learning';
  return 'review';
}
