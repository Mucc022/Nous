type DeckCard = { id: string; title: string; folder: string; questions: readonly unknown[] };
export function deckId(card: DeckCard): string {
  const marker = card.id.indexOf(':card:');
  return marker >= 0 ? card.id.slice(0, marker) : `legacy-folder:${card.folder}`;
}
export function groupDecks<T extends DeckCard>(cards: readonly T[]) {
  const decks = new Map<string, { id: string; title: string; cards: T[]; questionCount: number }>();
  for (const card of cards) {
    const id = deckId(card);
    const deck = decks.get(id) ?? { id, title: card.folder || '未命名卡组', cards: [], questionCount: 0 };
    deck.cards.push(card); deck.questionCount += card.questions.length; decks.set(id, deck);
  }
  return [...decks.values()];
}
