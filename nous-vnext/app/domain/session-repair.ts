import type { DailyQuestion } from './queue';
import type { RepairEntry } from './repair-pool';

export function appendReadyRepairs(remaining: readonly DailyQuestion[], cards: readonly { cardId: string; questionIds: readonly string[] }[], repairs: readonly RepairEntry[]): DailyQuestion[] {
  const result = [...remaining];
  const queued = new Set(remaining.map(item => item.questionId));
  for (const repair of repairs) {
    if (repair.remainingReviews !== 0 || queued.has(repair.questionId)) continue;
    const card = cards.find(item => item.questionIds.includes(repair.questionId));
    if (!card) continue;
    result.push({ cardId: card.cardId, questionId: repair.questionId, kind: 'repair' });
    queued.add(repair.questionId);
  }
  return result;
}
