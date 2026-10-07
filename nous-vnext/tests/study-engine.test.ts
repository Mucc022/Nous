import assert from 'node:assert/strict';
import test from 'node:test';
import { effectiveRating, gradeAttempt, type AttemptContext } from '../app/domain/study-engine';
import { nextLearningState, type LearningState } from '../app/domain/scheduler';

test('scheduler rejects corrupted counters and invalid clocks before scheduling', () => {
  const state: LearningState = { userId: 'u', questionId: 'q', phase: 'review', dueAt: null, reviewLevel: 2, lapses: 0, successfulReviews: 2 };
  for (const patch of [{ reviewLevel: -1 }, { reviewLevel: 99 }, { lapses: -1 }, { successfulReviews: 1.5 }]) {
    assert.throws(() => nextLearningState({ ...state, ...patch }, 'remember', new Date('2026-01-01T00:00:00Z')));
  }
  assert.throws(() => nextLearningState(state, 'remember', new Date('invalid')));
});

const base: AttemptContext = { questionType: 'short_answer', submitted: true, correct: true, hintLevelUsed: 0, revealedAnswer: false, userRating: 'remember' };
test('independent correct answer can be remembered', () => assert.equal(effectiveRating(base), 'remember'));
test('substantive hint caps a correct answer at fuzzy', () => assert.equal(effectiveRating({ ...base, hintLevelUsed: 1 }), 'fuzzy'));
test('reveal caps even a claimed remember at forgot', () => assert.equal(effectiveRating({ ...base, revealedAnswer: true }), 'forgot'));
test('objective wrong answer is forgot even when user clicks remember', () => assert.equal(effectiveRating({ ...base, questionType: 'single_choice', correct: false }), 'forgot'));
test('skip is recorded as forgot and enters repair', () => assert.deepEqual(gradeAttempt({ ...base, submitted: false, userRating: 'skip' }), { effectiveRating: 'forgot', repair: true }));
test('baseline scheduler advances remember through transparent intervals', () => {
  const state: LearningState = { userId: 'u', questionId: 'q', phase: 'new', dueAt: null, reviewLevel: 0, lapses: 0, successfulReviews: 0 };
  const next = nextLearningState(state, 'remember', new Date('2026-01-01T00:00:00Z'));
  assert.equal(next.phase, 'learning'); assert.equal(next.dueAt, '2026-01-01T00:30:00.000Z');
});
test('forget re-enters relearning at thirty minutes', () => {
  const state: LearningState = { userId: 'u', questionId: 'q', phase: 'review', dueAt: null, reviewLevel: 3, lapses: 0, successfulReviews: 4 };
  const next = nextLearningState(state, 'forgot', new Date('2026-01-01T00:00:00Z'));
  assert.equal(next.phase, 'relearning'); assert.equal(next.lapses, 1); assert.equal(next.dueAt, '2026-01-01T00:30:00.000Z');
});
