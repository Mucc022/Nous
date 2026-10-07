export type RepairEntry = { questionId: string; remainingReviews: number };
export function enqueueRepair(pool: readonly RepairEntry[], questionId: string, delay = 2): RepairEntry[] {
  if (!Number.isSafeInteger(delay) || delay < 0) throw new Error('Repair delay must be a nonnegative safe integer');
  return pool.some(entry => entry.questionId === questionId) ? [...pool] : [...pool, { questionId, remainingReviews: Math.max(0, delay) }];
}
export function advanceRepairPool(pool: readonly RepairEntry[], completedQuestionId: string): RepairEntry[] {
  return pool.filter(entry => entry.questionId !== completedQuestionId).map(entry => ({ ...entry, remainingReviews: Math.max(0, entry.remainingReviews - 1) }));
}
export function readyRepairIds(pool: readonly RepairEntry[]): string[] { return pool.filter(entry => entry.remainingReviews === 0).map(entry => entry.questionId); }
