import assert from 'node:assert/strict';
import test from 'node:test';
import { parseReviewRequest, resolveUserId } from '../app/domain/api-contract';

test('review contract rejects undeclared fields', () => {
  const event = { eventId: 'e', userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1', isAdmin: true };
  assert.throws(() => parseReviewRequest(event, 'u'), /unknown/i);
});

test('review timestamps must include an explicit timezone', () => {
  const event = { eventId: 'e', userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' };
  for (const attemptedAt of ['01/02/2026', '2026-01-01', '2026-01-01T00:00:00']) assert.throws(() => parseReviewRequest({ ...event, attemptedAt }, 'u'));
  assert.doesNotThrow(() => parseReviewRequest(event, 'u'));
});

test('submitted response evidence accepts text/arrays but rejects arbitrary objects', () => {
  const base = { eventId: 'e', userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' };
  assert.throws(() => parseReviewRequest({ ...base, response: { invalid: true } }, 'u'));
  assert.throws(() => parseReviewRequest({ ...base, response: [42] }, 'u'));
  assert.doesNotThrow(() => parseReviewRequest({ ...base, response: ['a', 'b'] }, 'u'));
});

test('API rejects effective ratings that contradict attempt evidence', () => {
  const base = { eventId: 'e', userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 1, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' };
  for (const patch of [{ correctness: 'wrong' }, { correctness: 'skipped' }, { revealedAnswer: true }, { hintLevelUsed: 1 }, { userRating: 'forget' }, { userRating: 'fuzzy' }]) {
    assert.throws(() => parseReviewRequest({ ...base, ...patch }, 'u'));
  }
  assert.equal(parseReviewRequest({ ...base, correctness: 'wrong', effectiveRating: 'forgot' }, 'u').effectiveRating, 'forgot');
  assert.equal(parseReviewRequest({ ...base, hintLevelUsed: 1, effectiveRating: 'fuzzy' }, 'u').effectiveRating, 'fuzzy');
});

test('API rejects malformed and contradictory repair flags', () => {
  const base = { eventId: 'evt_repair', userId: 'u', questionId: 'q', attemptedAt: '2026-01-01T00:05:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 50, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' };
  for (const patch of [{ sessionRepaired: 'yes' }, { sessionRepaired: true, correctness: 'wrong' }, { sessionRepaired: true, revealedAnswer: true }, { sessionRepaired: true, effectiveRating: 'forgot' }]) {
    assert.throws(() => parseReviewRequest({ ...base, ...patch }, 'u'));
  }
});

test('a caller-supplied identity header does not authenticate a Tunnel request', () => {
  assert.equal(resolveUserId(new Headers({ 'oai-authenticated-user-id': 'user-123' })), null);
  assert.equal(resolveUserId(new Headers({ 'oai-authenticated-user-id': 'admin', authorization: 'Bearer forged' })), null);
  assert.equal(resolveUserId(new Headers()), null);
});
test('review request requires a matching authenticated user and safe event fields', () => {
  const valid = { eventId: 'evt_1', userId: 'user-123', questionId: 'q_1', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: 100, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' };
  assert.equal(parseReviewRequest(valid, 'user-123').eventId, 'evt_1');
  assert.throws(() => parseReviewRequest(valid, 'other'), /authenticated user/);
  assert.throws(() => parseReviewRequest({ ...valid, effectiveRating: 'admin' }, 'user-123'), /invalid review event/);
});
test('review request rejects missing IDs and invalid timestamps', () => {
  const base = { eventId: 'evt_1', userId: 'user-123', questionId: 'q_1', attemptedAt: '2026-01-01T00:00:00.000Z', correctness: 'correct', hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember', effectiveRating: 'remember', responseTimeMs: null, contentVersion: '0.1.0', schedulerVersion: 'baseline-v1' };
  assert.throws(() => parseReviewRequest({ ...base, questionId: '' }, 'user-123'));
  assert.throws(() => parseReviewRequest({ ...base, attemptedAt: 'not-date' }, 'user-123'));
});
