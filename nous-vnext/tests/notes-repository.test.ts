import assert from 'node:assert/strict';
import test from 'node:test';
import { NotesRepository } from '../app/domain/notes-repository';
import { createMemoryStorage } from '../app/domain/repository';
test('notes persist by user/question without delimiter collisions', () => {
  const storage = createMemoryStorage();
  new NotesRepository('a:b', storage).save('c', 'First note');
  new NotesRepository('a', storage).save('b:c', 'Second note');
  assert.equal(new NotesRepository('a:b', storage).get('c'), 'First note');
  assert.equal(new NotesRepository('a', storage).get('b:c'), 'Second note');
  assert.equal(new NotesRepository('other', storage).get('c'), '');
});
test('clearing a note persists empty text', () => {
  const storage = createMemoryStorage(); const repo = new NotesRepository('u', storage);
  repo.save('q', 'old'); repo.save('q', '');
  assert.equal(new NotesRepository('u', storage).get('q'), '');
});
