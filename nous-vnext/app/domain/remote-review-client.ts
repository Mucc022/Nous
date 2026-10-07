import type { ReviewEvent } from './review-event';

export type SyncResult = 'synced' | 'unavailable' | 'rejected';
export type RemoteReviewLoad = { kind: 'loaded'; states: unknown[]; events: unknown[] } | { kind: 'unavailable' | 'unauthorized' };
export async function syncReviewEvent(event: ReviewEvent, request: typeof fetch = fetch): Promise<SyncResult> {
  try {
    const response = await request('/api/reviews', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(event) });
    if (response.status === 201 || response.status === 200) {
      const body = await response.json() as { event?: Partial<ReviewEvent> } | null;
      const acknowledged = body?.event;
      if (!acknowledged || typeof acknowledged !== 'object') return 'unavailable';
      const fields = Object.keys(event) as (keyof ReviewEvent)[];
      return fields.every(field => JSON.stringify(acknowledged[field]) === JSON.stringify(event[field])) ? 'synced' : 'unavailable';
    }
    if (response.status === 401 || response.status === 400 || response.status === 409) return 'rejected';
    return 'unavailable';
  } catch { return 'unavailable'; }
}
export async function loadRemoteReviews(request: typeof fetch = fetch): Promise<RemoteReviewLoad> {
  try {
    const response = await request('/api/reviews');
    if (response.status === 401) return { kind: 'unauthorized' };
    if (!response.ok) return { kind: 'unavailable' };
    const body = await response.json() as { states?: unknown; events?: unknown };
    if (!body || !Array.isArray(body.states) || !Array.isArray(body.events)) return { kind: 'unavailable' };
    return { kind: 'loaded', states: body.states, events: body.events };
  } catch { return { kind: 'unavailable' }; }
}
