# Manual Testing Checklist

This project is a static GitHub Pages app. Test by opening `index.html` directly in a browser unless a later task adds a local server.

## 1. Open `index.html`

1. Open `index.html` in a browser.
2. Confirm the page loads without a blank screen.
3. Confirm the main flashcard area, knowledge tree, AI import panel, and settings/statistics/export panel are visible.

Expected result: the app is usable from `index.html`, and the settings/statistics/export controls are no longer hidden.

## 2. Create A Deck

1. In `知识库结构`, click `新建卡组`.
2. Enter a test deck name such as `Manual Test Deck`.
3. Confirm the new deck appears in the tree and becomes the current deck.

Expected result: the current deck path updates, and the card list is empty or shows the selected deck's cards.

## 3. Create A Card

1. Click `显示编辑器`.
2. Fill in a category, question, and answer.
3. Keep type as `问答题`.
4. Click `新建卡片`.

Expected result: the new card appears in the card list and can be studied in the main flashcard area.

## 4. Flash Question: View Answer Then Self-Evaluate

1. Select a `问答题`.
2. Click `查看参考答案` or `复习看答案`.
3. Confirm the answer side is shown.
4. Click `答对` or `答错（进错题本）`.

Expected result: the app accepts the self-evaluation after viewing the answer. It should not show `请先提交答案或查看参考答案，再判断对错`.

## 5. Choice Question Judgment

1. Create or import a `choice` card with `options`.
2. Select an option.
3. Click `提交答案`.

Expected result: the app auto-judges the selected answer, shows correct/incorrect feedback, and then allows moving to the next card. The manual `答对/答错` buttons should not be required for choice cards.

## 6. Import JSON

1. Select an existing deck or choose `新建卡组并导入`.
2. Paste this JSON into the AI import text area:

```json
[
  {
    "q": "2 + 2 = ?",
    "a": "4",
    "cat": "Math",
    "tags": ["manual-test"],
    "type": "choice",
    "options": ["3", "4", "5", "6"]
  },
  {
    "q": "What should you do before checking a flashcard answer?",
    "a": "Recall actively first.",
    "cat": "Study",
    "tags": ["manual-test"],
    "type": "flash",
    "keywords": ["recall"]
  }
]
```

3. Click `导入卡片`.

Expected result: the app imports valid cards, reports the number added, and the imported cards appear in the selected/new deck.

## 7. Export Current Deck

1. Select a deck with at least one card.
2. Click `导出当前卡组分享包`.

Expected result: the browser downloads a `deck-share-...json` file. The export button must be visible without editing the page.

## 8. Refresh And Confirm `localStorage`

1. Create or import at least one card.
2. Refresh the browser page.
3. Confirm the deck and card still exist.

Expected result: data persists after refresh because the app stores state in `localStorage` under the existing key.

## 9. Due Review Display

1. Answer a card correctly or incorrectly so it receives a review schedule.
2. Check the statistics panel for `到期`, `今天到期`, `今日复习`, and `下一次到期`.
3. Use the status chips or `只看到期卡片` to inspect due-card filtering.

Expected result: reviewed cards show SRS status such as `Lv1`, today's review count updates, and due filtering remains accessible. A card may not become due immediately unless its `nextReviewAt` has passed.

## 10. `flashcard.html` Redirect

1. Open `flashcard.html`.
2. Confirm it redirects to `index.html`.

Expected result: `flashcard.html` no longer runs a second copy of the app, preventing future entry-file drift.
