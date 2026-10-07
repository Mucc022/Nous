import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryStorage } from '../app/domain/repository';
import { LearningStateRepository, ReviewEventRepository } from '../app/domain/learning-repository';

test('event repository rejects malformed or foreign evidence without overwriting storage', () => {
  const event = { eventId: 'e', userId: 'other', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' };
  for (const records of [[null], [{}], [event]]) {
    const raw = JSON.stringify(records);
    const storage = createMemoryStorage({ 'nous.review-events.v1:u': raw });
    assert.throws(() => new ReviewEventRepository('u', storage).list());
    assert.equal(storage.getItem('nous.review-events.v1:u'), raw);
  }
});

test('stored foreign-user learning state cannot be read as current user', () => {
  const foreign = { id: 'other:q', userId: 'other', questionId: 'q', phase: 'new', dueAt: null, reviewLevel: 0, lapses: 0, successfulReviews: 0 };
  const storage = createMemoryStorage({ 'nous.learning.v1:u': JSON.stringify([foreign]) });
  assert.throws(() => new LearningStateRepository('u', storage).list());
});
test('invalid scheduling counters are rejected before overwriting saved progress', () => {
  const storage = createMemoryStorage();
  const repo = new LearningStateRepository('u', storage);
  const state = repo.ensure('q'); repo.save(state);
  const before = storage.getItem('nous.learning.v1:u');
  assert.throws(() => repo.save({ ...state, lapses: -1 }));
  assert.throws(() => repo.save({ ...state, dueAt: 'not-date' }));
  assert.equal(storage.getItem('nous.learning.v1:u'), before);
});

test('learning state is independent from immutable content and reloads', () => {
  const storage = createMemoryStorage();
  const first = new LearningStateRepository('local-user', storage);
  const state = first.ensure('q1');
  assert.equal(state.id, 'local-user:q1');
  first.save({ ...state, phase: 'review', dueAt: '2026-01-01T00:00:00.000Z', reviewLevel: 2 });
  const second = new LearningStateRepository('local-user', storage);
  assert.equal(second.get('q1')?.phase, 'review');
  assert.equal(second.get('q1')?.reviewLevel, 2);
  assert.equal(new LearningStateRepository('other-user', storage).get('q1'), undefined);
});

test('ensure is idempotent and preserves progress', () => {
  const repo = new LearningStateRepository('u', createMemoryStorage());
  const initial = repo.ensure('q');
  repo.save({ ...initial, successfulReviews: 4 });
  assert.equal(repo.ensure('q').successfulReviews, 4);
});

test('review events append without replacing earlier evidence', () => {
  const storage = createMemoryStorage();
  const repo = new ReviewEventRepository('u', storage);
  const a = { eventId: 'evt_a', userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'wrong' as const, hintLevelUsed: 0, revealedAnswer: false, userRating: 'forget' as const, effectiveRating: 'forgot' as const, responseTimeMs: 100, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' as const };
  const b = { ...a, eventId: 'evt_b', attemptedAt: '2026-01-01T01:00:00.000Z' };
  repo.append(a); repo.append(b); repo.append(a);
  assert.deepEqual(repo.list().map(event => event.eventId), ['evt_a', 'evt_b']);
});

test('malformed learning storage fails closed with an explicit error', () => {
  assert.throws(() => new LearningStateRepository('u', createMemoryStorage({ 'nous.learning.v1:u': '{bad' })).list(), /学习状态存储已损坏/);
});
test('event repository rejects conflicting duplicate IDs without replacing history', () => {
  const storage = createMemoryStorage();
  const repo = new ReviewEventRepository('u', storage);
  const event = { eventId: 'e', userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'correct' as const, hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember' as const, effectiveRating: 'remember' as const, responseTimeMs: 1, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' as const };
  repo.append(event);
  assert.throws(() => repo.append({ ...event, questionId: 'other' }));
  assert.deepEqual(repo.list(), [event]);
});
