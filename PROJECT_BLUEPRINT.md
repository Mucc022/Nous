# Nous Project Blueprint

GitHub backups include real VNext files and descriptions, exclude secrets/user originals/caches and separate Questory code, and use a progress branch until deployment is intended. Successful push is not production/release acceptance.

2026-10-07 updated Drive policy: individually searchable documents with Nous-prefixed folder/file names and project/category/source headers. Never merge entire project into one large file. Keep source paths and current/history boundaries; preserve cloud IDs and sync task. See PROJECT_CONTEXT_INDEX.md for links.

## Project context sync — 2026-10-07

Maintain PROJECT_CONTEXT_INDEX.md and the explicit Nous Drive binding when adding important descriptions. Keep semantic groups under 25 files including the index. Local documents remain authoritative; Google Drive exports support user-selected ChatGPT sources, not automatic ChatGPT ingestion or two-way editing. Minute/logon synchronization requires the PC, signed-in user and Google Drive Desktop. Exclude code, user learning data and secrets.

Folder motion: subtle 220ms height transition with fade and chevron rotation; preserve nested expansion, immediately disable hidden interactions, and respect prefers-reduced-motion. No animation dependency required.

Library root interaction: chevron toggles directory visibility independently of All Cards selection; collapsing the navigation must not hide/delete cards or reset nested folder expansion.

Dialog layout invariant: explicitly center native modal dialogs after CSS resets and constrain their height to the viewport; include visual positioning in UI acceptance, not only successful submission.

2026-09-29 folder UX: right-click an existing folder to create a named child; right-click All Cards for a root folder. Empty nested folders persist locally and export with backup. Keep existing slash-containing card group names intact, not automatically split into paths. Current scope is folder creation/tree only; assigning/moving/importing cards into these folders is future work, not implemented. Clear small scoped changes may proceed without repeated design confirmation per user preference.

Hosting reliability checkpoint: 2026-09-25 public DNS resolves, local router DNS fails, and local-origin tunnel is independently offline. Current PC-hosted model requires running origin processes plus tunnel; logon task existence is not evidence of continuous availability. Obtain scoped approval before restarting the shared Nous/Questory launcher or changing machine DNS; cloud hosting remains the later reliability goal.

Trial handoff priority: show actual library/filter state, avoid fictitious mastery timelines and unsupported folder-selection claims. Empty workspace should lead directly into save-source -> external prompt -> preview -> accept. Real-course acceptance remains required before Core PASS.

Repair queue invariant: waiting counts must be nonnegative safe integers; invalid configuration must fail before changing the queue. This supports the existing delayed-repair contract, without changing the two-question default.

Access entrance gate: exact-host application and One-time PIN configured with the approved three-email allowlist on 2026-09-25. Dashboard creation succeeded. Live hostname currently fails DNS resolution, so login/API protection remains unverified. Next: inspect DNS/tunnel routing, restore hostname with scoped authorization if changes are needed, then verify allowed login and denied access. Other applications remain unchanged; entrance setup does not complete backend identity/D1 integration.

2026-09-25 deployment checkpoint: dedicated D1 now has the four initial application tables, verified empty remotely. This is infrastructure preparation, not Release acceptance. Finish real authentication, content ownership, concurrency protection and Core acceptance before enabling remote access or changing the live domain.

## D1 provisioning checkpoint — 2026-09-25

Deployment was authorized. A dedicated empty APAC D1 database `nous-mvp` now exists (ID `5c152587-02bb-496b-b12a-36d2a79f486e`). Next deployment gates: finish Core acceptance, implement real verified sessions and per-user ownership, validate migrations locally, bind a staging Worker, then verify isolation before switching any live traffic. Keep current local/Tunnel route unchanged until these gates pass.

## 1. Project Positioning

Project name: Nous

Internal codename: Nous Flash SRS

Project goal: build a lightweight web flashcard learning system based on an Ebbinghaus-style spaced review workflow.

Target users: a small class group, currently around 5 people.

Current deployment model: GitHub Pages static site. The project is pure frontend and has no backend, account system, database server, or paid AI API integration.

Current product direction:

- Manage decks and cards in the browser.
- Let students study cards and record local review progress.
- Support due-review workflows based on a simplified spaced repetition model.
- Support external AI card generation through a copy/download/import workflow.
- Keep future room for Gemini API, OpenAI API, Firebase, or Supabase, but do not implement those in the current stage.

## 2. Current Technical Architecture

This section is based on the current codebase, not on a planned architecture.

Technology stack:

- Native HTML
- Native CSS
- Native JavaScript

Build tools:

- None.
- There is no `package.json`, no Vite, no Webpack, no npm build step, and no framework runtime.

Data storage:

- Browser `localStorage`.
- Current storage key in `index.html`: `studyking.flashcards.v3`.
- Existing state includes folders, decks, cards, known card ids, hard card ids, wrong-book ids, SRS records, selected folder/deck, and current mode.

Main entry file:

- `index.html` is the GitHub Pages entry and should remain the official production entry.

Duplicate entry note:

- `flashcard.html` currently contains the same app content as `index.html`.
- Do not delete it without an explicit cleanup task.
- Preferred stable approach for phase one: keep `index.html` as the only source of truth and make `flashcard.html` redirect to `index.html`, or otherwise document it as a legacy copy. This avoids long-term double-copy drift.

Other files:

- `README.md` describes the current GitHub Pages and sharing workflow.
- `flashcard.legacy.pywrapper.bak` is a legacy backup.
- `flashcard.v2.backup.before-v3.html` is a pre-v3 backup.

Important modules inside `index.html`:

- Card/deck/folder state: global arrays and sets for folders, decks, cards, known, hard, wrong book, and SRS records.
- Persistence: `loadData()`, `saveData()`, `migrateFromLegacy()`, `ensureStateIntegrity()`.
- Folder/deck UI: tree rendering, folder creation, deck creation, deck rename, folder delete.
- Learning flow: current card, practice queue, answer submission, manual judging, wrong-book repeat loop.
- Review/SRS: fixed interval list and `markReviewedSrs(cardId, remembered)`.
- Import: JSON code block import, pipe-line import, JSON package file import.
- Export: full data JSON export and current deck share-package export.
- Editor: rich text card editor, basic formatting, cloze creation.

## 3. Current Feature Status

### Completed Features

- Static GitHub Pages compatible app.
- Local browser persistence through `localStorage`.
- Folder and deck management.
- Nested folders.
- Card creation through the built-in editor.
- Card editing with basic rich text.
- Flashcard study view with front/back display.
- Question types: flash, choice, cloze, and passage.
- Basic choice/fixed-answer auto-judging.
- Manual correct/wrong judging for flash questions after answer submission.
- Wrong-book style repeat flow for incorrectly answered cards.
- JSON import from pasted AI output.
- Pipe-separated line import.
- JSON package import through file picker and drag/drop.
- Current deck share-package export.
- Full local data export.
- Basic due-review statistics and due filtering logic.
- Legacy migration from an older localStorage key.

### Half-Completed Features

- Simplified SRS exists, but it is not yet a full Ebbinghaus system.
- Review intervals are hardcoded and not user-customizable.
- Due-review mode exists, but today's due cards and overdue cards are not cleanly separated.
- Review status is split across `knownSet`, `hardSet`, `wrongBookSet`, and `srsMap`, which creates duplicate state sources.
- Settings, filtering, stats, reset, and export controls exist, but the containing panel is currently hidden in the UI.
- Flash question self-evaluation works after answer submission, but viewing the reference answer directly does not currently mark the card as ready for self-evaluation.
- AI workflow exists as a prompt-copy/import workflow, but there is no direct AI API integration.
- Share packages exist, but the import/export schema should be documented more formally before wider class use.

### Not Yet Implemented

- Dedicated `explanation` field for card analysis.
- Dedicated `difficulty` field.
- Three-result review model: remember, fuzzy, forget.
- Custom review schedule UI.
- Full Ebbinghaus review algorithm.
- Separate today/overdue review pages or lists.
- CSV import.
- Markdown import.
- Multi-user shared progress.
- Login system.
- Backend database.
- Firebase/Supabase sync.
- OpenAI/Gemini API integration inside the app.
- Automated tests.

## 4. Core System Design

### Deck

A deck is a group of cards. Current deck records are stored in the `decks` array.

Current expected fields:

- `id`
- `name`
- `folderId`
- `createdAt`

Decks belong to folders. If a folder is missing or invalid, current integrity logic moves the deck to `root`.

### Folder

Folders are used to organize decks. Current folder records are stored in the `folders` array.

Current expected fields:

- `id`
- `name`
- `parentId`
- `createdAt`

Folders can be nested. Root is represented by the special id `root`.

### Card

Cards are stored in the `cards` array.

Current expected fields:

- `id`
- `deckId`
- `qHtml`
- `aHtml`
- `cat`
- `tags`
- `type`
- `options`
- `keywords`
- `createdAt`
- `updatedAt`

Current card type values:

- `flash`: normal question/answer card, manually judged.
- `choice`: multiple choice card, auto-judged.
- `cloze`: blank/fill card, auto-judged by normalized answer matching.
- `passage`: completion-style card, auto-judged by normalized answer matching.

Future card fields:

- `explanationHtml`
- `difficulty`

Do not add these fields until the phase two data-model task starts.

### Review Record

Current review records live in `srsMap`, keyed by card id.

Current expected fields:

- `level`
- `nextReviewAt`
- `lastReviewedAt`
- `reviewCount`

The current system also keeps `knownSet`, `hardSet`, and `wrongBookSet`. These are useful for the current app behavior, but they overlap with review state and should eventually be consolidated.

### Review State

Current stage:

- User result is binary: correct or wrong.
- Correct means `level + 1`, capped by the interval list.
- Wrong means `level - 1`, minimum 0, and schedules the first interval again.

Future stage:

- Replace binary result with: remember, fuzzy, forget.
- Keep compatibility migration from current correct/wrong records.
- Do not implement this during phase one.

### Due Calculation

Current simplified SRS:

- The interval list is hardcoded as minutes:
  - 10 minutes
  - 1 day
  - 3 days
  - 7 days
  - 14 days
  - 30 days
- A card is due when it has been reviewed at least once and `nextReviewAt <= now`.

Future Ebbinghaus system:

- Allow custom review cycles.
- Separate due today from overdue.
- Show a clear daily review list.
- Add a review history model if needed.

## 5. Development Roadmap

### Phase One: Stabilize Existing System

Current phase.

Goals:

- Keep `index.html` as the official GitHub Pages entry.
- Resolve the `flashcard.html` duplicate-entry risk without deleting the file.
- Restore visible access to settings, filtering, stats, reset, and export controls.
- Fix flash question self-evaluation after viewing the answer.
- Add a minimal manual test checklist.
- Avoid schema upgrades and large refactors.

Allowed changes:

- Small, targeted edits to existing native HTML/CSS/JS.
- Documentation updates.
- A `TESTING.md` checklist.

Not allowed in this phase:

- React/Vue/Vite/npm.
- Backend or database.
- API integration.
- v4 schema upgrade.
- Remember/fuzzy/forget review model.
- Large UI redesign.

### Phase Two: Data Model Upgrade

Goals:

- Add explanation field.
- Add difficulty field.
- Prepare migration from current v3 localStorage shape.
- Plan the future remember/fuzzy/forget review result.
- Reduce duplicate review state where practical.

### Phase Three: Ebbinghaus Review System

Goals:

- User-customizable review intervals.
- Clear due calculation.
- Separate today and overdue review lists.
- Improve review state display.
- Keep existing localStorage users compatible.

### Phase Four: Card Import Optimization

Goals:

- Define a stable JSON card/deck package format.
- Make AI-generated card groups easier to validate and import.
- Improve import errors and duplicate handling.
- Consider CSV or Markdown import after JSON is stable.

### Phase Five: UI Refactor With Gemini Collaboration

Goals:

- Gemini can help design UI prototypes and visual layout ideas.
- Codex owns implementation and protects existing logic.
- UI changes should not rewrite the core data/review/import/export logic.
- Component-like organization may be introduced carefully, but only after logic is stable.

### Phase Six: Multi-User And Sync

Future only.

Possible directions:

- Firebase
- Supabase
- Another lightweight backend

Do not implement until local single-user flow and class sharing package flow are stable.

## 6. AI Collaboration Rules

### Codex Responsibilities

Codex may:

- Read and modify real project files.
- Fix app logic.
- Maintain data structures.
- Add migration logic when explicitly requested.
- Add tests or manual test documents.
- Keep GitHub Pages deployment working.

Codex must:

- Read the current code before changing behavior.
- Keep edits small and phase-appropriate.
- Preserve existing functionality unless the user explicitly asks to remove it.
- Update this blueprint after important project changes.

### Gemini Responsibilities

Gemini may:

- Propose UI layouts.
- Produce visual mockups.
- Suggest wording and information architecture.
- Help generate card-deck JSON content from study materials.

Gemini must not:

- Rewrite the app architecture.
- Modify core review logic.
- Modify localStorage schema.
- Replace native HTML/CSS/JS with a framework.

### Strict Limits

- Do not introduce React, Vue, Vite, npm, or another framework unless the user explicitly changes the project direction.
- Do not add a backend in the current stage.
- Do not casually change the localStorage key or stored data shape.
- Do not delete existing features.
- Do not add paid API calls in the app during the current phase.
- Do not make UI-only changes that break learning, review, import, export, or persistence logic.

## 7. Current Priority Tasks

Current work:

- Phase one stabilization is in progress.
- The first phase-one code pass has been completed: entry drift prevention, visible settings/statistics/export controls, flash-card answer reveal self-evaluation, and manual testing documentation.

Next tasks, maximum three:

1. Manually run the `TESTING.md` checklist in a browser.
2. Decide whether the now-visible settings/statistics/export panel needs minor wording or placement cleanup.
3. After manual verification, prepare the next phase-one polish or move to phase two only if the user approves.

Completed in phase one:

- `flashcard.html` no longer contains a second full copy of the app; it redirects to `index.html`.
- The existing settings/filter/statistics/reset/export panel is visible again.
- Flash question answer reveal now marks the card ready for manual self-evaluation.
- `TESTING.md` documents the minimum manual test flow.

Do not do now:

- Do not upgrade to v4 schema.
- Do not introduce remember/fuzzy/forget yet.
- Do not add login, backend, or AI API integration.
- Do not redesign the whole UI.

## 8. Risks And Notes

GitHub Pages limitation:

- GitHub Pages serves static files only.
- There is no server-side storage, scheduled job, or shared database.
- Every user's data is local to their own browser unless they export/import packages.

localStorage data risk:

- Browser clearing, private mode, device changes, or profile changes can lose data.
- Different users will not automatically share review progress.
- Export should remain visible and easy to use.

Data consistency risk:

- Current review state is split across multiple structures.
- Deleting, replacing, or importing cards must clean related review state.
- Future schema changes need explicit migration.

UI and logic coupling risk:

- The whole app currently lives in one large HTML file.
- UI controls and business logic are tightly coupled.
- Small targeted changes are safer than broad rewrites until tests exist.

AI code modification risk:

- AI-generated edits can accidentally rewrite working logic.
- Any assistant working on this project must inspect existing functions before changing them.
- Gemini should not be given authority over core app logic.

Duplicate entry risk:

- `index.html` and `flashcard.html` currently duplicate the same app.
- This can cause inconsistent fixes if only one file is edited.
- Phase one should remove this drift risk while preserving the old file path.

## 9. Update Rules

This file is the project memory and navigation document.

Every time Codex completes an important project modification, update this file with:

- Current phase.
- Completed tasks.
- Next tasks.
- New risks or decisions.

Do not turn this file into a vague status note. Keep it tied to real project files, real behavior, and current development constraints.

When starting a new Codex session:

1. Read this file first.
2. Check `index.html` before making behavior claims.
3. Keep phase boundaries unless the user explicitly changes the plan.
4. Update this file after meaningful changes.

## 10. VNext Status (2026-08-12)

The user authorized a full UI rebuild with the Sites plugin.

- The legacy static app remains in `index.html` and is not deleted.
- The new implementation is in `nous-vnext/` and should be treated as the active redesign surface.
- The VNext first build has a collapsible workspace, card gallery, card-detail overlay, review controls, notes, search, AI-import drawer, and demonstration data.
- VNext has passed a production build and local response check.
- VNext first version is privately published through Sites for user review.
- VNext can also be served from this Windows computer through Cloudflare Tunnel at `https://nous.questory.dpdns.org`; the local setup is documented in `nous-vnext/LOCAL_TUNNEL_SETUP.md`.
- Remaining VNext work: connect real local data/import data, implement strict question-bank validation, persist changes, migrate legacy data, and implement the complete review scheduler.

## 11. Questory Root Homepage (2026-09-24)

- `questory-home/` is the temporary root-domain tool hub for `https://questory.dpdns.org`.
- It intentionally stays separate from the legacy root `index.html` and the active Nous VNext app.
- The root domain routes to local port `3001`; Nous remains on `nous.questory.dpdns.org` and local port `3000`.
- The homepage is a usable launchpad with a live Nous entry and a clearly inactive future-tool slot. It should grow as new tools are actually built, without inventing fake functionality.

## 12. MVP Core Contract (2026-09-24)

- The active engineering line is now the source-linked MVP Core described in `MVP_PLAN.md`.
- `nous-package-v0.1` schema, domain types, strict source-reference validator, canonical source chunking, and import preview are implemented under `nous-vnext/app/domain/`.
- UI remains intentionally demo-backed until repository persistence and the study engine are ready to replace it safely.

## 13. Home Navigation Direction (2026-09-29)

- All blocking study workflows should use native top-layer modals, full dynamic-viewport backdrop coverage, capped panels and independent content scrolling. Keep question navigation available on small screens and footer actions within view. Verify mobile portrait, tablet, narrow 320px and short landscape layouts; actual soft-keyboard testing is a future device check.

- Consistent compact context menus for folders and cards; inherit organization visuals through deck/card headers. Question-type glyphs supplement text labels rather than replace them. Folder trash is reversible for whole subtrees; permanent folder purge needs a separate safe transaction design.

- Utility navigation uses conventional, recognizable Lucide symbols: gear for settings and trash bin for recycle bin.

- File organization styles: each folder may override name/icon/color while stable IDs preserve membership; icon/color inherit independently down the tree, defaulting to current accent tokens at root. Use curated Lucide icons now; Chinese icon search and full library expansion can follow later.

- Card/deck context actions support batch selection and recoverable trash. Keep unimplemented tagging/move/review submenu actions out of the menu until connected to real storage/workflows.

- Local recycle bin supports recoverable card/deck removal; permanent card deletion requires confirmation. A future full privacy purge must handle independent source/package/history retention explicitly.

- Settings should live in one sidebar-bottom entry. Keep a single direct search box at top and a single import entry in navigation; consolidate appearance, backup and help under settings.

- 2026-10-05: Adopt deck-first home: one imported package is one deck, opened to browse its cards. Prefer downloadable AI JSON files with paste fallback. Future deck management should add rename/move and scoped study without mixing unrelated decks; current daily review remains library-wide.

- Important operation outcomes belong beside their triggering control, especially inside native dialogs. Use InfoTip for secondary detail, keep the immediate next action visible, and respect reduced-motion preferences for all feedback animations.

- The entire importer window should accept a single dropped original, show hover/drop feedback and share auto-save behavior with the file picker. File drops must not navigate the browser away from the app.

- Sidebar density uses shared --nav-row/gap/section/root tokens with compact, normal and wide presets. Type/icon/counter sizes stay consistent across presets; appearance preferences persist per browser.

- Import is a centered native modal with a blurred backdrop and its own scroll region, consistent with help/appearance dialogs. Close/reopen retains in-session form drafts.

- Theme accents use --theme-main/soft/border/dark/hover/onMain tokens generated from one user-selected hex color. New components must reuse tokens; semantic status colors and neutral surfaces are independent. Appearance is currently per browser rather than synced per account.

- File import should start with one visible file-picker action, auto-save and explicit filename confirmation. Each external AI generation uses one chosen source; prompt selection must never silently include all historical originals.

- 2026-10-05: First-visit five-step tutorial and reusable header help explain the actual transcript-to-study workflow. SRT subtitles are accepted directly. Future guided progression can follow saved-source/import/review milestones; audio transcription needs a separate implementation.

- Keep the green card-library rail as the sidebar's main visual anchor. Category counts and filtering must derive from live card/learning data, with folders visible beneath it.
- Future reference items—planned/paused/completed schedules, calendar and marks—need durable definitions and storage before becoming navigation entries. Do not display them as working controls prematurely.
