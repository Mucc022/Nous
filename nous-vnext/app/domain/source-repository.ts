import type { SourceDocument } from './content';
import type { StorageLike } from './repository';
import { createSourceDocument, normalizeSourceText, sha256Hex } from './source-store';

const key = 'nous.sources.v1';
function isSource(value: unknown): value is SourceDocument {
  if (!value || typeof value !== 'object') return false;
  const source = value as Partial<SourceDocument>;
  return typeof source.sourceId === 'string' && typeof source.sha256 === 'string'
    && /^[a-f0-9]{64}$/.test(source.sha256) && source.sourceId === `src_${source.sha256}`
    && typeof source.title === 'string' && Array.isArray(source.chunks) && source.chunks.length > 0
    && source.chunks.every((chunk, index) => chunk && typeof chunk.chunkId === 'string'
      && chunk.index === index && typeof chunk.text === 'string' && chunk.text.length > 0)
    && new Set(source.chunks.map(chunk => chunk.chunkId)).size === source.chunks.length;
}

export class SourceRepository {
  constructor(private readonly storage: StorageLike) {}
  list(): SourceDocument[] {
    const raw = this.storage.getItem(key);
    if (raw === null) return [];
    let data: unknown;
    try { data = JSON.parse(raw); } catch { throw new Error('原文存储已损坏，请先导出备份；没有覆盖原数据。'); }
    if (!Array.isArray(data) || !data.every(isSource) || new Set(data.map(s => s.sourceId)).size !== data.length) {
      throw new Error('原文存储结构损坏，请先导出备份；没有覆盖原数据。');
    }
    return data;
  }
  async addText(title: string, rawText: string): Promise<SourceDocument> {
    const text = normalizeSourceText(rawText);
    const hash = await sha256Hex(text);
    const source = await createSourceDocument(`src_${hash}`, title, text);
    // Read after all async work so simultaneous adds in this tab cannot overwrite one another.
    const sources = this.list();
    const existing = sources.find(item => item.sourceId === source.sourceId);
    if (existing) return existing;
    this.storage.setItem(key, JSON.stringify([...sources, source]));
    return source;
  }
}
