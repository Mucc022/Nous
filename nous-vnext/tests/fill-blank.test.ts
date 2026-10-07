import assert from 'node:assert/strict';
import test from 'node:test';
import { blankCount, splitBlankAnswers, hasCompleteBlankResponse } from '../app/domain/fill-blank';

test('counts underscore and named blank tokens', () => {
  assert.equal(blankCount('A ____ and {{second}}'), 2);
  assert.equal(blankCount('No blank here'), 0);
});
test('splits semicolon answers without losing internal spaces', () => {
  assert.deepEqual(splitBlankAnswers(' grace ; faith '), ['grace', 'faith']);
});
test('all blank positions must have actual responses before submission', () => {
  assert.equal(hasCompleteBlankResponse('{{a}} and {{b}}', ['one']), false);
  assert.equal(hasCompleteBlankResponse('{{a}} and {{b}}', ['', 'two']), false);
  assert.equal(hasCompleteBlankResponse('{{a}} and {{b}}', ['one', '  ']), false);
  assert.equal(hasCompleteBlankResponse('{{a}} and {{b}}', ['one', 'two']), true);
});
