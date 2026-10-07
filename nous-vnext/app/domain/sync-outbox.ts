import type { ReviewEvent } from './review-event';
import type { StorageLike } from './repository';
import { syncReviewEvent, type SyncResult } from './remote-review-client';

const key = 'nous.review-outbox.v1';
export function listReviewOutbox(storage: StorageLike): ReviewEvent[] {
  const raw = storage.getItem(key);
  if (raw === null) return [];
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error('同步队列损坏；原数据已保留'); }
  if (!Array.isArray(parsed) || parsed.some(event => !event || typeof event.eventId !== 'string')) throw new Error('同步队列结构损坏；原数据已保留');
  return parsed;
}
export function enqueueReviewEvent(storage: StorageLike, event: ReviewEvent): void {
  const current = listReviewOutbox(storage);
  const existing = current.find(item => item.eventId === event.eventId);
  if (existing) {
    const fields = Object.keys(event) as (keyof ReviewEvent)[];
    if (Object.keys(existing).length !== fields.length || fields.some(field => JSON.stringify(existing[field]) !== JSON.stringify(event[field]))) throw new Error('同步事件身份冲突；原数据已保留');
    return;
  }
  storage.setItem(key, JSON.stringify([...current, event]));
}
const activeFlushes = new WeakMap<StorageLike, Promise<void>>();
export function flushReviewOutbox(storage: StorageLike, sync: (event: ReviewEvent) => Promise<SyncResult> = syncReviewEvent): Promise<void> {
  const existing = activeFlushes.get(storage);
  if (existing) return existing;
  const task = Promise.resolve().then(async () => {
    for (const event of listReviewOutbox(storage)) if (await sync(event) === 'synced') storage.setItem(key, JSON.stringify(listReviewOutbox(storage).filter(item => item.eventId !== event.eventId)));
  }).finally(() => { activeFlushes.delete(storage); });
  activeFlushes.set(storage, task);
  return task;
}
