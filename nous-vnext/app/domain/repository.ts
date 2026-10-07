export type StorageLike = { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void };

export function createMemoryStorage(seed: Record<string, string> = {}): StorageLike {
  const values = new Map(Object.entries(seed));
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => void values.set(key, value), removeItem: (key) => void values.delete(key) };
}

export class JsonRepository<T extends { id: string }> {
  constructor(private readonly key: string, private readonly storage: StorageLike) {}
  list(): T[] { try { const value = JSON.parse(this.storage.getItem(this.key) ?? '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
  get(id: string): T | undefined { return this.list().find((item) => item.id === id); }
  save(record: T): void { const records = this.list().filter((item) => item.id !== record.id); records.push(record); this.storage.setItem(this.key, JSON.stringify(records)); }
  remove(id: string): void { this.storage.setItem(this.key, JSON.stringify(this.list().filter((item) => item.id !== id))); }
}
