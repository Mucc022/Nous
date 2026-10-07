import assert from 'node:assert/strict';
import test from 'node:test';
import { countLibraryFilters, filterLibraryCards } from '../app/domain/library-filters';

const now = new Date('2026-09-29T08:00:00Z');
const cards = [
  { id: 'new', folder: '语文', tags: [], questionIds: ['q1'] },
  { id: 'due', folder: '数学', tags: ['重点'], questionIds: ['q2'] },
  { id: 'learning', folder: '', tags: [], questionIds: ['q3'] },
  { id: 'review', folder: '英语', tags: ['词汇'], questionIds: ['q4'] },
];
const states = [
  { userId: 'u', questionId: 'q2', phase: 'review' as const, dueAt: '2026-09-28T08:00:00Z', reviewLevel: 1, lapses: 0, successfulReviews: 1 },
  { userId: 'u', questionId: 'q3', phase: 'learning' as const, dueAt: '2026-10-01T08:00:00Z', reviewLevel: 0, lapses: 0, successfulReviews: 0 },
  { userId: 'u', questionId: 'q4', phase: 'review' as const, dueAt: '2026-10-01T08:00:00Z', reviewLevel: 1, lapses: 0, successfulReviews: 1 },
];

test('library filters reflect actual card states and missing metadata', () => {
  assert.deepEqual(filterLibraryCards(cards, 'new', states, now).map(card => card.id), ['new']);
  assert.deepEqual(filterLibraryCards(cards, 'due', states, now).map(card => card.id), ['due']);
  assert.deepEqual(filterLibraryCards(cards, 'learning', states, now).map(card => card.id), ['learning']);
  assert.deepEqual(filterLibraryCards(cards, 'review', states, now).map(card => card.id), ['review']);
  assert.deepEqual(filterLibraryCards(cards, 'untagged', states, now).map(card => card.id), ['new', 'learning']);
  assert.deepEqual(filterLibraryCards(cards, 'uncategorized', states, now).map(card => card.id), ['learning']);
  assert.deepEqual(countLibraryFilters(cards, states, now), { new: 1, due: 1, learning: 1, review: 1, untagged: 2, uncategorized: 1 });
});
