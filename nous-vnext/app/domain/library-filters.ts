import { cardStatus } from './card-status';
import type { LearningState } from './scheduler';

export type LibraryFilter = 'new' | 'due' | 'learning' | 'review' | 'untagged' | 'uncategorized';
type LibraryCard = { folder: string; tags: readonly string[]; questionIds: readonly string[] };

export function filterLibraryCards<T extends LibraryCard>(cards: readonly T[], filter: LibraryFilter, states: readonly LearningState[], now: Date): T[] {
  return cards.filter(card => {
    if (filter === 'untagged') return !card.tags.some(tag => tag.trim());
    if (filter === 'uncategorized') return !card.folder.trim();
    return cardStatus(card.questionIds, states, now) === filter;
  });
}

export function countLibraryFilters(cards: readonly LibraryCard[], states: readonly LearningState[], now: Date): Record<LibraryFilter, number> {
  return {
    new: filterLibraryCards(cards, 'new', states, now).length,
    due: filterLibraryCards(cards, 'due', states, now).length,
    learning: filterLibraryCards(cards, 'learning', states, now).length,
    review: filterLibraryCards(cards, 'review', states, now).length,
    untagged: filterLibraryCards(cards, 'untagged', states, now).length,
    uncategorized: filterLibraryCards(cards, 'uncategorized', states, now).length,
  };
}
