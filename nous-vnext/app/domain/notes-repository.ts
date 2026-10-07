import type { StorageLike } from './repository';
export class NotesRepository {
  constructor(private readonly userId: string, private readonly storage: StorageLike) {}
  private key(questionId: string): string {
    if (!this.userId.trim() || !questionId.trim()) throw new Error('Note identity required');
    return `nous.note.v1:${JSON.stringify([this.userId, questionId])}`;
  }
  get(questionId: string, fallback = ''): string { return this.storage.getItem(this.key(questionId)) ?? fallback; }
  save(questionId: string, note: string): void { this.storage.setItem(this.key(questionId), note); }
}
