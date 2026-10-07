# Current State

Purpose: Current project phase, stable facts, blockers, and next recommended actions.
Read when: Starting or resuming project work.
Skip when: Only reading historical decisions or one-off command output.

## Phase

MVP Core implementation and acceptance; Release infrastructure prepared but not activated.

## Current Top Objective

Complete the supplied Nous V1.0 learning loop and verify it before authenticated public Release.

## Stable Facts

- 2026-10-07: User authorized GitHub progress upload; prepared codex/progress-2026-10-07 snapshot, not main/deployment. Fresh 156 domain tests and TypeScript pass. Includes active frontend/backend scaffold/docs; excludes user data/caches/secrets/unrelated Questory. Remote receipt checked after push.

- 2026-10-07 updated sync: Nous-prefixed folders/files, same IDs/links; destination Nous_同步资料, 21 individual exports (6/7/8). Metadata header precedes unchanged UTF-8 body; previous byte-only export description below is historical.

- 2026-10-07: Nous project-description Drive sync bound via references/nous.json in project-memory-drive-sync skill. 18 descriptions + index yield 21 exports in groups of 6/7/8. Minute/logon user task LastTaskResult=0; repeated export updated 0; representative cloud text readback verified in all groups. See PROJECT_CONTEXT_INDEX.md; no application/deployment changes.

- Active app: nous-vnext (nested Git repository). Legacy root app preserved.
- User authorized D1/backend work and selected email whitelist entrance protection.
- D1 nous-mvp exists with four empty application tables; no app binding or user data upload.
- Access application and One-time PIN configured with the approved three-email allowlist; dashboard confirms creation. Live verification blocked by nous.questory.dpdns.org DNS name-not-found (browser and OS resolver).

## What Exists

Source/content repositories, schema/provenance checks, seven-type grading, study UI, per-user notes, unified review journal, scheduler/repair queue, outbox and JWT verifier/API skeleton.

## What Works

- Learning dialog is now native modal with viewport-sized overlay and background scroll lock. Responsive geometry verified on four sizes from 320px portrait through tablet and short landscape; mobile import fits and scrolls internally. Typecheck/lint/isolated build passed on 2026-10-05; real-device keyboard behavior remains unverified.

- Reversible folder-tree trash, inherited deck/card icons and seven question-type icons; context menu typography and sizing unified. Verified lint/typecheck, 156 domain tests, preview build and visible browser UI on 2026-10-05. Permanent folder purge and manual long-press verification remain outstanding.

- Folder editing with stable legacy identity, 110 curated Lucide icons and independently inherited icon/color metadata. Backup includes style overrides; browser confirmed saved icon and unchanged memberships on 2026-10-05. Typecheck/lint/isolated build and folder/backup tests passed.

- Local deck-first gallery groups existing import packages without rewriting saved cards; JSON-file result import and post-import modal dismissal are implemented. Browser verified real course grouping (22 cards / 23 questions); typecheck, focused lint, 153 tests and isolated build passed on 2026-10-05. Deck management operations and scoped study remain future work.

2026-10-05: Header theme picker changes shared UI accent palette, derives light/dark/foreground colors and persists locally. Browser verified switching and reload retention; TypeScript, focused lint, palette test and isolated build passed.

2026-10-05: File-first import auto-saves supported originals, explicitly selects one source and copies only that source into the prompt. Old test sources are not selected automatically. Selected-source mismatch blocks preview confirmation; tutorial now matches this flow.

2026-10-05: Local3100 includes first-visit tutorial, header re-entry, actionable usage guidance and SRT original-file support. 151 domain tests and isolated production build pass; browser verified automatic guide and its import action. Audio must be transcribed outside Nous; AI question generation remains external and manual.

2026-09-29: Local folder context menu creates persistent empty children, supports nesting and collapse/expand, rejects duplicate siblings and preserves corrupt storage. Existing cards unchanged. localhost3100 runs isolated production snapshot at nous-vnext/work/folder-preview-20260929; port3000 deployment was not rebuilt. Folder assignment/import destination remains future work.

2026-09-29: Home library navigation uses a green expandable card-library rail, real counts and filters for learning state, missing tags and missing category. The folder tree and right-click creation remain below those filters. Mobile has a menu button. The localhost3100 isolated preview was refreshed; public port3000 was not rebuilt.

See PROJECT_MEMORY.md for exact dated verification slices. Local browser synthetic tests covered import confirmation, source disclosure, locked answers, hint cap, dynamic repair, due resurfacing and note reload. Full real-course gate is NOT passed.

## Known Issues

- Separate card/repair/outbox persistence and recovery need full validation; UI still has placeholder controls.
- Reference-only items such as paused/completed plans, calendar and saved marks have no durable model yet and are not shown as working controls.
- Live domain DNS resolution, backend Access config, frontend authenticated identity, D1 binding and real sync remain unfinished; Access entrance configuration alone is not release acceptance.
- Dependency advisories remain. No blanket release/security completion claim.

## Current Blockers

Access permission change awaiting confirmation; real-course acceptance awaiting actual user course text. These do not block all local engineering.

## Next Recommended Actions

Complete browser/full Core acceptance, finish recovery and content/state separation, then configure confirmed Access application and verified D1 integration without changing unrelated domains.

## Last Updated

Trial handoff checkpoint: latest build started only on localhost3100 (session47344; prior listener command verified before restart). HTTP200, updated import guidance present and fictitious third-round text absent. User can trial current browser-local app; not public/multi-user delivery. Stop widening minor cleanup; prioritize real-course acceptance and explicit OTP activation confirmation.
