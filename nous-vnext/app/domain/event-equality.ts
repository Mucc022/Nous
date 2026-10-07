import type { ReviewEvent } from './review-event';
export function sameReviewEvent(a: ReviewEvent, b: ReviewEvent): boolean {
  const fields = Object.keys(a) as (keyof ReviewEvent)[];
  return fields.length === Object.keys(b).length && fields.every(field => JSON.stringify(a[field]) === JSON.stringify(b[field]));
}
