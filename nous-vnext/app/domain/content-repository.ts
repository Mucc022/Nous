import type { NousPackage } from './content';
import type { StorageLike } from './repository';
import { packageIdentity } from './package-identity';
import { parseAndValidateNousPackage } from './validator';
export class ContentRepository {
  constructor(private readonly storage: StorageLike) {}
  async save(content: NousPackage): Promise<string> {
    const snapshot = parseAndValidateNousPackage(JSON.stringify(content));
    const id = await packageIdentity(snapshot);
    const key = `nous.content.v1:${id}`;
    const existing = this.get(id);
    if (existing) {
      if (await packageIdentity(existing) !== id) throw new Error('题库内容损坏，未覆盖原版本');
      return id;
    }
    this.storage.setItem(key, JSON.stringify(snapshot));
    return id;
  }
  get(id: string): NousPackage | null {
    const raw = this.storage.getItem(`nous.content.v1:${id}`);
    return raw === null ? null : parseAndValidateNousPackage(raw);
  }
}
