import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceRepairPool, enqueueRepair, readyRepairIds, type RepairEntry } from '../app/domain/repair-pool';

test('invalid repair delays cannot create permanently waiting entries', () => {
  const pool: RepairEntry[] = [{ questionId: 'existing', remainingReviews: 1 }];
  for (const delay of [-1, 1.5, NaN, Infinity]) assert.throws(() => enqueueRepair(pool, 'new', delay));
  assert.deepEqual(pool, [{ questionId: 'existing', remainingReviews: 1 }]);
});

test('wrong question waits for two other completed questions', () => {
  let pool: RepairEntry[] = enqueueRepair([], 'q1', 2);
  assert.deepEqual(readyRepairIds(pool), []);
  pool = advanceRepairPool(pool, 'q2');
  assert.deepEqual(readyRepairIds(pool), []);
  pool = advanceRepairPool(pool, 'q3');
  assert.deepEqual(readyRepairIds(pool), ['q1']);
});
test('re-enqueue does not reset an existing repair countdown', () => {
  let pool = enqueueRepair([], 'q1', 2);
  pool = advanceRepairPool(pool, 'q2');
  assert.equal(enqueueRepair(pool, 'q1', 2)[0].remainingReviews, 1);
});
test('repair success removes the question and unrelated entries remain', () => {
  const pool = advanceRepairPool(enqueueRepair(enqueueRepair([], 'q1', 1), 'q2', 1), 'q3');
  assert.deepEqual(readyRepairIds(pool), ['q1', 'q2']);
  assert.deepEqual(advanceRepairPool(pool, 'q1').map(entry => entry.questionId), ['q2']);
});
