import assert from 'node:assert/strict';
import test from 'node:test';
import { loadRemoteReviews, syncReviewEvent } from '../app/domain/remote-review-client';

const event = { eventId: 'evt_1', userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct' as const, hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember' as const, effectiveRating: 'remember' as const, responseTimeMs: 1, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' as const };
test('sync reports success for a created server record', async () => assert.equal(await syncReviewEvent(event, async () => Response.json({ event }, { status: 201 })), 'synced'));
test('successful HTTP without matching evidence never acknowledges an event', async () => {
  for (const body of [{}, null, { event: { ...event, userId: 'other' } }, { event: { ...event, effectiveRating: 'forgot' } }]) {
    assert.equal(await syncReviewEvent(event, async () => Response.json(body)), 'unavailable');
  }
  assert.equal(await syncReviewEvent(event, async () => new Response('<html>login</html>')), 'unavailable');
});
test('sync treats unavailable backend as safe local fallback', async () => assert.equal(await syncReviewEvent(event, async () => new Response('{}', { status: 503 })), 'unavailable'));
test('sync reports auth or validation rejection without throwing', async () => assert.equal(await syncReviewEvent(event, async () => new Response('{}', { status: 401 })), 'rejected'));
test('sync reports network failure without throwing', async () => assert.equal(await syncReviewEvent(event, async () => { throw new Error('offline'); }), 'unavailable'));
test('load returns server learning evidence for authenticated users', async () => {
  const result = await loadRemoteReviews(async () => new Response(JSON.stringify({ states: [{ questionId: 'q' }], events: [] }), { status: 200 }));
  assert.equal(result.kind, 'loaded');
  if (result.kind === 'loaded') assert.equal((result.states[0] as { questionId: string }).questionId, 'q');
});
test('load safely falls back when backend is unavailable or unauthorized', async () => {
  assert.equal((await loadRemoteReviews(async () => new Response('{}', { status: 503 }))).kind, 'unavailable');
  assert.equal((await loadRemoteReviews(async () => new Response('{}', { status: 401 }))).kind, 'unauthorized');
});
test('malformed successful load is not accepted as an empty history', async () => {
  for (const body of [{}, { states: [], events: null }, { states: 'broken', events: [] }]) {
    assert.equal((await loadRemoteReviews(async () => Response.json(body))).kind, 'unavailable');
  }
});
