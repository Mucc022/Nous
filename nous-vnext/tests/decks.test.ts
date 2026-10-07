import test from 'node:test';
import assert from 'node:assert/strict';
import { groupDecks } from '../app/domain/decks';
test('one imported package is one deck and equal titles do not merge packages', () => {
  const decks = groupDecks([{id:'p1:card:a',title:'A',folder:'课堂',questions:[1,2]}, {id:'p1:card:b',title:'B',folder:'课堂',questions:[3]}, {id:'p2:card:a',title:'C',folder:'课堂',questions:[4]}]);
  assert.equal(decks.length,2); assert.equal(decks[0].cards.length,2); assert.equal(decks[0].questionCount,3);
});
