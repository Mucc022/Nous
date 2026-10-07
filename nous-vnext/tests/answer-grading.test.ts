import assert from 'node:assert/strict';
import test from 'node:test';
import { gradeResponse } from '../app/domain/answer-grading';

test('single choice grades an exact normalized answer', () => {
  assert.equal(gradeResponse('single_choice', ' A ', 'a'), true);
  assert.equal(gradeResponse('single_choice', 'b', 'a'), false);
});
test('multiple choice ignores order but not membership', () => {
  assert.equal(gradeResponse('multiple_choice', ['b', 'a'], ['a', 'b']), true);
  assert.equal(gradeResponse('multiple_choice', ['a'], ['a', 'b']), false);
});
test('multiple choice can parse a semicolon-delimited expected answer', () => {
  assert.equal(gradeResponse('multiple_choice', ['a', 'b'], 'a；b'), true);
  assert.equal(gradeResponse('multiple_choice', ['a'], 'a；b'), false);
});
test('true false accepts canonical boolean words only', () => {
  assert.equal(gradeResponse('true_false', 'true', '真'), true);
  assert.equal(gradeResponse('true_false', 'false', '真'), false);
});
test('fill blank grades every blank', () => {
  assert.equal(gradeResponse('fill_blank', ['Grace', 'faith'], ['grace', 'faith']), true);
  assert.equal(gradeResponse('fill_blank', ['Grace', 'works'], ['grace', 'faith']), false);
});
test('subjective questions remain self-assessed', () => {
  assert.equal(gradeResponse('short_answer', 'anything', 'expected'), null);
  assert.equal(gradeResponse('analysis', 'anything', 'expected'), null);
});
test('fill blank preserves positions instead of treating answers as a set', () => {
  assert.equal(gradeResponse('fill_blank', ['faith', 'grace'], ['grace', 'faith']), false);
  assert.equal(gradeResponse('fill_blank', 'faith；grace', 'grace；faith'), false);
});
test('empty answers and missing blank positions cannot earn correctness', () => {
  assert.equal(gradeResponse('fill_blank', ';faith', 'faith'), false);
  assert.equal(gradeResponse('fill_blank', ['', 'faith'], ['faith']), false);
  assert.equal(gradeResponse('multiple_choice', [], []), false);
  assert.equal(gradeResponse('single_choice', '', ''), false);
});
test('unrecognized boolean values do not compare equal as null', () => {
  assert.equal(gradeResponse('true_false', 'maybe', 'unknown'), false);
});
test('single response questions reject multiple supplied answers', () => {
  assert.equal(gradeResponse('single_choice', ['a', 'b'], 'a'), false);
  assert.equal(gradeResponse('true_false', ['true', 'false'], 'true'), false);
});
test('commas inside an answer are not extra blanks or options', () => {
  assert.equal(gradeResponse('fill_blank', ['red, blue', 'green'], ['red', 'blue', 'green']), false);
  assert.equal(gradeResponse('fill_blank', 'red, blue', ['red', 'blue']), false);
  assert.equal(gradeResponse('multiple_choice', ['red', 'blue'], 'red, blue'), false);
});
