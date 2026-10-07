export type EnumerableStorage = { readonly length: number; key(index: number): string | null; getItem(key: string): string | null };
export function createLocalBackup(storage: EnumerableStorage): string {
  const exact = new Set(['nous.folders.v1', 'nous.cards.v1', 'nous.sources.v1', 'nous.repair.v1', 'nous.review-events.v1', 'nous.review-outbox.v1']);
  const prefixes = ['nous.content.v1:', 'nous.note.v1:', 'nous.learning.v1:', 'nous.review-events.v1:', 'nous.review-journal.v1:'];
  const entries: Record<string, string> = {};
  exact.add('nous.folder-edits.v1');
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (!key || (!exact.has(key) && !prefixes.some(prefix => key.startsWith(prefix)))) continue;
    const value = storage.getItem(key);
    if (value !== null) entries[key] = value;
  }
  return JSON.stringify({ format: 'nous-local-backup-v1', entries }, null, 2);
}
