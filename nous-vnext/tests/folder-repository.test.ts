import assert from 'node:assert/strict';
import test from 'node:test';
import { FolderRepository, legacyFolderId, resolveFolderStyle } from '../app/domain/folder-repository';
import { createMemoryStorage } from '../app/domain/repository';

test('renaming legacy folders preserves identity and children; styles inherit independently', () => {
  const repo = new FolderRepository(createMemoryStorage());
  const root = legacyFolderId('A');
  const child = repo.add(root, 'child', ['A']);
  const grandchild = repo.add(child.id, 'grandchild', ['A']);
  repo.update(root, {name:'课程',icon:'BookOpen',color:'#123456'}, ['A']);
  repo.update(child.id, {name:'第二层',icon:null,color:'#abcdef'}, ['A']);
  let folders = repo.list(['A']);
  assert.equal(folders[0].id, root);
  assert.equal(folders[0].legacyName, 'A');
  assert.equal(folders[0].name, '课程');
  assert.deepEqual(resolveFolderStyle(grandchild.id, folders), {icon:'BookOpen',color:'#abcdef'});
  repo.update(root, {name:'课程',icon:'Star',color:null}, ['A']);
  repo.update(child.id, {name:'第二层',icon:null,color:null}, ['A']);
  folders = repo.list(['A']);
  assert.deepEqual(resolveFolderStyle(grandchild.id, folders), {icon:'Star',color:null});
  assert.throws(() => repo.update(child.id, {name:' ',icon:null,color:null}, ['A']));
  assert.throws(() => repo.update(child.id, {name:'ok',icon:null,color:'red'}, ['A']));
});

test('empty nested folders persist without altering legacy card folder names', () => {
  const storage = createMemoryStorage();
  const repo = new FolderRepository(storage);
  const parent = legacyFolderId('神学基础 / 救恩论');
  const child = repo.add(parent, ' 第一课 ', ['神学基础 / 救恩论']);
  repo.add(child.id, '笔记', ['神学基础 / 救恩论']);
  const folders = new FolderRepository(storage).list(['神学基础 / 救恩论']);
  assert.equal(folders.length, 3);
  assert.equal(folders[0].name, '神学基础 / 救恩论');
  assert.equal(folders[1].name, '第一课');
  assert.equal(folders[1].parentId, parent);
  assert.equal(folders[2].parentId, child.id);
});

test('rejects blank names, missing parents and duplicate siblings but permits names under another parent', () => {
  const repo = new FolderRepository(createMemoryStorage());
  const roots = ['A', 'B'];
  assert.throws(() => repo.add(legacyFolderId('A'), '  ', roots));
  assert.throws(() => repo.add('missing', 'child', roots));
  repo.add(legacyFolderId('A'), 'child', roots);
  assert.throws(() => repo.add(legacyFolderId('A'), ' child ', roots));
  repo.add(legacyFolderId('B'), 'child', roots);
  assert.equal(repo.list(roots).length, 4);
});

test('corrupt stored folders are never overwritten', () => {
  const storage = createMemoryStorage();
  for (const value of ['bad json', '[{"id":"x","name":"x","parentId":"x"}]']) {
    storage.setItem('nous.folders.v1', value);
    assert.throws(() => new FolderRepository(storage).add(null, 'new', []));
    assert.equal(storage.getItem('nous.folders.v1'), value);
  }
});

test('storage failure is reported instead of pretending the folder was saved', () => {
  const repo = new FolderRepository({ getItem: () => null, setItem: () => { throw new Error('quota'); } });
  assert.throws(() => repo.add(null, 'new', []), /quota/);
});

test('corrupt style overrides fail closed and duplicate rename is rejected', () => {
  const storage = createMemoryStorage();
  const repo = new FolderRepository(storage);
  assert.throws(() => repo.update(legacyFolderId('A'), {name:'B',icon:null,color:null}, ['A','B']));
  storage.setItem('nous.folder-edits.v1', '{broken');
  assert.throws(() => repo.update(legacyFolderId('A'), {name:'C',icon:null,color:null}, ['A']));
  assert.equal(storage.getItem('nous.folder-edits.v1'), '{broken');
});

test('folder trash covers descendants and restoration preserves styles', () => {
  const repo = new FolderRepository(createMemoryStorage());
  const root = legacyFolderId('A');
  const child = repo.add(root,'child',['A']);
  repo.update(root,{name:'A',icon:'Book',color:'#123456'},['A']);
  repo.setTrash(root,true,['A']);
  assert.ok(repo.list(['A']).find(folder => folder.id === child.id)?.deletedAt);
  repo.setTrash(root,false,['A']);
  assert.equal(repo.list(['A']).find(folder => folder.id === child.id)?.deletedAt, undefined);
  assert.equal(repo.list(['A'])[0].icon,'Book');
});
