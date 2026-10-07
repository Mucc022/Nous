export type QueueItem = { questionId: string; phase: 'new' | 'learning' | 'review' | 'relearning'; dueAt: string | null };
export type DailyQuestion = { cardId: string; questionId: string; kind: 'repair' | 'due' | 'new' };
export function advanceDailyQuestion(queue: readonly DailyQuestion[], currentQuestionId: string): DailyQuestion | null {
  const index = queue.findIndex(item => item.questionId === currentQuestionId);
  return index >= 0 && index + 1 < queue.length ? queue[index + 1] : null;
}
export function buildDailyQueue(items: readonly QueueItem[], now: Date): QueueItem[] {
  return items.filter(item => item.phase === 'new' || (item.dueAt !== null && new Date(item.dueAt).getTime() <= now.getTime()));
}
export function addRepair(pool: readonly string[], questionId: string): string[] { return pool.includes(questionId) ? [...pool] : [...pool, questionId]; }
export function resolveRepair(pool: readonly string[], questionId: string): string[] { return pool.filter(id => id !== questionId); }
export function buildDailyQuestionQueue(cards: readonly { cardId: string; questionIds: readonly string[] }[], states: readonly QueueItem[], repairs: readonly { questionId: string; remainingReviews: number }[], now: Date): DailyQuestion[] {
  const stateByQuestion = new Map(states.map(state => [state.questionId, state]));
  const repairIds = new Set(repairs.filter(entry => entry.remainingReviews === 0).map(entry => entry.questionId));
  const waitingRepairIds = new Set(repairs.filter(entry => entry.remainingReviews > 0).map(entry => entry.questionId));
  const result: DailyQuestion[] = [];
  for (const card of cards) for (const questionId of card.questionIds) {
    if (waitingRepairIds.has(questionId)) continue;
    const state = stateByQuestion.get(questionId);
    const kind = repairIds.has(questionId) ? 'repair' : !state || state.phase === 'new' ? 'new' : state.dueAt && new Date(state.dueAt).getTime() <= now.getTime() ? 'due' : null;
    if (kind) result.push({ cardId: card.cardId, questionId, kind });
  }
  return result.sort((a, b) => ({ repair: 0, due: 1, new: 2 }[a.kind] - { repair: 0, due: 1, new: 2 }[b.kind]));
}
