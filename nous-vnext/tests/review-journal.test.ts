import assert from 'node:assert/strict';
import test from 'node:test';
import { ReviewJournal } from '../app/domain/review-journal';
import { createMemoryStorage } from '../app/domain/repository';
import { buildReviewEvent } from '../app/domain/review-event';
import { LearningStateRepository, ReviewEventRepository } from '../app/domain/learning-repository';
const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0' });
const state = { userId: 'u', questionId: 'q', phase: 'learning' as const, dueAt: '2026-01-01T00:30:00Z', reviewLevel: 0, lapses: 0, successfulReviews: 1 };
test('reordered JSON properties remain an idempotent journal retry', () => {
  const storage = createMemoryStorage(); const journal = new ReviewJournal('u', storage);
  journal.commit(state, event);
  const reordered = Object.fromEntries(Object.entries(event).reverse()) as typeof event;
  assert.doesNotThrow(() => journal.commit(state, reordered));
  assert.equal(journal.read().events.length, 1);
});
test('journal reads legacy state and events without deleting or rewriting either', () => {
  const storage = createMemoryStorage();
  new LearningStateRepository('u', storage).save(state);
  new ReviewEventRepository('u', storage).append(event);
  const oldState = storage.getItem('nous.learning.v1:u');
  const oldEvents = storage.getItem('nous.review-events.v1:u');
  const restored = new ReviewJournal('u', storage).read();
  assert.equal(restored.states[0]?.dueAt, state.dueAt);
  assert.deepEqual(restored.events, [event]);
  assert.equal(storage.getItem('nous.review-journal.v1:u'), null);
  assert.equal(storage.getItem('nous.learning.v1:u'), oldState);
  assert.equal(storage.getItem('nous.review-events.v1:u'), oldEvents);
});
test('journal rejects corrupt states and duplicate evidence without overwriting', () => {
  for (const data of [{ states: [{ ...state, lapses: -1 }], events: [event] }, { states: [state, state], events: [event] }, { states: [state], events: [event, event] }]) {
    const raw = JSON.stringify(data);
    const storage = createMemoryStorage({ 'nous.review-journal.v1:u': raw });
    assert.throws(() => new ReviewJournal('u', storage).read());
    assert.equal(storage.getItem('nous.review-journal.v1:u'), raw);
  }
});
test('journal saves event and state in one write and reloads both', () => {
  const storage = createMemoryStorage(); let writes = 0;
  const write = storage.setItem; storage.setItem = (k, v) => { writes++; write(k, v); };
  new ReviewJournal('u', storage).commit(state, event);
  assert.equal(writes, 1);
  assert.deepEqual(new ReviewJournal('u', storage).read(), { states: [state], events: [event] });
});
test('failed journal write leaves previous pair intact', () => {
  const storage = createMemoryStorage(); const journal = new ReviewJournal('u', storage);
  journal.commit(state, event);
  storage.setItem = () => { throw new Error('Quota'); };
  assert.throws(() => journal.commit({ ...state, successfulReviews: 2 }, { ...event, eventId: 'second' }), /Quota/);
  assert.deepEqual(journal.read(), { states: [state], events: [event] });
});
