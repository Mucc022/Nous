import assert from 'node:assert/strict';
import test from 'node:test';
import { appendReadyRepairs } from '../app/domain/session-repair';

test('ready repair joins remaining session without duplicating pending questions', () => {
  const cards = [{ cardId: 'c', questionIds: ['a', 'b', 'wait'] }];
  const remaining = [{ cardId: 'c', questionId: 'b', kind: 'new' as const }];
  const next = appendReadyRepairs(remaining, cards, [{ questionId: 'a', remainingReviews: 0 }, { questionId: 'b', remainingReviews: 0 }, { questionId: 'wait', remainingReviews: 1 }]);
  assert.deepEqual(next, [...remaining, { cardId: 'c', questionId: 'a', kind: 'repair' }]);
});
test('removed content cannot become a dangling repair queue item', () => {
  assert.deepEqual(appendReadyRepairs([], [], [{ questionId: 'missing', remainingReviews: 0 }]), []);
});
