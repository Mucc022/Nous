import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryStorage, JsonRepository } from '../app/domain/repository';

test('repository persists and reloads JSON records through its storage boundary', () => {
  const storage = createMemoryStorage();
  const first = new JsonRepository<{ id: string; value: number }>('records', storage);
  first.save({ id: 'a', value: 1 });
  const second = new JsonRepository<{ id: string; value: number }>('records', storage);
  assert.deepEqual(second.list(), [{ id: 'a', value: 1 }]);
});
test('repository replaces by id and removes by id', () => {
  const repository = new JsonRepository<{ id: string; value: number }>('records', createMemoryStorage());
  repository.save({ id: 'a', value: 1 }); repository.save({ id: 'a', value: 2 });
  assert.deepEqual(repository.get('a'), { id: 'a', value: 2 });
  repository.remove('a'); assert.equal(repository.get('a'), undefined); assert.deepEqual(repository.list(), []);
});
test('corrupt storage fails closed to an empty repository', () => {
  const storage = createMemoryStorage({ records: '{bad json' });
  const repository = new JsonRepository<{ id: string }>('records', storage);
  assert.deepEqual(repository.list(), []);
});
