# Codex Memory

## 2026-10-07: GitHub progress snapshot preparation

User authorized uploading current Nous progress. Includes root legacy changes, descriptions and non-generated VNext source/tests/schema/migrations/configs. Nested Git metadata/history retained locally; VNext staged as real root-repository files, not a gitlink. Exclude secrets, databases, caches, tool state and separate questory-home. Target remote branch codex/progress-2026-10-07 keeps origin/main/site unchanged. Fresh 156 domain tests and non-incremental TypeScript pass; no production build/deployment or release claim. Verify upload receipt against remote branch after push.

## 2026-10-07: Updated Drive skill naming migration

Final verification: 21 full-body/export hashes match, repeated run updated 0, both exporter integration tests and skill validation pass; connector confirms all 21 original file IDs preserved, prefixed names and updated index headers in each group. Existing scheduled task restored; triggered execution result 0. Cloud readback is point-in-time evidence, not a permanent upload guarantee.

Applied latest cancellation: individual sources retained, no project-wide bundle. Renamed existing Nous root/groups/21 files in place with Nous prefix, preserving IDs/URLs. Binding includes ProjectName/per-file Category; exporter adds project/category/source header then unchanged original UTF-8 bytes. Legacy configs unchanged. Tests cover headers, body preservation, skip, changes and missing-source preservation. Previous binding: skill references/nous.pre-prefix-20261007.json. Task paused during migration; no site/other-project changes.

## 2026-10-07: Project memory Drive binding

Bound 18 selected project descriptions plus context index (21 exports across three semantic groups) to Google Drive Desktop. Configuration: C:/Users/dlrsh/.codex/skills/project-memory-drive-sync/references/nous.json. Task: Codex-Nous-ProjectMemory-DriveSync, minute + user logon; local sources authoritative. See PROJECT_CONTEXT_INDEX.md for actual subgroup links and historical/current boundaries. No code, classroom originals, databases, secrets or unrelated projects included; no website/deployment changes. Verification results are recorded in current-state/change-log after checks.

## 2026-10-05: Viewport-safe native learning modal

- Reproduced learning overlay at 858×918: dialog ended at y=836, was not :modal, leaving 82px uncovered. Replaced plain dialog open attribute with showModal lifecycle, native ::backdrop and explicit full dynamic-viewport wrapper; body scroll locked/restored and Escape synchronizes React close state.
- Added responsive.css last in style order: capped panels, internal overscroll-contained scroll areas, stable header/footer, mobile horizontal question navigation instead of hiding it, short-height layout and grid/search overflow protection. Existing import uses native modal, checked small-screen scrollability.
- Fresh TypeScript/focused lint and isolated build passed. Browser geometry confirmed full overlay, modal isolation and in-bounds footer at 390×844, 768×1024, 844×390 and 320×568; no study horizontal overflow. Import at 320×568 fit 300×544, internally scrollable without horizontal overflow. Escape restored body overflow; reset viewport after tests. Real mobile keyboard/browser chrome not tested.

## 2026-10-05: Unified context styling, folder trash and question icons

- Folder rows support 500 ms long press and context-menu move to trash. FolderRepository.setTrash marks/restores a complete descendant tree in one metadata write; active library and study queues exclude cards inside trashed legacy folders. Bin exposes folder restoration. Permanent folder purge is not implemented; card purge remains separate.
- Deck/card icons resolve folder ancestry and live accent defaults, refreshed after folder editor writes. Both context popups now share 220px width, 13px text and compact styling. Seven question types use distinct Lucide icons in question navigation and type pill while retaining labels.
- Fresh lint/typecheck, 156 domain tests and isolated build passed; preview 3100 restarted. Browser checked compact folder menu, inherited BookOpen deck style and single-choice/short-answer icons. Did not delete user content for verification; long-press needs manual pointer check.

## 2026-10-05: Correct utility navigation icons

- Settings now uses Lucide Settings gear; recycle bin uses Lucide Trash2 rather than folder. Shared sidebar sizing, stroke and accent styling preserved. Focused lint/typecheck and isolated build passed; preview refreshed.

## 2026-10-05: Folder editing and inherited icon styles

- Folder context menu now edits names, Lucide icons and custom/preset colors. Curated 110 consistent line icons across five categories with English-name search. Identity-preserving metadata overrides in nous.folder-edits.v1 let legacy folders rename without changing card folder references or child parent IDs; included in backups.
- Icon and color independently inherit nearest explicit ancestor values; roots default to Folder and live theme-dark CSS token. Clear selections return to inheritance; original content unchanged. Installed lucide-react from npm; npm reported 25 dependency vulnerabilities, not remediated blindly.
- Fresh TypeScript/focused ESLint passed; 154 domain tests passed before final extra corruption test, then all 8 focused folder/backup tests passed. Final isolated build passed; restarted 3100. Browser verified editor, saving BookOpen on 圣经研读 / 新约, reopening persisted choice and unchanged card counts. Folder deletion/retag/export-per-folder are not implemented by this menu.

## 2026-10-05: Context menu and batch selection

- Added SelectionGallery for decks/cards: right-click action popup, 500 ms long press, selection toolbar, paint selection with held left pointer, select-all and batch move to trash. Menus use theme tokens, selected outlines and reduced-motion fallback. No destructive data operations performed during checks.
- Isolated build passed and 3100 restarted; browser shows multi-select entry and trash. Browser right-click test was intercepted by the page inspector, so native long-press/paint selection still needs manual interaction verification.

## 2026-10-05: Local recycle bin

- Added per-card deletedAt soft deletion and deck/card trash actions, restoration and confirmed permanent card removal. Trashed cards excluded from library filters and daily/repair queues. Backup includes trash through the existing cards key. Original source, immutable imported package and learning history remain independently retained (not a privacy purge).
- TypeScript, focused ESLint and isolated build passed. No user content deleted during implementation. Complete trash lifecycle needs further UI testing.

## 2026-10-05: Unified settings entry

- Moved appearance, navigation density, backup export and tutorial into the sidebar-bottom settings entry with a line icon. Removed duplicate sidebar search shortcut and top AI import; kept top search and sidebar import as canonical entries.
- Verified focused ESLint, TypeScript and isolated preview build; restarted 3100 and confirmed actual settings contents in browser. Existing stored cards unchanged.

## 2026-10-05: Deck-first library and JSON file import

- Home groups cards by imported package ID (legacy cards by folder), preserving storage and distinguishing same-name packages. Successful import closes the modal and selects the imported deck.
- Prompt requests a genuine downloadable UTF-8 JSON attachment when the external AI supports files; otherwise falls back to JSON text. Import accepts JSON files up to 10 MB with UTF-8/JSON validation before existing preview and confirmation.
- Verified typecheck, focused ESLint, 153 domain tests and isolated production build; restarted localhost 3100. Browser confirmed the real classroom deck contains 22 cards / 23 questions and opens its cards. No production deployment. Deck rename/delete and deck-scoped review are not yet implemented.

## 2026-10-05: Feedback and progressive-disclosure polish

- Import copy now shows busy/success/failure in the button and an inline next-action status, solving feedback hidden behind the native modal. Success is bound to the copied source ID. Reduced duplicated save text and collapsed manual-copy details by default; failures open manual fallback.
- Introduced reusable keyboard/click-accessible InfoTip disclosures for importer detail text. Added shared button press/hover transitions and short feedback reveals, respecting reduced motion across home, settings, tutorial and import controls.
- TypeScript, focused lint and isolated3100 build passed. Browser verified actual SRT source selection, clipboard-success label and expanded info tip. No external AI submission occurred.

## 2026-10-05: Drag-and-drop original import

- The full importer dialog accepts file drops, prevents browser file navigation and shows an accent drop hint. Drop and file-picker share the same read/automatic-save/select path. Unsupported/oversized originals retain existing validation; multiple files and overlapping imports receive clear feedback. Feedback is visible beside the file action.
- TypeScript, focused lint and isolated build passed. Native desktop drag interaction is not automated; user can trial dropping a supported original into localhost3100.

## 2026-10-05: Consistent sidebar size and density

- Unified navigation fonts (13px), icons (18px), counter dimensions, folder rows and section spacing. Compact is the default; appearance settings include compact/normal/wide spacing and browser-local persistence. Theme header entry is now named appearance settings.
- TypeScript, focused lint and isolated build passed. Browser verified wide selection and compact visual result; compact retained for user trial.

## 2026-10-05: Centered importer modal

- Replaced the right-side importer with a native centered dialog, blurred backdrop, larger scrollable page surface and sticky header. Native modal focus containment, Escape/backdrop/close dismissal and background-scroll lock preserve current form state across close/reopen.
- Isolated build and TypeScript passed; focused lint passed after documenting the native backdrop click exception. Browser confirmed centered blurred view and Escape returns focus to AI import.

## 2026-10-05: Shared accent palette and user appearance setting

- Added validated accentPalette generator: main, soft, border, dark, hover and contrast-selected foreground. Shared theme.css binds navigation, action buttons, selected states, focus rings, tutorial, importer and study accents to these tokens. Semantic warning/error/rating colors remain distinct.
- Header theme picker includes presets, arbitrary color input, live palette preview, reset and per-browser local persistence. TypeScript, focused lint, palette test and isolated3100 build pass. Browser verified purple recolor and reload persistence, then restored default green.

## 2026-10-05: File-first import usability repair

- Import drawer now leads with a large computer-file button; selecting supported text/subtitle automatically saves via SourceRepository and selects exactly that source. Existing originals require explicit selection. The copy button is disabled until a source is selected and exports that source only; failed selection/save clears stale prompt selection.
- Added selected filename/save feedback, collapsed optional paste/manual-copy paths, sequential AI-return instructions, and preview rejection when the returned package uses a different selected source. Updated tutorial accordingly.
- TypeScript, focused lint, 151 domain tests and isolated3100 build passed. Browser visually verified topmost file button, explicit saved-source selector and disabled copy before selection. No external AI or public deployment was invoked.

## 2026-10-05: First-visit learning guide and classroom subtitles

- Added a five-step native dialog guide: prepare transcript, save original, generate externally with the Nous prompt, import validated JSON, study/review and back up. First visit per browser shows it; dismissing records a local seen flag and the header can reopen it.
- Added UTF-8 SRT import, preserving original timestamps/wording for provenance. No automatic audio transcription or external AI submission was added. Source-file regression and full 151-test domain suite pass; isolated build passes; browser verified initial guide and final import action.

## 2026-09-29: Home navigation reference adaptation

- Reworked the VNext home sidebar around a green expandable card-library header, line icons, count badges, grouped filters and the existing folder tree. Counts come from current cards and learning states; no reference-image dummy counts were used.
- Added tested filters for new, due, learning, review, untagged and uncategorized cards; retained right-click nested folders. Added a narrow-screen menu and replaced inert bottom navigation buttons with usable actions.
- Verified 150 domain tests, TypeScript, focused lint and an isolated production build. Browser checked desktop counts/filter/collapse and mobile menu. Full-project lint script incorrectly traverses generated preview output under `work/`; source-targeted lint passed. Port 3000/public deployment was not changed.

- 2026-09-29: Added 220ms grid-track expand/collapse, 180ms opacity and rotating chevrons for root/nested folders. Retained DOM enables closing animation; inert + aria-hidden disable collapsed descendants. Reduced-motion media query disables transitions. Isolated build/typecheck/targeted lint passed; root collapse/expand UI verified on localhost3100 (session87035). No storage or production changes.

- 2026-09-29: Replaced decorative All Cards chevron with independent accessible root expand/collapse button controlling library-folder-children. All Cards selection/right-click remain separate. Isolated build passed and localhost3100 restarted (session11921); UI verified descendant removal on collapse and restoration on expand, card content unchanged.

- 2026-09-29: Fixed folder dialog top-left placement caused by Tailwind margin reset: explicit fixed/inset:0/margin:auto, viewport height cap and vertical scrolling. Isolated preview rebuilt, localhost3100 restarted (session3955); browser screenshot confirms horizontal/vertical centering. No card data or public3000 artifacts changed.

- 2026-09-29: Added FolderTree context menu + native naming dialog, nested expand/collapse, empty folder persistence in nous.folders.v1, and backup inclusion. Legacy card.folder strings remain literal root names; no card migration/move/import targeting added. Tests cover reload hierarchy, sibling duplicates, invalid parents, corruption preservation and failed writes. Browser created QA import confirmation / 子文件夹测试 (left in place), confirmed collapse and reload retention with existing five cards. Mouse menu/dialog verified; automation coordinate scaling required screenshot-guided click. 149 domain tests, typecheck, targeted lint and isolated build pass. Native dev under Cloudflare failed at Ajv runtime schema compilation; localhost3100 instead runs isolated production snapshot in nous-vnext/work/folder-preview-20260929 (session73631), source and running3000 dist untouched. Existing hydration warning remains; no claim of full release acceptance. User requests direct execution for future clear small changes, with destructive/permission/publication confirmation retained.

- Follow-up diagnosis 2026-09-25: public resolver 1.1.1.1 resolves Nous/root to Cloudflare A/AAAA, but router resolver 192.168.0.1 returns name-not-found and IAB navigation fails. Independently, dashboard shows existing tunnel disconnected; no cloudflared process or listeners on 3000/3001/3100 found. Existing scheduled task is Ready (last run Sep24), not current service health. Startup script starts both Nous and Questory plus shared tunnel; do not run silently as a Nous-only change. No DNS settings or processes changed; request scoped restoration approval.

- 2026-09-25: Confirmed user-authorized Access application creation in dashboard: Nous — approved classmates, exact hostname nous.questory.dpdns.org, app e19c396c-2585-4bb8-8778-5dad0243d39b, existing three-email allowlist policy 9bf9a491-b025-4182-8a64-113d1ea7c79a. Only One-time PIN selected; accept-all IdPs disabled. Dashboard reports successful configuration. Live verification blocked: browser ERR_NAME_NOT_RESOLVED and OS DNS reports name does not exist. No actual OTP email sent, no login verified, no DNS/tunnel/backend changes this turn.

- Rebuilt trial UI and restarted only verified localhost3100 process; session47344 HTTP200 confirms new import guidance/no fake round text. Public route unchanged. Remaining requested inputs: actual course material and OTP activation confirmation.

- Trial handoff cleanup: removed fictitious third-review-round timeline and fixed Bible breadcrumb/target-folder claims; empty workspace now explains source/import workflow and former inert New button opens import. Full typecheck passes; running preview not rebuilt this turn.

- Repair delay regression: reject fractional/nonfinite/negative waiting counts before enqueue; original pool retained. Focused red/green test added.

- Added backup coverage for journal/content/notes and explicit auth-key exclusion. Two tests pass; no user storage read/download in test.

- Runtime caught vinext beta12 incompatibility with current Cloudflare-plugin Node start. Rolled back framework/RSC plugin only; QA3100 rebuilt/restored HTTP200 session24807. Previous security-upgrade success was build-only; vinext issue still open.

- Patched vinext and matching RSC plugin after peer checks; build143 tests pass, audit17 issues. Framework runtime QA pending; no live server changed.

- Added source-fragment reference coverage to preview with explicit caveat; eight import tests pass after regression.

- Added allowed-key event contract validation;15 focused tests pass after observed unknown-field acceptance regression. No live data rewritten.

- Added read-only verified session endpoint, no-store/unauth401 tested. Three focused tests pass; no real login activated.

- Added explicit-timezone event timestamp validation after failing regression; nine contract/replay tests pass. Existing data unchanged.

- Added explicit local backup download action. Typecheck passes; no automatic download performed during coding, browser acceptance pending.

- Added tested raw local-backup serializer limited to known Nous data keys. No credential/general storage export, UI wiring pending.

- Prevented invalid repair store silent reset/overwrite; added validation/error guards. Typecheck passes; fault-injection browser QA pending.

- Added conflicting history replay test verifying fail-closed and no input mutation. Three focused tests pass; recovery UI still pending.

- Added nonmutating baseline event replay with repair/duplicate/user checks; regression passes. No live data rebuilt yet.

- Wired library sidebar to real folder/count data and filter, removed demo tree entries. Typecheck passes; runtime UI QA pending.

- Archived initialCards prototype in fixture and stopped automatic demo seeding for new users. Existing data retained. Typecheck passes; fresh-browser acceptance pending.

- Latest full build/136 tests/ESLint all exited0. Overall product remains incomplete; green engineering checks do not replace live auth, deployment or real-course acceptance.

- Browser QA confirmed independent note survives reload/reopen exactly. Synthetic test note only, no remote writes or scoring event during note test.

- Browser verified persisted event/due/version/timing on reopened QA card and real-time due resurfacing. Evidence shows30m interval and10935ms response. QA server13380/tab12 retained; synthetic only.

- Added collapsible question history/due display for inspection of actual evidence. Typecheck passes; browser verification pending.

- Prevented note edits after failed read with disabled field and handler guard. Typecheck passes; runtime fault QA pending.

- Connected independent notes storage to open/edit/navigation; legacy note fallback retained without rewriting content. Typecheck passes; browser note acceptance pending.

- Added per-user/question NotesRepository with two passing tests. UI wiring and explicit legacy note handling pending; no data moved.

- Added bounded streaming JSON reader and413 branch to reviews API. Three focused tests pass; authenticated live path unverified.

- tsc passes; documented four event-only timer purity lint false positives with local directives. Fresh lint passes; runtime timing QA still separate.

- Replaced raw JSON string equality in API replay with validated field comparison. Two focused tests pass; live D1 branch untested.

- Aligned server repair scheduling with local non-advancement; missing prior state409. tsc and seven contract/auth tests pass, actual authenticated DB branch pending.

- Added no-store headers across review API responses with observed red/green route regression. No live deployment changed.

- Wired API to Access JWT adapter with unset server config. Route tests confirm fake identity headers401, three tests pass. Real auth/D1 deployment not activated.

- Added Access request adapter with bounded token and cached JWKS resolution; five focused tests pass. Not live authentication; API/config still pending.

- Access configuration checkpoint: saved Nous email allowlist policy after explicit confirmation; exact policy ID in PROJECT_MEMORY. Nous application remains unsaved draft because account has Cloudflare IdP only and adding One-time PIN awaits action-time confirmation. No entrance protection claim; reuse policy, do not recreate.

- Added strict Access origin/audience parser with fixed JWKS endpoint. Three config/crypto tests pass; no live configuration changed.

- Added JWT negative paths with real RSA keys: wrong issuer/key, missing expiry, unsigned token. Both verifier tests pass; live Access integration remains absent.

- Added standard jose-based Access JWT verifier with real cryptographic test. API not opened; issuer/audience/JWKS and Access allowlist configuration pending.

- Preserved optional explanation through new import and post-submission feedback rendering. Typecheck passes; no old-data rewrite.

- Added import in-flight lock and disabled confirmation during save; releases on failure/success. Typecheck passes; browser double-click QA pending.

- Persist card index before import success feedback; write errors are caught. Typecheck passes; package/index still separate writes and concurrency not solved.

- Prevented malformed card storage auto-overwrite by demo fallback; error banner/write guard/import guard added. Typecheck passes; deeper validation and browser fault QA pending.

- Added visible journal-read error and daily-start guard; one initial read for history/state. Typecheck passes; recovery UI/browser fault testing pending.

- Fixed journal false conflict on reordered JSON properties with red/green regression. Six focused tests pass.

- Unified gallery state badge class/text on question-state aggregate and removed unused mapping. Typecheck passes, post-fix visual QA pending.

- Replaced optimistic card label with child-state aggregate; focused test passes. Old stored state/CSS remains, browser visual QA pending.

- Browser journal-path scoring/reload smoke passed for imported QA card (review1 retained, queue0). Still need correct card mastery aggregation and direct history evidence display.

- Journal-integrated build +123 tests pass; QA3100 restarted to session91390. Browser retained imported card/source after reload; new scoring transaction QA pending.

- Switched page scoring/skips and state/history read to unified journal; removed duplicate event write. Old stores retained. tsc + five journal tests pass; browser upgrade and whole-session recovery still pending.

- Added unified-journal scoring service; scheduling/retry regression and journal tests pass5. Not page-activated yet.

- Added non-mutating journal fallback to old per-user stores; four tests pass after red regression. No existing browser data migrated yet.

- Hardened one-write journal state/identity checks after red regression; eleven focused tests pass. Integration pending.

- Implemented tested one-write review journal prototype; two tests pass. Existing app still uses old service; integration/migration and validation pending.

- Re-ran full build/test/typecheck after browser source/import/repair QA. No full Core/Release completion: real-course input and allowlist missing, verified auth and transactional persistence remain implementation work.

- Browser verified newly imported choice options and expanded actual source quote/chunk text. Synthetic QA case only; no full Core PASS.

- Browser verified preview has no new card, confirm creates it, reload retains it after hydration. Source-linked synthetic QA card only; no real-course claim.

- Browser verified prompt fallback visible/read-only and contains actual saved source + Schema (6743 chars). QA server now47816 on3100. Clipboard roundtrip not yet proven.

- Added visible source-bound prompt/manual-copy fallback; no claim clipboard issue resolved. Typecheck passes; browser verification pending.

- Narrow browser saved synthetic original successfully. Copy prompt toast appeared but clipboard readback was empty; actual clipboard payload remains unverified. No content sent to an external model.

- Verified mobile import/save controls visible after scoped QA server3100 restart. Matched old PID command before stopping; new session16872. No live-port change.

- Fixed confirmed CSS cause hiding import/save controls on narrow screens; drawer scrolls within viewport. Build passes, post-fix browser visual verification pending.

- Browser QA completed returned repair: queue0, modal closed, card learning and completion toast. Persisted due equality not directly observed in browser; no broad Core PASS claim.

- Browser QA confirmed previously wrong question automatically returns after intervening questions within active session. Tab9 now at repair item; final repair evidence/due verification pending.

- computer-use verified show/hide hint then submit/Remember stays fuzzy, with submitted textarea disabled. Local demo QA only, no live changes.

- computer-use QA on isolated3100: wrong answer + Remember produced forgotten/repair feedback; reload preserved displayed queue/review counts. Full repair loop and stored-event inspection still pending.

- Browser-tested latest submit locking on isolated localhost:3100 using computer-use: wrong B selected, after submit all choice buttons visibly disabled. Server session 95660 and tab9 retained for continued QA. Not real-course acceptance.

- Added oversized-file and malformed UTF-8 behavioral tests. Four source-file tests pass; existing reader safeguards confirmed, no production behavior changed.

- Connected immutable package save before UI import. Typecheck and nine focused tests pass. Combined package/card transaction and browser verification still open.

- Added immutable package snapshot repository with version preservation test, passing after stub failure. Not yet page-wired; source trust remains import-service responsibility.

- Wired package fingerprint into imported IDs and preserved existing cards on identical reimport. Typecheck passes; legacy data untouched, browser reimport verification pending.

- Added tested canonical content package fingerprint for future namespaced IDs. Regression passes; page wiring pending.

- Unified home count with actual queue and added timed/focus refresh. Full tsc + seven queue tests pass; browser timing QA pending.

- Replaced fixed daily metric with actual local-day event count and explicit semantics. Focused regression passes; other mock content remains pending.

- Confirm import revalidates against freshly loaded originals and catches storage failures. Typecheck passes; no remote or existing data changed.

- Split preview and confirm import; exact JSON guard prevents edited text bypassing preview. Typecheck passes; browser UX verification pending.

- Fixed preview masking Schema failures as invalid JSON after unsafe collection access. Red/green regression and seven import tests pass; structured error codes still desirable.

- Connected source file adapter to labeled local file picker; user reviews text before save. Typecheck passes, browser picker acceptance pending; no remote uploads.

- Added txt/md source file adapter; two focused tests pass after missing implementation failure. Browser picker not yet wired; no files uploaded remotely.

- Removed fixed event contentVersion for page reviews: new cards preserve imported version; legacy unknown versions explicitly labeled. Typecheck passes; existing history not rewritten.

- Fixed response-array aliasing in event builder after mutation regression failed. Eleven focused tests pass; original input mutation no longer alters event snapshot.

- Skip now persists event + scheduled state rather than repair membership alone. Typecheck and skip service integration test pass; browser acceptance pending.

- Added frozen submitted response to new events; validated response shape and adjusted comparisons for array values. Focused suites pass; old history remains unchanged.

- Added monotonic per-attempt timing frozen at submit into review events. Typecheck passes; browser timing acceptance pending.

- Preserved original imported answer arrays and submitted multi/blank arrays through page grading; removes delimiter corruption for new imports. Typecheck passes; old cards not migrated.

- Added synthetic seven-type import/grading integration test, passing. Confirms shared format + source gate + grading compatibility, not browser/real-course acceptance.

- Added standalone schema regression; schema now enforces choice fields/answer structures without app validator. Fourteen schema/validator tests pass after red/green verification.

- Added choices field across domain/schema/page mapper and validator option/answer checks. Thirteen validator tests pass after observed missing-options failure. Browser import QA pending.

- Preserved judgment/explanation/analysis types in page import mapping; judgment now has boolean choices and automatic grading. Typecheck passes; imported choice options and browser acceptance pending.

- Preserved sourceRefs during package-to-UI conversion and replaced placeholder source disclosure with actual saved quotes/chunks. Legacy missing refs show explicit caveat. Typecheck passes; UI acceptance pending.

- Added event-write fault integration test: prior scheduling restored and no event appended on simulated synchronous failure. Seven service tests pass. Crash/rollback failure safety still unresolved.

- Added page commit/outbox error separation: local failure keeps answer/question; sync failure reports local-only save. Typecheck passes; browser fault-injection verification pending.

- Added per-blank completeness guard and connected submit handler. Three tests pass; UI rejects partial blank submissions without grading.

- Disabled submitted answer inputs and guarded handlers; removed nested React state updates in choice/blank editing. Full typecheck passes, browser check still pending.

- Page scores frozen submittedAnswer, not edited response; hintUsed survives hiding hint. tsc passes. Browser acceptance pending; inputs still visually editable.

- Added passing cross-module repair integration test including persisted evidence and state reconstruction. Confirms original delayed due remains after repair; not browser or real-course acceptance.

- Wired dynamic repair helper into page rating/skip continuation, passing updated pool explicitly. Session closes with waiting status if repairs remain; close clears queue. Typecheck passes; browser loop not yet verified.

- Added tested dynamic repair-tail helper, two focused tests pass after insertion regression. Not yet called by page; integration pending.

- Connected ready-repair success to sessionRepaired persistence and non-mastery feedback in page. tsc + nine focused tests pass; browser full repair loop not yet verified.

- Replaced ambiguous colon+32-bit event hashing with versioned encoded tuple after failing collision regression. Nine focused tests pass. Existing records untouched; explicit attempt identity still pending.

- Added same-storage flush coalescing after failing duplicate-send test. Five outbox tests pass; cross-tab synchronization remains open.

- Verified current complete engineering checks: production build, 97 tests, nonincremental TypeScript and full ESLint all exit 0. Lint was polled to terminal completion. No full MVP completion claim; functional acceptance gaps remain.

- Hardened event repository reads/appends using existing event contract. Malformed/foreign evidence regression failed before patch; 14 focused repository/service tests pass. No stored data migrated or cleared.

- Added red/green import checks for blank-count mismatch and ungradable boolean answers; 18 focused tests pass. Full seven-type schema and UI remain pending.

- Scheduler red/green guard regression: corrupt counters/clock now rejected before due calculation. Fourteen focused tests pass; no deployed change.

- Wired buildImportPrompt into page copyPrompt; fresh stored sources, awaited clipboard write, explicit failure feedback. Full tsc/build/93 tests pass; browser clipboard acceptance pending. No remote model call.

- Added tested source-aware import prompt generator (exact sources + schema + quote constraints). Two red/green tests pass; clipboard integration and full typed question contract remain pending.

- Patched Vite 8.0.13 to 8.0.16 after peer/engine checks. Production build + 91 tests pass; audit now 19 issues. No public deployment.

- Patched React trio to matched 19.2.8 after peer-version check. Production build and 91 tests pass; audit reduced to 22 findings. No live rollout; browser verification pending.

- Upgraded/pinned Ajv 8.18.0; updated lockfile. Full tsc and 16 focused validator/import tests pass. Audit now 23 findings (16 high); broader patching still pending.

- Audited exact dependency advisories: 24 total, including production RSC DoS and vinext/image-size exposure; devDependency placement does not imply runtime absence. Avoid audit force (suggests drizzle-kit downgrade). Scoped framework/security upgrades still required before public release.

- Full TypeScript check now passes after installing official Cloudflare types, declaring optional runtime DB, and correcting queue test input shape. No remote binding changed. npm audit still reports 24 vulnerabilities; broader dependency verification remains open.

- Direct event repository conflict regression fixed: same-ID changed payload throws and preserves original record; identical retries deduplicate. Thirteen focused tests pass after red/green verification.

- Local learning repository read/write integrity hardened after two failing regressions: reject foreign-user records, negative counters and invalid due dates without overwrite. Twelve focused learning/review tests pass.

- Fixed overlong source paragraphs after failing regression: bounded Unicode-safe slices, checked minimum chunk size. Eleven source tests pass; no existing sources rewritten. Original paragraph-separator reconstruction remains to address.

- Added red/green API rating-consistency regression. Contradictory effectiveRating is rejected before persistence; five contract tests pass. Server-authoritative content grading and real login remain incomplete.

- Added red/green duplicate-identity import regression and validation for cards/questions/sources/chunks; ten validator tests pass. Scope is one package; cross-package collisions still need namespaced repository identities.

- Remote-load red/green regression: malformed 200 payloads no longer become a successful empty history. Eight remote client tests pass; element-level validation remains open. No Access policy modified.

- Added repair-negative-path service coverage and red/green API parsing regression: nonboolean repair flags and wrong/skipped/revealed/forgotten repair-success claims are rejected. Ten focused tests pass; remote repair persistence and frontend mode wiring remain incomplete.

- Completed interrupted session-repair regression: successful repair event now preserves existing long-term scheduling in commitReview. Five focused review-service tests pass. UI/API repair-mode wiring remains open. No Access whitelist changes.

- Added observed red/green sync acknowledgement regression. 200/201 with missing, mismatched or HTML response is no longer counted as synced; matching event evidence is required. No remote writes during verification.

- 2026-09-25: Applied initial SQL migration to authorized new `nous-mvp` D1 after confirming no application tables. Wrangler succeeded; read-back verified four empty application tables. No user content transferred or live routing changed. Initial migration must not be repeated.

- Added executable migration test using real in-memory SQLite: table creation, duplicate user/question rejection, separate user progress. Test passed; no remote migration applied. Node sqlite emits an experimental API warning.

## 2026-09-25 — Authorized D1 provisioning

- User explicitly approved D1/backend deployment and completed Wrangler OAuth login. Read-only D1 list was empty before creation.
- Created `nous-mvp` in APAC (`5c152587-02bb-496b-b12a-36d2a79f486e`). Database is not yet bound/migrated; no domain or existing user data changed. Reuse this database on continuation.

- Fixed outbox silent-loss paths with two observed failing regressions: corrupted JSON is retained, conflicting event IDs throw instead of silently dropping incoming evidence. Domain tests pass; UI handling and full event validation still pending.

- Security containment: stopped trusting raw platform identity headers on Node/Tunnel. Observed red impersonation regression, then made identity resolution fail closed pending verified sessions/JWTs. Remote endpoints intentionally unavailable until actual auth is built; prior 503 header-injection smoke was not authentication evidence.

- Deployment authorization received; Wrangler login remains missing. Fixed validator crash on malformed collections with observed failing regression followed by early return on Schema rejection. Local Core is still incomplete; do not describe deployment as the only remaining work.

## Grading boundary correction

- Five red/green regressions corrected positional blanks, empty submissions, invalid boolean comparisons, multi-value single answers, and comma preservation. All 62 domain tests passed after the correction. Previous broad “all blanks graded correctly” claims were not supported by the earlier test coverage.
- Added a regression for waiting Repair Pool entries being incorrectly reintroduced as new questions; queue now excludes them until `remainingReviews` reaches zero. Full domain suite has 63 passing tests; lint passes.
- Wired Ajv 2020 to execute the frozen package JSON Schema before semantic validation. Added unknown-property and malformed-chunk regressions; full build and 65 tests pass. A fresh lint run is clean.
- Audited the empty backend skeleton and added the first D1/Drizzle contract: sources, immutable content packages, per-user learning states, and append-only review events. Generated the local migration `drizzle/0000_whole_alex_power.sql`; no remote binding or production data was changed. Full build, 65 tests, and lint pass.
- Added `/api/reviews` POST with platform-header authentication, strict event parsing, user ownership checks, idempotent replay/conflict behavior, D1-unavailable 503, and sequential state/event persistence. Route appears in the production build; no D1 binding or public deployment was changed. Full build and 68 tests pass; lint has six existing page rules open.
- Fixed the six page lint findings (state initialization and interactive modal/card semantics). Latest build still exposes `/api/reviews`; 68 domain tests and ESLint pass. D1 remains unconfigured and API writes are not crash-atomic.
- Changed `/api/reviews` persistence to Drizzle D1 `batch` for event + learning-state writes after idempotency checks. No remote D1 binding or deployment was touched. Build, 68 tests, and lint pass.
- Added `syncReviewEvent` with safe local fallback and wired it after local scoring commit. It is tested for success, unavailable backend, rejection, and network failure. No remote writes occur while D1/auth are absent. Build, 72 tests, and lint pass.
- Local API smoke found and fixed a route-loading bug: top-level `cloudflare:workers` import caused 500 before auth. DB import is now lazy; local production POST returns 401 without identity and 503 with identity when D1 is absent. Build/tests remain green.
- Added a browser ReviewEvent outbox with dedupe and retry-on-start/rating. Only confirmed server sync removes an event; offline/unavailable backends preserve local evidence. Full build, 74 tests, and lint pass; no remote storage is enabled.
- Added authenticated `/api/reviews` GET for per-user states/events and tested remote-load fallback behavior. No D1/auth configuration or public data access is enabled. Full build, 76 tests, and lint pass.
- Local production smoke verified GET/POST auth boundaries: unauthenticated 401, authenticated GET without D1 503, authenticated invalid POST 400, with no 500s. No remote deployment/data mutation.

## Review service checkpoint

- Extracted page scoring persistence into commitReview; reads current persisted state before scheduling.
- Added red/green regressions for duplicate retries and same-ID conflicting evidence; fixed double advancement and rejected conflicts.
- Two-key write/rollback is not atomic across crashes; no claim of completed transactional persistence or full Core acceptance.

Short change history for Codex. Read this with the blueprints before making systematic changes.

## 2026-08-12

- Continued requirements discovery for the Nous redesign.
- Confirmed card content: title, summary, core concepts, and a subquestion list for quick navigation.
- Confirmed source references should be compact and collapsed by default.
- Confirmed an external LLM should automatically split one submitted set of material into a complete, fully covered deck of knowledge cards.
- Confirmed wrong and skipped questions enter an end-of-session repair pool that repeats until resolved or the user explicitly ends the session.
- Confirmed one fill-in-the-blank question may have several blanks, each graded independently.
- No application code was changed.

## 2026-08-12: Sites VNext Build

- The user ended requirements discovery and authorized direct implementation with the Sites plugin.
- Created `nous-vnext/` as a separate modern web-app surface so the legacy static `index.html` remains untouched as a fallback.
- Implemented the first functional Nous learning workspace in `nous-vnext/app/page.tsx`.
- Implemented a warm, clean, card-first UI in `nous-vnext/app/globals.css`.
- The first version includes a collapsible knowledge tree, search, adjustable card gallery, study overview, guided external-LLM import drawer, card detail overlay, subquestion navigation, hidden-answer flow, user notes, rating actions, and wrong/skip repair-pool feedback.
- Removed the temporary Sites loading preview and unused skeleton dependency.
- Built successfully with `vinext build` and verified the local preview response.
- Published the first VNext version privately through Sites: https://nous-study-20260812.aestas-fig128.chatgpt.site
- Agreed to continue design through concrete, module-by-module acceptance questions after user testing.

## 2026-09-24: Local Cloudflare Tunnel

- Reused the existing logged-in Cloudflare Tunnel `2b9bd7e4-c7cb-4227-bc66-99f9f108ef65`.
- Configured `nous.questory.dpdns.org` to route to the local Nous production server at `127.0.0.1:3000`.
- Started the VNext production server and confirmed it returns HTTP 200 locally.
- Started the Tunnel and confirmed an active connector.
- Created a per-user Windows scheduled task named `Nous Local Web + Cloudflare Tunnel` to start both processes at logon.
- Public request was verified through a Cloudflare edge IP with the correct hostname and returned HTTP 200.
- The machine's default DNS resolver still had stale negative cache during verification; public DNS via 1.1.1.1 already returned the expected Cloudflare records.
- Windows system-service installation was attempted but requires administrator permissions, so the scheduled-task approach was retained.

## 2026-09-24: Questory Root Homepage

- Added an independent temporary tool-hub homepage in `questory-home/`.
- Root homepage is designed for `questory.dpdns.org`; it presents Questory as a personal toolspace and links to the live Nous workspace at `https://nous.questory.dpdns.org`.
- Added a small Node static server on local port `3001` and extended `nous-vnext/start-nous-local.ps1` to start it alongside Nous on port `3000`.
- Added Cloudflare Tunnel ingress for `questory.dpdns.org` -> `127.0.0.1:3001`; DNS CNAME was created successfully.
- Local homepage and Nous both returned HTTP 200. Public DNS had propagated through 1.1.1.1, while the machine's default resolver still showed a temporary stale negative cache during immediate verification.

## 2026-09-24: MVP Core contract and source-linked import

- Froze `MVP_PLAN.md`, `DECISIONS.md`, and `PROJECT_MEMORY.md` around the Source → Knowledge → Retrieval → Evidence → Memory loop.
- Added immutable content types, strict package validation, `nous-package-v0.1` JSON Schema, fixtures, deterministic source hashing/chunking, and import preview under `nous-vnext/app/domain/`.
- Domain and source/import tests pass through `tsx`; the existing full TypeScript check still reports pre-existing Cloudflare worker type-resolution errors.
- Added the first repository boundary with a storage-independent JSON repository and reload/replace/corruption tests; the full build plus 16 tests now pass.
- Added effective-rating rules, baseline-v1 scheduling, and append-only ReviewEvent construction; the full build plus 25 tests now pass.
- Connected VNext cards, notes, and repair pool to browser persistence; wired the AI Import drawer to strict preview/acceptance and converted accepted packages into study cards. Production smoke test returned HTTP 200; full build plus 27 tests pass.

## 2026-09-24: Evidence correction and provenance boundary

- Earlier completion wording was too broad: HTTP 200/build/unit tests did not verify browser reload or complete Core gates. Page still mixes content/state and uses display-only due strings; repair spacing, strict Schema execution, objective grading, and repository integration remain unfinished.
- Rating now builds and saves ReviewEvents through page state; this is not yet atomic append-only repository storage or replay evidence.
- Added three provenance regressions, observed all three fail, then enforced independent saved-source matching. Imports without saved originals are blocked; forged chunks/hash are rejected and unrelated saved sources are excluded.
- Source-entry UI is missing; current page imports are intentionally blocked until it is implemented. Do not bypass the gate. Thirty focused tests pass; full system acceptance remains open.
- Added SourceRepository with full-hash IDs, canonical-text deduplication, storage shape checks, non-overwriting corruption errors, and surfaced write failures. Six new tests were observed failing before implementation, then passed with the full 36-test domain suite. Repository reconstruction is tested, not browser reload; source UI remains pending.
- Added source title/text entry to the existing VNext Import drawer. Saved originals are listed and passed into import validation; packages without a matching saved source remain blocked. Production build and all 36 tests pass. Browser interaction/reload acceptance is still pending.
- Repaired SSR/client initialization so SourceRepository is created in browser effects/events, then verified the local production UI: save source → import matching package → new card appears → reload preserves card and saved-source count. Verified Reveal then Remember advances the card; corrected toast to say the effective result is forgotten/repaired when appropriate. Final build and 36 tests pass.
- Added separate per-user LearningStateRepository and append-only ReviewEventRepository with corruption/identity tests. Page rating now persists scheduled `dueAt`, phase, lapses, successful reviews, events, and repair membership. Latest production browser smoke test verified rating then reload preserved the card's review count; full build and 40 tests pass. Submit-before-reveal and server backend remain incomplete.
- Changed the study flow so users must submit a non-empty answer before feedback/rating; Reveal is tracked separately, allowing independent submitted answers to earn `remember`. Latest production browser smoke test observed disabled ratings before submission, feedback after submission, and a successful independent `记住` path. Full build and 40 tests pass.
- Added tested objective grading for single/multiple choice, true/false, and fill-blank; subjective questions remain self-assessed. Page now feeds computed correctness into effective rating. Latest production browser smoke test selected a wrong single-choice option, submitted, clicked `记住`, and observed the forgotten/repair feedback. Full build and 45 tests pass.
- Added multi-select UI state and semicolon answer parsing; production smoke test selected three correct options and earned `记住`. Added a real countdown-based Repair Pool model: wrong/skip waits for two other completed questions, deduplicates, and removes on repair success. Full build and 49 tests pass.
- Added fill-blank token counting and per-blank inputs; production smoke test showed the dedicated field for the existing fill-blank card. Home due count now derives from question learning state and real `dueAt`, including new questions. Full build and 51 tests pass.
- Added real daily question queue ordering (ready repair → due → new) and wired “开始今日复习” to open its first question. Production smoke test confirmed the button opened the queue-selected single-choice question. Full build and 52 tests pass.
- Added automatic queue-session advancement after rating or skipping; the last item closes the modal with a completion toast. Production smoke test completed the first item and observed the next question open automatically. Full build and 53 tests pass.
