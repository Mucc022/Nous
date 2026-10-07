import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryStorage } from '../app/domain/repository';
import { enqueueReviewEvent, flushReviewOutbox, listReviewOutbox } from '../app/domain/sync-outbox';

const event = { eventId: 'evt_1', userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct' as const, hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember' as const, effectiveRating: 'remember' as const, responseTimeMs: 1, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' as const };
test('overlapping flushes send each pending event only once', async () => {
  const storage = createMemoryStorage(); enqueueReviewEvent(storage, event);
  let release!: () => void;
  const barrier = new Promise<void>(resolve => { release = resolve; });
  let sends = 0;
  const sync = async () => { sends++; await barrier; return 'synced' as const; };
  const first = flushReviewOutbox(storage, sync);
  const second = flushReviewOutbox(storage, sync);
  release(); await Promise.all([first, second]);
  assert.equal(sends, 1);
  assert.deepEqual(listReviewOutbox(storage), []);
});
test('outbox deduplicates events and survives storage reconstruction', () => {
  const storage = createMemoryStorage(); enqueueReviewEvent(storage, event); enqueueReviewEvent(storage, event);
  assert.deepEqual(listReviewOutbox(storage).map(item => item.eventId), ['evt_1']);
});
test('flush removes only events confirmed by the server', async () => {
  const storage = createMemoryStorage(); enqueueReviewEvent(storage, event); enqueueReviewEvent(storage, { ...event, eventId: 'evt_2' });
  let calls = 0;
  await flushReviewOutbox(storage, async () => { calls++; return calls === 1 ? 'synced' : 'unavailable'; });
  assert.deepEqual(listReviewOutbox(storage).map(item => item.eventId), ['evt_2']);
});
test('corrupt outbox is reported and never replaced by a new event', () => {
  const storage = createMemoryStorage({ 'nous.review-outbox.v1': '{broken' });
  assert.throws(() => enqueueReviewEvent(storage, event));
  assert.equal(storage.getItem('nous.review-outbox.v1'), '{broken');
});
test('conflicting same-ID event is rejected without silently discarding evidence', () => {
  const storage = createMemoryStorage(); enqueueReviewEvent(storage, event);
  assert.throws(() => enqueueReviewEvent(storage, { ...event, questionId: 'different' }));
  assert.deepEqual(listReviewOutbox(storage), [event]);
});
