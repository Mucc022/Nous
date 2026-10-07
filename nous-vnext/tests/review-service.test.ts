import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryStorage } from '../app/domain/repository';
import { commitReview } from '../app/domain/review-service';
import { buildReviewEvent } from '../app/domain/review-event';
import { LearningStateRepository, ReviewEventRepository } from '../app/domain/learning-repository';

test('event write failure restores prior scheduling and does not append evidence', () => {
  const storage = createMemoryStorage();
  const repo = new LearningStateRepository('u', storage);
  const before = repo.save({ userId: 'u', questionId: 'q', phase: 'review', dueAt: '2026-01-02T00:00:00.000Z', reviewLevel: 2, lapses: 0, successfulReviews: 3 });
  const write = storage.setItem;
  storage.setItem = (key, value) => {
    if (key === 'nous.review-events.v1:u') throw new Error('Simulated event write failure');
    write(key, value);
  };
  const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-02T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0' });
  assert.throws(() => commitReview({ userId: 'u', storage, event, now: new Date(event.attemptedAt) }), /Simulated/);
  assert.deepEqual(new LearningStateRepository('u', storage).get('q'), before);
  assert.deepEqual(new ReviewEventRepository('u', storage).list(), []);
});

test('invalid repair evidence never changes state or appends history', () => {
  const storage = createMemoryStorage();
  const repo = new LearningStateRepository('u', storage);
  const original = repo.save({ userId: 'u', questionId: 'q', phase: 'relearning', dueAt: '2026-01-01T00:30:00.000Z', reviewLevel: 0, lapses: 1, successfulReviews: 0 });
  const base = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:05:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 50, contentVersion: '0.1.0', sessionRepaired: true });
  for (const event of [{ ...base, correctness: 'wrong' as const }, { ...base, correctness: 'skipped' as const }, { ...base, revealedAnswer: true }, { ...base, effectiveRating: 'forgot' as const }]) {
    assert.throws(() => commitReview({ userId: 'u', storage, event, now: new Date(event.attemptedAt) }));
    assert.deepEqual(repo.get('q'), original);
    assert.deepEqual(new ReviewEventRepository('u', storage).list(), []);
  }
});

test('successful session repair preserves long-term due and review stage', () => {
  const storage = createMemoryStorage();
  const repo = new LearningStateRepository('u', storage);
  const original = repo.save({ userId: 'u', questionId: 'q', phase: 'relearning', dueAt: '2026-01-01T00:30:00.000Z', reviewLevel: 0, lapses: 1, successfulReviews: 3 });
  const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:05:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 50, contentVersion: '0.1.0', sessionRepaired: true });
  const next = commitReview({ userId: 'u', storage, event, now: new Date(event.attemptedAt) });
  assert.deepEqual(next, original);
  assert.deepEqual(repo.get('q'), original);
  assert.equal(new ReviewEventRepository('u', storage).list()[0].sessionRepaired, true);
});

test('retrying the same event does not advance learning twice', () => {
  const storage = createMemoryStorage();
  const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 50, contentVersion: '0.1.0' });
  const first = commitReview({ userId: 'u', storage, event, now: new Date(event.attemptedAt) });
  const repeated = commitReview({ userId: 'u', storage, event, now: new Date('2026-01-02T00:00:00Z') });
  assert.deepEqual(repeated, first);
  assert.equal(new ReviewEventRepository('u', storage).list().length, 1);
});

test('conflicting evidence with an existing ID is rejected without changing progress', () => {
  const storage = createMemoryStorage();
  const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 50, contentVersion: '0.1.0' });
  commitReview({ userId: 'u', storage, event, now: new Date(event.attemptedAt) });
  const before = new LearningStateRepository('u', storage).list();
  assert.throws(() => commitReview({ userId: 'u', storage, event: { ...event, effectiveRating: 'forgot' }, now: new Date(event.attemptedAt) }), /冲突/);
  assert.deepEqual(new LearningStateRepository('u', storage).list(), before);
});

test('commitReview writes the next due state and its evidence event together', () => {
  const storage = createMemoryStorage();
  const event = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 50, contentVersion: '0.1.0' });
  const result = commitReview({ userId: 'u', storage, event, now: new Date(event.attemptedAt) });
  assert.equal(result.phase, 'learning');
  assert.equal(result.dueAt, '2026-01-01T00:30:00.000Z');
  assert.equal(new LearningStateRepository('u', storage).get('q')?.dueAt, result.dueAt);
  assert.equal(new ReviewEventRepository('u', storage).list().length, 1);
});

test('commitReview replays from persisted state instead of starting at new', () => {
  const storage = createMemoryStorage();
  const first = buildReviewEvent({ userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 50, contentVersion: '0.1.0' });
  const second = { ...first, eventId: 'evt_second', attemptedAt: '2026-01-01T01:00:00.000Z' };
  commitReview({ userId: 'u', storage, event: first, now: new Date(first.attemptedAt) });
  const result = commitReview({ userId: 'u', storage, event: second, now: new Date(second.attemptedAt) });
  assert.equal(result.dueAt, '2026-01-01T02:00:00.000Z');
  assert.equal(new ReviewEventRepository('u', storage).list().length, 2);
});
