export type LibraryFolder = { id: string; name: string; parentId: string | null; legacyName?: string; icon?: string | null; color?: string | null; deletedAt?: string };
type FolderEdit = {name:string;icon:string|null;color:string|null;deletedAt?:string};
const editsKey = 'nous.folder-edits.v1';
function readEdits(storage: FolderStorage): Record<string, FolderEdit> {
  const edits = JSON.parse(storage.getItem(editsKey) ?? '{}');
  if (!edits || typeof edits !== 'object' || Array.isArray(edits) || Object.values(edits).some(value => !validEdit(value))) throw new Error('文件夹设置损坏，原数据未修改');
  return edits;
}
function validEdit(value: unknown): value is FolderEdit {
  if (!value || typeof value !== 'object') return false;
  const item = value as FolderEdit;
  return typeof item.name === 'string' && !!item.name.trim() && item.name.length <= 80 && (item.icon === null || typeof item.icon === 'string' && /^[A-Za-z][A-Za-z0-9]{0,60}$/.test(item.icon)) && (item.color === null || /^#[0-9a-f]{6}$/i.test(item.color));
}
export function resolveFolderStyle(id: string, folders: LibraryFolder[]) {
  let icon: string | null = null, color: string | null = null;
  const byId = new Map(folders.map(folder => [folder.id,folder]));
  const visited = new Set<string>();
  let folder = byId.get(id);
  while (folder && !visited.has(folder.id)) {
    visited.add(folder.id); icon ??= folder.icon ?? null; color ??= folder.color ?? null;
    folder = folder.parentId ? byId.get(folder.parentId) : undefined;
  }
  return {icon:icon ?? 'Folder',color};
}
type FolderStorage = { getItem(key: string): string | null; setItem(key: string, value: string): void };
export const legacyFolderId = (name: string) => `legacy:${JSON.stringify(name)}`;
const key = 'nous.folders.v1';

export class FolderRepository {
  constructor(private readonly storage: FolderStorage) {}

  list(legacyNames: string[]): LibraryFolder[] {
    const roots = [...new Set(legacyNames)].map(name => ({ id: legacyFolderId(name), name, parentId: null, legacyName: name }));
    const saved: unknown = JSON.parse(this.storage.getItem(key) ?? '[]');
    if (!Array.isArray(saved) || saved.some(item => !item || typeof item.id !== 'string' || !item.id.startsWith('folder:') || typeof item.name !== 'string' || !item.name.trim() || item.name.length > 80 || (item.parentId !== null && typeof item.parentId !== 'string'))) throw new Error('文件夹数据损坏，请勿覆盖原数据');
    const folders: LibraryFolder[] = [...roots, ...saved.map(({ id, name, parentId }) => ({ id, name, parentId }))];
    const byId = new Map(folders.map(folder => [folder.id, folder]));
    if (byId.size !== folders.length) throw new Error('文件夹标识重复');
    for (const folder of folders) {
      const seen = new Set([folder.id]);
      let parent = folder.parentId;
      while (parent !== null) {
        if (seen.has(parent) || !byId.has(parent)) throw new Error('文件夹层级无效');
        seen.add(parent);
        parent = byId.get(parent)!.parentId;
      }
    }
    const edits = readEdits(this.storage);
    return folders.map(folder => ({...folder,...edits[folder.id]}));
  }

  add(parentId: string | null, name: string, legacyNames: string[]): LibraryFolder {
    const folders = this.list(legacyNames);
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 80) throw new Error('请输入 1–80 个字符的文件夹名称');
    if (parentId !== null && !folders.some(folder => folder.id === parentId)) throw new Error('父文件夹不存在');
    if (folders.some(folder => folder.parentId === parentId && folder.name === trimmed)) throw new Error('此位置已存在同名文件夹');
    const folder = { id: `folder:${crypto.randomUUID()}`, name: trimmed, parentId };
    this.storage.setItem(key, JSON.stringify([...folders.filter(item => item.legacyName === undefined), folder]));
    return folder;
  }

  update(id: string, edit: FolderEdit, legacyNames: string[]) {
    const folders = this.list(legacyNames);
    const folder = folders.find(item => item.id === id);
    if (!folder) throw new Error('文件夹不存在');
    const value = {...edit,name:edit.name.trim()};
    if (!validEdit(value)) throw new Error('名称需为 1–80 字符，颜色需为有效色值');
    if (folders.some(item => item.id !== id && item.parentId === folder.parentId && item.name === value.name)) throw new Error('此位置已存在同名文件夹');
    const edits = readEdits(this.storage);
    this.storage.setItem(editsKey, JSON.stringify({...edits,[id]:{...edits[id],...value}}));
  }

  setTrash(id: string, deleted: boolean, legacyNames: string[]) {
    const folders = this.list(legacyNames);
    if (!folders.some(folder => folder.id === id)) throw new Error('文件夹不存在');
    const ids = new Set([id]);
    let changed = true;
    while (changed) { changed = false; for (const folder of folders) if (folder.parentId && ids.has(folder.parentId) && !ids.has(folder.id)) { ids.add(folder.id); changed = true; } }
    const edits = readEdits(this.storage);
    for (const folder of folders.filter(item => ids.has(item.id))) edits[folder.id] = {name:folder.name,icon:folder.icon ?? null,color:folder.color ?? null,deletedAt:deleted ? new Date().toISOString() : undefined};
    this.storage.setItem(editsKey,JSON.stringify(edits));
  }
}
