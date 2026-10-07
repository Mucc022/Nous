import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDailyQueue, addRepair, resolveRepair, buildDailyQuestionQueue, advanceDailyQuestion, type QueueItem } from '../app/domain/queue';
const items: QueueItem[] = [
  { questionId: 'new', phase: 'new', dueAt: null },
  { questionId: 'due', phase: 'review', dueAt: '2026-01-01T00:00:00.000Z' },
  { questionId: 'later', phase: 'review', dueAt: '2026-01-02T00:00:00.000Z' },
];
test('daily queue includes new and due questions only', () => assert.deepEqual(buildDailyQueue(items, new Date('2026-01-01T12:00:00Z')).map(i => i.questionId), ['new', 'due']));
test('repair pool deduplicates and resolution removes question', () => {
  let pool = addRepair(addRepair([], 'q1'), 'q1'); assert.deepEqual(pool, ['q1']);
  pool = resolveRepair(pool, 'q1'); assert.deepEqual(pool, []);
});
test('daily question queue prioritizes ready repair, then due, then new', () => {
  const queue = buildDailyQuestionQueue(
    [{ cardId: 'c1', questionIds: ['new', 'due'] }, { cardId: 'c2', questionIds: ['repair'] }],
    [{ questionId: 'due', phase: 'review', dueAt: '2026-01-01T00:00:00.000Z' }],
    [{ questionId: 'repair', remainingReviews: 0 }],
    new Date('2026-01-01T12:00:00Z'),
  );
  assert.deepEqual(queue.map(item => item.questionId), ['repair', 'due', 'new']);
});
test('session advances to the next queued question and ends at the last one', () => {
  const queue = [{ cardId: 'c', questionId: 'a', kind: 'due' as const }, { cardId: 'c', questionId: 'b', kind: 'new' as const }];
  assert.deepEqual(advanceDailyQuestion(queue, 'a'), queue[1]);
  assert.equal(advanceDailyQuestion(queue, 'b'), null);
});
test('repair entries still waiting are excluded even when their state is new', () => {
  const queue = buildDailyQuestionQueue(
    [{ cardId: 'c', questionIds: ['waiting', 'fresh'] }],
    [],
    [{ questionId: 'waiting', remainingReviews: 1 }],
    new Date('2026-01-01T00:00:00Z'),
  );
  assert.deepEqual(queue.map(item => item.questionId), ['fresh']);
});
