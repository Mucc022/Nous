# FlashCard (Exam Share Edition)

A single-page flashcard app for quick AI import + memory review, designed for class sharing.

## Current Nous progress (2026-10-07)

Active application: `nous-vnext/`; root HTML is legacy reference. Current code includes
local-first learning, AI source/package import, decks/folders, settings/theme,
study/review engine, reversible trash and backend/API scaffolding.
This snapshot is code backup, not production deployment or release acceptance.
Verified authentication, D1 user sync and full course/recovery acceptance remain pending.

Start locally with Node >=22.13: `cd nous-vnext`, `npm ci`, `npm run dev`.
Checks: `npm run test:domain`, `npx tsc --noEmit --incremental false`.
Read `docs/00-project-memory/current-state.md` and `Codex/CODEX_MEMORY.md` for status.
Secrets, databases, imported classroom originals, tool state, generated previews and
the separate Questory application are intentionally excluded.

## Legacy Live URL (GitHub Pages)

After enabling Pages, your URL will be:

`https://<your-github-username>.github.io/<repo-name>/`

## Core workflow

1. Create/select a deck.
2. Paste AI output and import cards.
3. Validate content quality.
4. Click `导出当前卡组分享包` to generate a JSON package.
5. Share both:
   - the webpage URL
   - the deck JSON package

Classmates open the page and import the shared package to get the same deck locally.

## Share package format

The deck package JSON uses:

- `deckMeta`: deck metadata (name/path/count/export time)
- `cards`: array of `{ q, a, cat, tags }`

## Publish to GitHub Pages

```bash
git init
git branch -M main
git add flashcard.html README.md
git commit -m "init: exam share edition"
# create a public repo on GitHub first, then:
git remote add origin https://github.com/<your-github-username>/<repo-name>.git
git push -u origin main
```

Then in GitHub repo settings:

- `Settings` -> `Pages`
- `Build and deployment` -> `Deploy from a branch`
- Branch: `main`, Folder: `/ (root)`

## Notes

- Data is stored in browser `localStorage` by default.
- If browser storage is cleared, local data is lost unless exported.
- This version is for class sharing (no account/login server).
