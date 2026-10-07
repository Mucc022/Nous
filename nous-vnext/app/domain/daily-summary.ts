import type { ReviewEvent } from './review-event';
export function countDailyReviews(events: readonly ReviewEvent[], now: Date): number {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  return events.filter(event => { const time = Date.parse(event.attemptedAt); return time >= start && time < end; }).length;
}
