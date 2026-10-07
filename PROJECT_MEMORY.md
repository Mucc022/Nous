# Nous Project Memory

## Current deployment boundary

Backup scope verification: unified journals, immutable packages and scoped notes included; Nous-like auth token key explicitly excluded. Two backup tests pass with controlled storage. Actual download/restore usability not established.

vinext upgrade runtime failure/rollback: beta12 build and tsc passed but Node vinext start3100 failed unsupported cloudflare: protocol; compiled entry contains Workers-specific import/tracing. Rolled back only vinext to beta2 and plugin-rsc0.5.26; retained React19.2.8/Vite8.0.16/Ajv8.18 patches. Rebuilt and restored QA3100 session24807, HTTP200. Audit back to19. Framework vulnerability remains open; need separate Node/Workers build profiles before retry. No live3000 restart.

vinext security patch: checked peers and upgraded vinext beta.2->beta.12 with required plugin-rsc0.5.34. Fresh npm test exit0 (production build +143 tests). npm audit now17 findings (10 high). Existing running server not restarted; browser runtime and TypeScript verification for new framework still pending. No live deployment.

Import preview coverage: computes unique referenced source/chunk pairs vs package chunks, UI explicitly labels non-semantic coverage. Red/green coverage test and eight pipeline tests pass. No automated semantic-verification claim.

Strict event fields: parser rejects unknown keys rather than persisting undeclared data. Red/green unknown-field regression and15 contract/journal/replay tests pass. Historical records with undeclared fields may require explicit recovery; no silent rewrite.

Session endpoint preparation: /api/session GET returns verified sub only after Access JWT validation; otherwise401 authenticated:false; no-store. Three session/crypto tests pass for negative boundary + verifier. Frontend still local-user and real Access configuration pending; no implicit local-to-account migration or authenticated success claim.

Event timestamp contract: requires timezone-bearing ISO datetime, rejecting ambiguous locale/date-only/zone-free values before persistence/replay. Red/green test and nine API/replay tests pass. No historical rewrite; malformed legacy timestamps surface validation errors.

Backup UI: topbar button creates scoped JSON download locally, warns file contains originals/notes, surfaces read failures. No upload/restore mutation. Typecheck passes. Browser download contents/save verification pending; toast says requested download, not guaranteed saved.

Local backup serializer: explicit allowlist of Nous data keys/prefixes, preserves raw values including malformed JSON for recovery; excludes unrelated keys. Red/green test passes. Not yet exposed via UI; no restore or network upload implementation.

Repair corruption containment: initial pool validates shape/countdowns, preserves read error, blocks overwrite effect and study/rating/skip on error, displays alert. Legacy string entries remain supported. Typecheck passes; browser corrupt-store fault test and recovery tooling pending.

Replay conflict verification: same-ID differing valid evidence throws rather than yielding progress; input array/events unchanged. Three replay/service tests pass. This confirms current journal conflict path reused by replay, not new UI recovery behavior.

Baseline replay: replayReviews validates user/event evidence, orders by attempt timestamp, reconstructs state in isolated memory via journal service; preserves repair due, deduplicates retries and rejects foreign user. Red/green integration passes. Does not overwrite live state; UI recovery wiring, equal-timestamp explicit ordering and performance at scale remain open.

Real library tree: removed fixed prototype folder names/counts, derives groups from actual cards and allows folder filtering alongside text search. Empty library guidance shown. Typecheck passes; browser navigation QA pending and other placeholder controls still present.

Removed default demo seeding: new/missing card storage starts empty; original prototype content archived in fixtures/legacy-ui-demo.ts. Existing browser cards untouched, including prior demo records. Typecheck passes. New-user empty-state browser QA and sidebar placeholder cleanup remain pending.

Latest complete engineering verification: npm test exit0 (production build +136 tests) and npm run lint exit0, both polled to terminal completion. This supersedes prior counts only; no Core/Release PASS. Remaining major gates include real-course data, Access OTP/application confirmation/live auth, server content/notes and identity-bound sync, initial-demo removal, complete persistence recovery and remaining dependency advisories.

Independent notes browser acceptance: on imported synthetic QA Retrieval wrote `QA note: recall before looking.`, reloaded, reopened/submitted again and note textarea restored exact text. No rating committed during this check. Verifies note persistence UI path on3100/tab12, not server sync or real-user migration.

Browser persisted evidence verified: latest QA build on3100 (verified old PID57860; session13380) new tab12/historyTab after tab9 expired. Imported QA card became due with real elapsed time. Expanded history shows attemptedAt2026-09-25T00:25:38.897Z, dueAt00:55:38.897Z (+30m), remember/remember, correct, hint0, reveal false, repair false, baseline-v1, content0.1.0, elapsed10935ms. Confirms persisted display after reopening and actual due resurfacing for synthetic card. Notes QA not yet done; no real-course pass.

Visible review evidence: question surface has collapsible history with current dueAt, attempted timestamps, user/effective ratings, correctness, hint/reveal/repair flags, scheduler/content version and elapsed time. Does not reveal prior submitted responses before attempt. Typecheck passes. Browser persisted-due inspection/replay explanation acceptance pending; records currently rendered from journal-loaded React state.

Note error guard: failed note read sets explicit flag, disables textarea and blocks save handler until successful reopen. Prevents writing fallback text over unreadable note. Typecheck passes; browser storage-denial fault injection pending.

Notes UI integration: openCard loads per-user/question note with legacy card.note fallback; updateNote writes only NotesRepository then UI. Subquestion navigation uses openCard so timing/hint/note resets share one path. Typecheck passes; old note fields retained but no longer mutated. Read-error edit disabling/recovery and browser note reload QA pending.

Separate notes repository: plain note strings keyed by unambiguous user/question tuple, tests verify reload, user separation/delimiter collision avoidance and empty save. Two tests pass after missing persistence regression. UI still uses card.note until integration; not server isolation proof.

API body bound: POST parses JSON using incremental byte-counted reader (64KiB default) and returns413 on oversized payloads, without relying on Content-Length. Red/green reader tests plus auth route pass3. Actual authenticated413 integration still pending; no live configuration change.

Quality check: full nonincremental tsc passes. ESLint purity flagged performance.now in openCard/rate/skip/submit functions called only by event handlers; added four line-scoped documented exemptions, not global disabling. Fresh lint exits0. This is explicit false-positive handling, not proof of browser timing correctness.

Backend replay equality: route validates stored event and compares semantic fields, ignoring top-level key order but preserving response array order. Red/green equality regression and route auth test pass2. Actual D1 replay branch still awaiting configured integration.

Server repair parity: POST rejects sessionRepaired without prior scheduled state409; valid repair preserves current state instead of advancing scheduler. Typecheck and seven auth/contract tests pass; authenticated D1 repair-path execution still untested, so this is implementation only. API remains unconfigured/fail-closed.

Review API cache protection: all JSON responses go through no-store + Vary Cookie/Cf-Access-Jwt-Assertion helper. Unauthorized GET/POST regression failed before patch and passes now. Authorized D1 response path still needs live integration validation; no Access activation.

API verifier wiring: GET/POST use authenticateAccessRequest with server env NOUS_ACCESS_ISSUER/AUDIENCE; neither configured here. Actual route tests confirm plaintext spoof headers return401 before DB import. Three route/adapter tests pass. Worker env availability and real Access-issued token acceptance still require deployed integration; no live app enabled.

Access request adapter: authenticateAccessRequest consumes cf-access-jwt-assertion, trusted config guard, cached remote cert resolver and crypto verifier; refuses plaintext identity/missing config/oversized token, key fetch timeout5s. Five config/crypto/request tests pass (negative request cases do not verify live JWKS). API not wired yet; actual policy/OTP confirmation pending.

Cloudflare Access checkpoint: user supplied three exact emails in chat and explicitly confirmed saving/enabling Nous-only restriction. Saved allow policy `Nous email allowlist`, ID `9bf9a491-b025-4182-8a64-113d1ea7c79a`. Application draft `Nous — approved classmates` targets exact `nous.questory.dpdns.org`; application NOT created yet. Team seen: lively-voice-a802, Zero Trust Free. Existing IdP is Cloudflare only; One-time PIN not yet added. Requested separate action-time confirmation to add OTP login provider; awaiting user. Do not duplicate saved policy. App draft tab10/accessTab and provider-add tab11/idpTab were retained; recheck current UI before any action. Do not infer automated goal messages as permission.

Access config guard: accepts only HTTPS single-label cloudflareaccess.com team origins with nonempty audience; derives fixed cert endpoint, rejects credentials/paths/foreign hosts. Red/green config regression and crypto tests pass3. No actual issuer/audience configured; API still fail-closed, remote JWKS integration pending.

Access verifier adversarial coverage: real RSA key tests confirm foreign signing key, wrong issuer, missing exp and unsigned alg=none tokens rejected. Two crypto tests pass. Real Access issuer/audience/JWKS and mailbox policy not configured; no authentication availability claim.

Access JWT verifier preparation: pinned jose6.2.12 and added verifyAccessIdentity using jwtVerify RS256 with required sub/exp/iss/aud and configured issuer/audience. Real locally generated RSA token test passes valid case, wrong audience, expired and malformed rejection after red stub. Not wired to API; remote JWKS/config/Access app allowlist still absent, auth remains fail-closed.

Explanation feedback: import mapping now retains question.explanation; feedback section renders it only when answerVisible after submission/reveal. Typecheck passes. Previously imported lossy cards not backfilled; browser feedback acceptance pending.

Same-page import guard: synchronous ref locks acceptImport before async hashing/storage and releases in finally; confirmation disabled with busy text. Typecheck passes. Does not solve cross-tab writers or edits while an import awaits hashing; broader concurrency acceptance pending.

Import success ordering: accept now explicitly persists merged card index before React update/success toast, so quota errors reach import catch rather than showing false success before effect write. Immutable package may remain as recoverable orphan if index fails; whole import transaction and concurrent import handling remain open. Typecheck passes.

Card corruption containment: page no longer replaces malformed card storage with demo content and writes it back. Initial card snapshot validates outer shape, preserves error, blocks persistence effect/import on read failure and shows alert. Typecheck passes. Deep legacy question validation, browser corruption test and backup recovery UI remain open; initial demo seeding on genuinely empty storage still exists.

Startup journal errors: page reads journal once into data/error snapshot, exposes read failures in role=alert and blocks startToday rather than silently treating empty progress as valid. Typecheck passes. SSR hydration/error banner browser testing and recovery/export workflow remain open; original data not deleted.

Journal retry equality: fixed property-order-sensitive comparison after failing reordered JSON regression. Compare field/value pairs so equivalent events retry safely; changed evidence still conflicts. Six journal/service tests pass.

Card visual state follow-up: gallery badge CSS class and label now both derive from child-state cardStatus, unused legacy stateLabel removed. Typecheck passes. Stored prototype card.state remains only compatibility data, no mastery truth. Browser styling QA pending.

Card status aggregation: cardStatus derives due/new/learning/review from child learning states; page label uses it instead of last rating. Never labels first success mastered. Red/green regression passes. Persisted legacy card.state/CSS class still exist and need presentation cleanup; synthesis due not implemented.

Journal page browser smoke: imported QA Retrieval answered A independently, submitted, Remember succeeded; queue went1->0 and card review0->1. Reload after visible heading retained review1. Verifies visible continuity on unified-service path; direct persisted journal contents/crash behavior not inspected in browser. Card erroneously labels first success mastered (known remaining aggregate-status issue).

Journal rollout QA checkpoint: fresh production build and123 tests pass. Restarted only verified QA3100 listener PID94360; current server session91390. Browser reload after hydration retains imported QA Retrieval card and1 saved source. New journal rating/reload still to exercise; this check alone proves content continuity, not atomic save acceptance.

Page journal activation: rating/skip now call commitJournalReview; startup reads states/events from ReviewJournal (falls back to validated per-user legacy keys when no journal). Removed duplicate unscoped event write effect; no old keys deleted. Full tsc and five journal tests pass. Browser upgrade/reload acceptance pending; cards/notes/repair/outbox still separate writes, so not entire session atomic. Initial read errors still return empty UI and need visible recovery state.

Journal review service: commitJournalReview validates evidence, reads unified/legacy snapshot, handles idempotent/conflicting IDs, schedules or preserves repair due, then commits one journal write. Red/green scheduling/retry test plus journal suite pass5. Page switch and service repair/failure tests still pending.

Journal legacy fallback: absent unified key reads existing per-user repositories, validates combined data, does not write/delete legacy keys. Next journal commit will include prior evidence. Four journal tests pass after fallback regression. Page/service activation and old unscoped review history handling still pending.

Journal validation: shares state validator, rejects duplicate question states/event IDs and malformed state on read/commit. Corruption regression failed then journal/repository suite passed (11 tests). New journal still not active page path; migration and transactional integration remain next.

Single-write journal prototype: ReviewJournal stores states/events together under one key. Two red/green tests prove one setItem and previous snapshot retention when write throws. Not wired to app; migration, full state validation, multi-tab concurrency and actual browser durability still required. Do not claim current page persistence atomic yet.

Post-browser engineering regression: latest production build and complete tests rerun, plus nonincremental tsc passes. Browser confirmed synthetic source save, preview-before-accept, imported choice/reference display, hint latch, locked answers, and dynamic repair return/termination. Still not Core PASS: real-course external-LLM run absent, local transaction/state-content separation/recovery incomplete, auth fail-closed and Access allowlist not configured. D1 provisioned/schema only, not active application persistence.

Browser provenance/choice acceptance: imported QA Retrieval opens as single-choice with A Retrieval/B Copying intact. Expanded source disclosure visibly shows QA synthetic notes, chunk_0001, exact quote and matching original sentence. This verifies post-import display/persistence of refs/options for this synthetic case, not semantic validation or all-type acceptance.

Browser two-step import acceptance: synthetic source from visible generated prompt used to construct one choice question. Preview left QA Retrieval heading count0 while confirm button appeared; confirmation reported1 card; after reload/hydration heading count1 and total cards5. Immediate pre-hydration query returned0, so wait for rendered state before claiming loss. Synthetic local QA, not external-LLM/real-course gate.

Prompt fallback browser verification: rebuilt/restarted only QA3100 (verified old PID72416; new session47816). Copy action creates read-only textarea; DOM read confirmed6743 characters containing saved synthetic source and additionalProperties schema. Clipboard transfer itself still unverified. Tab9 retained; no external model transmission.

Clipboard fallback: generated source-bound prompt now appears in read-only selectable textarea after generation, before clipboard attempt; user can inspect/copy manually if clipboard unavailable. Typecheck passes. Empty clipboard readback root cause still unresolved; browser manual-copy verification pending. No external data transfer.

Browser source/prompt QA on port3100: saved synthetic text titled QA synthetic notes; UI shows1 source and save confirmation. Copy Prompt shows success, but browser clipboard readText returned empty string (length0). Do NOT mark clipboard contents verified; could be browser clipboard API isolation or write issue and requires diagnosis. Tab9 retained with source saved; no external model transmission.

Mobile post-fix verification: old3100 process still served old assets after build. Verified listener PID88912 command was this project's vinext start --port3100, stopped only it and restarted session16872. Fresh browser reload tab9 shows AI Import and Save Source controls in narrow layout. Current port3000/live route untouched. Continue with server16872, not old95660.

Mobile import fix: browser narrow viewport omitted AI Import/Save Source due to global quiet-button display:none. Added targeted mobile overrides and constrained import drawer to viewport with vertical scrolling. Fresh production build passes; latest CSS browser verification pending. Existing3100 server may need refresh/restart before testing new build.

Browser repair completion: answered returned single-choice correctly and rated Remember on port3100/tab9. Modal closed, queue count became0, card displayed learning rather than mastered, completion toast shown. This proves UI session termination after inserted repair. Original due equality is supported by integration test only, not yet inspected from browser persisted state; history/due UI still needed. Demo content only, not real-course acceptance.

Browser dynamic repair evidence: on isolated3100, prior wrong single-choice waited while short-answer, fill-blank and multi-choice were completed. After final ordinary item, original single-choice automatically reappeared as next question and queue count=1. Confirms insertion in actual UI; repair rating/preserved due inspection still pending. Tab9 retained at repair question.

Browser hint regression: isolated port3100 demo short answer -> show hint (text observed) -> hide -> type response -> submit (textarea disabled) -> Remember yielded fuzzy toast and learning state. This confirms hint latch survives hiding in real UI, not just domain tests. Tab9 retained, no real course acceptance.

Browser QA continuation on port3100/tab9: clicked Remember after wrong B submitted. UI explicitly showed forgotten/repair toast; queue count fell 5->4, card review count 3->4. Reload returned count4 and review4, confirming this UI state survives refresh. Does not independently prove stored event contents or full repair reappearance; those remain pending. Tab retained; server session95660 reuse after checking live status.

Browser QA checkpoint: built latest app and started isolated local port 3100 (exec session 95660). IAB tab 9/qaTab opened demo single choice, selected wrong B, submitted; fresh AX confirms all four options disabled and ratings enabled. Tab marked handoff; no rating submitted yet. This verifies submit locking only, not full import/course acceptance. Preserve/recheck live server handle on continuation; do not touch port 3000.

File adapter negative-path verification: real File objects above 2MB and malformed UTF-8 bytes are rejected. Four file tests pass. This confirms current safeguards only; no claim of browser upload UI acceptance or support for other encodings.

Content persistence page wiring: confirmed import now awaits immutable ContentRepository.save before mapping cards; storage failure stays inside import error boundary. Full typecheck and nine repository/import/identity tests pass. Card index persistence still separate, so whole import is not transactional; recovery/index reconstruction pending.

Immutable content repository: ContentRepository stores full validated package snapshots under content-derived IDs; changed content/version creates another key, original preserved. Red/green reconstruction/version test passes. Source provenance still requires import service; repository validates shape/semantics only. Page wiring/indexing and transactional combined import pending.

Package namespace integration: acceptImport computes canonical packageId and prefixes new card/question IDs, preventing repeated LLM q1/c1 IDs across distinct packages from sharing progress. Reimport filters out existing matching cards instead of resetting notes/progress. Old IDs untouched; old-vs-new same-content duplicates possible until explicit migration. Typecheck passes; browser identity/reimport acceptance pending.

Package identity helper: canonical JSON key ordering plus SHA256 yields stable content package ID; changed content changes ID. Red/green regression passes. Not yet wired to page/import repository, so cross-package collisions remain open until integration.

Live queue count: homepage count uses same buildDailyQuestionQueue as start, including eligible repairs and excluding waiting repairs. Timer refreshes at 30 seconds and focus; cleanup removes timer/listener. Labels now say questions not cards. Typecheck and seven queue/repair tests pass; browser timer/focus verification pending.

Removed fixed daily 12/+4 metric. Page now uses tested countDailyReviews over local calendar day; labeled learning records including skips/repairs. Red/green date count test passes. Other prototype labels and duplicate legacy event storage still require cleanup; no analytics completion claim.

Import acceptance freshness: confirmation now re-reads SourceRepository and executes importPackage against current originals inside the error boundary, rather than cached React sources. Preview and accept both use authoritative saved sources. Typecheck passes; end-to-end browser import confirmation remains pending.

Import confirmation UI: previewOnly validates against fresh saved originals and reports card/question/source counts or detailed errors. Confirmation button requires exact previewed JSON match; preview does not mutate cards; successful import resets approval. Typecheck passes. Source revalidation on accept still uses current React source list and should be aligned to repository; browser acceptance pending.

Import error fidelity: malformed collection shapes now return original Schema diagnostics before provenance/count access, avoiding TypeError -> misleading JSON parse error. Regression failed then seven import tests pass. Error categories should eventually be explicit codes rather than message prefix detection.

Source file UI: import drawer now offers labeled .txt/.md picker; local decoded text/title populate editable fields and require explicit Save Source. No network upload. Typecheck passes; browser file selection/race handling and visual QA pending.

Source file adapter: readSourceFile supports UTF-8 .txt/.md with case-insensitive extension, rejects empty/unsupported and >2MB files, fatal UTF-8 decoding avoids silent replacement. Two red/green tests pass for supported/unsupported/empty. UI picker integration and limit/encoding test coverage pending.

Content version propagation: new imported cards retain package.contentVersion, rating and skip events use it. Old/demo cards explicitly use legacy-unversioned instead of fabricated 0.1.0. Full typecheck passes. Existing event history unchanged; immutable content package/version repository and migration remain incomplete.

Response snapshot regression: buildReviewEvent copies answer arrays, so mutating original UI/input array cannot change event evidence. Observed failing test before fix; 11 event/service tests pass. Persisted append-only validation still handled by repository; full UI acceptance pending.

Skip evidence wiring: page skip commits skipped/forgot event and delayed due through service before advancing repair/session; failures keep current question. Sync attempted independently. Typecheck and focused skip persistence test pass; browser skip/repair flow still pending.

Attempt evidence: new page events include frozen response text/array. Event parser validates optional response shape for backward compatibility. Retry/conflict/ack comparisons now compare serialized field values so arrays survive roundtrips. Twenty-six focused API/service/client/outbox tests pass; historical events not backfilled and browser verification pending.

Response timing wiring: monotonic performance.now starts on opening/navigation/new attempt; elapsed snapshot freezes at submission and populates ReviewEvent.responseTimeMs. Feedback-reading time excluded. Typecheck passes; timing browser verification pending.

Answer structure preservation: imported cards retain original answerValue arrays while display answer stays text; submitted multi-choice/blank snapshots retain copied arrays. Grader consumes original structure rather than delimiter roundtrip. Typecheck passes; old lossy imports unchanged and browser validation pending.

Seven-type integration evidence: synthetic source-backed package passes real import/source validation with seven types; objective grading returns true for reference responses, subjective types null, choices retained. Integration test passes. This is happy-path contract integration only, not UI/real-course or semantic support verification.

Schema contract parity: exported JSON Schema now independently requires choice options and enforces single-string vs unique multi-answer arrays; generic answer no longer unconstrained. Standalone Ajv regression failed then passed with validator suite (14 tests). Cross-field answer membership/blank token counts remain semantic checks.

Choice import wiring: domain/schema now accept choices arrays; semantic validation requires distinct nonempty options, answer membership and no repeated correct answers. Page preserves choices for imported single/multiple choice. Red/green regression verified with 13 validator tests. Full typecheck/browser seven-type acceptance still pending for this increment.

Seven-type UI mapping: newly imported true_false/explanation/analysis retain their own labels/domain mapping rather than becoming short_answer. True/false gets correct/incorrect choices and objective grader. Typecheck passes. Imported single/multiple-choice option schema still missing; seven-type end-to-end acceptance not complete.

Source provenance UI: new imported questions retain sourceRefs in persisted cards; source disclosure resolves saved title/chunk and renders exact quote plus original chunk. Legacy/demo cards explicitly show no saved reference instead of implying source linkage. Full typecheck passes. Browser visual/mobile QA and migration of previously lossy imports remain open; no existing card data rewritten.

Persistence fault evidence: injected event-key write failure after existing-state update; service threw, restored exact prior state and appended no evidence. Seven service tests pass. This verifies recoverable synchronous failure only; process crash or rollback failure remains non-atomic and must not be claimed safe.

Save error UI: rating now catches local commit errors and retains submitted response/current question. Outbox enqueue/flush errors no longer abort already-saved UI progression and explicitly distinguish local save from sync failure. Full tsc passes. Quota/corruption browser fault injection and atomic persistence remain open.

Multi-blank submission gate: tested hasCompleteBlankResponse rejects missing/empty positions; wired into page submit before frozen response creation. Three focused tests pass after red/green verification. Browser interaction still pending.

Submitted input UX: choice buttons, blank fields and free-answer textarea are disabled after submission; event handlers guard against changes too. Removed nested setAnswer inside state updater callbacks for multi-select/blanks. Full tsc passes; browser keyboard/mouse verification pending.

Page attempt evidence: submission now snapshots response; rating requires submitted snapshot and grades that instead of mutable input. Hint usage is latched independently of visibility and reset on question/new attempt. Typecheck passes; browser regressions still needed. UI inputs remain visually editable after submission, but no longer change scored response.

Cross-module repair evidence: real domain/repository integration test exercises wrong event -> two intervening queue advances -> repair reinsert -> repair event -> reconstructed repository with unchanged 30-minute due/level/success count and two events. Passes. Uses in-memory StorageLike, not browser reload or real course material; those acceptance gates remain open.

Dynamic repair page integration: continueSession now consumes remaining queue and appends ready repairs using freshly computed repair state, rather than fixed original queue. Closing clears session and waiting repairs prevent false completion toast. Removed delayed open timer. Full tsc passes; browser end-to-end repair acceptance remains pending.

Dynamic repair helper: appendReadyRepairs appends eligible repair questions after remaining session work, avoids duplicates and ignores removed content. Red/green insertion regression verified; two tests pass. Page integration remains next; do not claim repairs actually reappear in active UI until wired and browser-tested.

Repair page wiring: successful ready-repair attempts with existing dueAt now carry sessionRepaired into commitReview; card display stays learning and toast explicitly states original due unchanged. Full tsc and nine service/repair tests pass; actual UI repair-loop verification remains pending. Missing-state skipped repairs and dynamic session insertion still need completion.

Event identity correction: reproduced delimiter ambiguity (`a:b`/`c` vs `a`/`b:c`) in FNV event IDs. New IDs use versioned lossless encoding of the user/question/attemptedAt tuple; no short-hash collisions and retries stay deterministic. Nine focused event/service tests pass. Existing event IDs remain unchanged. Same-question attempts sharing an identical timestamp still need explicit attempt IDs in the future session model.

Outbox concurrency: overlapping flush calls for the same StorageLike object now share one promise; lock releases on success/failure. Regression reproduced duplicate sends then passed (5 outbox tests). This is same-page protection only, not multi-tab synchronization or cross-device conflict resolution.

Full regression checkpoint: fresh npm test completed with successful production build and 97/97 tests; full nonincremental tsc exited 0; lint session 24032 completed exit 0 (not inferred from initial empty output). These are engineering checks, not Core/Release acceptance. Still open: typed question UI/contracts, frozen attempts/hint history, dynamic repair integration, transactional local save/recovery, actual verified auth/Access policy, remote sync integration and real-course acceptance.

Evidence read validation: ReviewEventRepository now validates each stored/appended event against event shape, owner and rating consistency. Malformed/foreign entries are rejected without rewriting original storage. Observed failing regression then passing 14 focused tests. Legacy inconsistent records may require explicit recovery; UI error handling remains required.

Question import checks: semantic validation now blocks fill-blank packages without matching nonempty answer slots and unrecognized true/false answers. Two regressions reproduced acceptance before fix; 18 validator/import tests pass. JSON Schema's type-specific structures and UI true/false handling still incomplete, so this is not full seven-type acceptance.

Scheduler guard: rejects invalid clocks, unsafe/negative counters, out-of-range review levels, unknown phase/rating. Regression failed before implementation; 14 scheduler/review service tests pass after patch. This does not resolve pending repair-mode UI wiring or full scheduler replay.

Prompt clipboard wiring: page now builds prompt from a fresh SourceRepository read, includes saved originals and schema, awaits clipboard success, and surfaces no-source/storage/clipboard failures instead of false success. No automatic external model transfer. Full typecheck, production build and 93 tests pass; actual clipboard interaction remains unverified.

Prompt contract increment: buildImportPrompt exports saved originals with exact identifiers/chunks plus current JSON Schema and source-only/quote rules; refuses empty sources. Two tests failed then passed. Not yet wired to page clipboard; seven-type schema is still incomplete, so generator follows current format rather than claiming the final contract complete.

Vite patch checkpoint: confirmed Node/plugin peer compatibility and pinned Vite 8.0.16 (same minor line) to address audited Windows filesystem/UNC issues. Fresh npm test passes production build and 91 tests. npm audit count now 19 (12 high). No live server restarted; browser runtime verification and remaining dependencies still open.

React security patch: confirmed peer dependencies, pinned react/react-dom/react-server-dom-webpack together to 19.2.8, addressing RSC DoS GHSA-wx67-qw84-cm4g. Fresh production build and 91 tests pass. npm audit now reports 22 findings (15 high); browser regression and remaining framework/toolchain patches remain open. No server restart/deployment.

Dependency patch: pinned Ajv 8.18.0 to address GHSA-2g4f-4pwh-qvx6. npm audit count fell from 24 to 23; high advisories remain. Fresh full TypeScript check and 16 validator/import tests pass. No framework upgrade or live deployment performed.

Dependency triage: npm audit reports 24 advisories (16 high, 7 moderate, 1 low). Runtime-relevant packages include react-server-dom-webpack 19.2.6 (DoS, fixed >=19.2.8) and vinext beta.2 (image-size dependency); Vite Windows filesystem issues and Wrangler/miniflare/undici/ws also need upgrades. Ajv <=8.17.1 advisory requires $data (not enabled here), but should still move >=8.18.0. Do not dismiss packages as safe solely because listed in devDependencies: vinext is the production server. npm suggests a breaking downgrade for drizzle-kit, so do not run audit fix --force. Plan scoped compatibility-tested upgrades before release; no upgrades or remote writes performed in triage.

Typecheck checkpoint: full tsc initially found four errors (missing Cloudflare runtime types and excess properties in a queue test). Installed official workers-types, declared optional DB binding, and corrected the QueueItem fixture shape. Fresh `tsc --noEmit --incremental false` passes. Optional DB typing does not configure/bind D1. Dependency audit still reports 24 vulnerabilities; no automatic force upgrades applied.

Append-only repository correction: direct ReviewEventRepository.append now rejects conflicting duplicate event IDs, preserving original evidence. Identical retries remain idempotent. Regression observed failing before implementation; 13 learning/review-service tests pass. Full stored-event validation, atomic commit and UI error recovery remain open.

Learning repository boundary: foreign-user stored records, negative counters and invalid due dates are rejected rather than read/overwritten. Two observed failing regressions now pass with review-service suite (12 focused tests). This is local integrity validation, not server authentication or browser sandbox security.

Source chunk bound: long paragraphs now split at maxChars without cutting UTF-16 surrogate pairs; invalid chunk limits rejected. Red/green long-paragraph regression and source repository suite pass (11 tests). Existing saved sources are not rechunked. Full original reconstruction across paragraph separators and versioned chunk policy remain open; do not claim universal lossless reconstruction.

API evidence consistency: parsing now rejects user-provided effectiveRating that contradicts wrong/skipped/revealed/hinted attempts or user rating. Observed failing regression before implementation; five API-contract tests pass. This only verifies consistency of reported evidence, not server-side grading against authoritative content, which remains required.

Package identity validation: duplicate cardId, questionId (across all cards), sourceId and per-source chunkId now block validation. Regression failed before implementation and all ten validator tests then passed. Cross-package identity/version namespacing and complete typed question schemas remain unfinished.

Remote read shape gate now requires both states/events arrays; malformed success payloads report unavailable rather than an empty history. Eight focused client tests pass after observed regression failure. Actual record validation and account-bound merge remain incomplete. User selected Access email whitelist but has not supplied emails; do not change policy yet.

Repair validation follow-up: parser rejects nonboolean sessionRepaired and contradiction with wrong/skipped/reveal/forgotten evidence; local service negative-path tests verify no history or state mutation. Ten focused tests pass. API remains fail-closed for authentication; this is validation, not complete backend repair implementation.

Session repair service increment: ReviewEvent optionally carries sessionRepaired; commitReview records a successful repair without modifying the prior dueAt, phase, review level or successful-review count. Previously observed failing regression now passes. UI must still classify repair attempts and API must implement equivalent semantics before end-to-end acceptance. Cloudflare Access/WeChat question was informational; no access policy changed and no whitelist emails supplied.

Sync acknowledgement correction: HTTP success alone no longer clears pending evidence. Client requires returned event fields to match the submitted event. Red/green regression covers empty/null responses, HTML login pages, foreign-user acknowledgements and changed ratings. This protects against false acknowledgements but does not establish actual remote sync or authenticated sessions.

2026-09-25 remote migration applied under explicit user authorization: rechecked `nous-mvp` had only Cloudflare internal `_cf_KV`, then executed `drizzle/0000_whole_alex_power.sql` with Wrangler against database `5c152587-02bb-496b-b12a-36d2a79f486e`. Nine statements succeeded. Post-check verified sources/content_packages/learning_states/review_events all exist and have zero records. Do not rerun initial CREATE migration. No API binding, user data transfer or domain changes. API authentication still fails closed; actual login and Core acceptance remain unfinished.

Local migration verification: executed the generated SQL in Node's real in-memory SQLite, verified all four empty tables are queryable, user/question uniqueness rejects duplicates, and two users can hold different states for the same question. This is SQL-constraint evidence only, not D1 runtime, authentication or API isolation acceptance. Remote database remains untouched/empty.

2026-09-25 authorized D1 provisioning: Wrangler OAuth login completed successfully; initial D1 list was empty. Created `nous-mvp` in APAC, database ID `5c152587-02bb-496b-b12a-36d2a79f486e`. This is a new empty database only: no migration applied, Worker binding configured, domain changed, browser data uploaded, or API access enabled. Authentication remains fail-closed. Creation succeeded; reuse this ID and do not create a duplicate.

Outbox integrity: two red/green regressions now protect corrupt JSON from overwrite and reject conflicting same-ID evidence. listReviewOutbox throws instead of silently returning an empty queue. UI error handling for these exceptions and complete stored-event validation remain required; do not claim full sync reliability.

Security correction: caller-supplied `oai-authenticated-user-id` is not authentication on the user's Node/Tunnel hosting. A regression reproduced arbitrary user impersonation. resolveUserId now fails closed (null) until a real server-verified session/JWT adapter is implemented; both remote methods therefore reject requests. This is a containment measure, NOT completed auth. Earlier “authenticated” smoke requests merely injected headers and proved no identity security. D1 authorization does not justify deploying this unfinished login flow. Local learning remains available.

User explicitly authorized D1/backend deployment. Wrangler whoami reports not authenticated; user login is required before remote operations. This does not block unfinished local Core work. Added a malformed-collection regression that reproduced a TypeError after Schema failure; validator now returns immediately on structural rejection, preserving schema diagnostics instead of crashing. No cloud resources changed.

## Review service checkpoint

Grading correction: five new regressions were observed failing, then fixed: fill-blank order is positional, empty slots cannot collapse, unrecognized boolean values cannot both map to a correct null comparison, single-answer questions reject multiple values, and commas inside answers are preserved. Domain suite now has 62 passing tests. This does not establish full question-contract/UI correctness; structured blanks/options and frozen submitted evidence remain required.

Repair queue correction: a waiting repair entry is now explicitly excluded from the daily queue even if its learning state is `new`; it cannot bypass the two-other-question interval. Regression observed and fixed. Domain suite now has 63 passing tests and lint passes.

Schema gate increment: Ajv 2020 now executes `schema/nous-package-v0.1.schema.json` before semantic/source checks. Unknown package properties and malformed source chunks are covered by new regressions. Full build and domain suite now pass 65 tests. A fresh lint run is now clean after removing unused imports and reconciling the existing page rules.

Backend contract increment: replaced the empty Drizzle schema with four D1 tables—`sources`, `content_packages`, `learning_states`, and `review_events`—keeping content, per-user state, and evidence separate. Generated `drizzle/0000_whole_alex_power.sql` locally. No D1 binding was configured and no remote database was touched; API wiring, auth isolation, migration apply, and deployment remain open.

API increment: added `/api/reviews` POST. It resolves only the platform identity header, validates ReviewEvent shape and user ownership, returns 401/400 before DB access, returns 503 when D1 is not configured, and handles duplicate/conflicting event IDs. Successful D1 writes are currently sequential (not crash-atomic) and the page still uses browser storage; API is not production-enabled. Build and domain suite now pass 68 tests. Lint currently reports six page effect/accessibility rules after the route addition; no green lint claim.

Quality/API follow-up: page accessibility/effect lint errors were fixed without changing learning behavior. The production build includes `/api/reviews`; the domain suite remains 68/68 and ESLint is clean. D1 is still unconfigured, and the API's two writes remain non-atomic; no deployment or production data mutation occurred.

API transaction follow-up: `/api/reviews` now submits the event insert and learning-state upsert through Drizzle D1 `batch`, giving the two writes one D1 batch boundary. Idempotency/conflict handling remains before the batch. The client still uses local storage and no D1 binding is configured; deployment and real-backend acceptance remain open.

Remote sync preparation: added a tested `syncReviewEvent` client and wired it as a safe asynchronous companion to local commit. 201/200 reports sync, 401/400/409 reports rejection, and 503/network failures fall back silently to local state. This does not enable remote persistence until D1/auth are configured. Build, 72 tests, and lint pass.

API smoke correction: local production smoke initially exposed a top-level `cloudflare:workers` import that caused 500 before auth handling. Moved DB loading behind the authenticated branch. Fresh local smoke now proves unauthenticated POST returns 401 and authenticated POST without D1 returns 503. Build and 72 tests remain green.

Offline sync increment: added a browser ReviewEvent outbox. Events are deduplicated locally, flushed on startup and after each rating, and removed only after a server 200/201 confirmation; unavailable/rejected responses remain local. Full build, 74 tests, and lint pass. D1/auth/deployment remain unconfigured.

Backend read increment: `/api/reviews` now also supports authenticated GET, returning only that user's learning states and review events; 401/503 behavior is explicit. `loadRemoteReviews` has safe fallback tests. Full build, 76 tests, and lint pass. The page remains local-first until Release authorization/configuration.

Final local API smoke: production server returned GET unauthenticated 401, POST unauthenticated 401, GET authenticated-without-D1 503, and POST authenticated-invalid-body 400. No 500s or remote writes occurred.

Page ratings now call commitReview, which reads persisted learning state, schedules it, and appends an event. Duplicate-event retry and conflicting same-ID evidence tests were observed failing before the fix. Exact retries now preserve progress; conflicting evidence is rejected before writes. This service uses two writes with best-effort rollback, NOT a crash-safe atomic transaction. Still required: atomic evidence/state storage, UI error recovery, immutable submitted attempts, dynamic repair-session insertion and non-advancing repair scheduling, complete schema/type contracts, true course acceptance, Release backend and deployment. Prior green tests prove only their covered slices, not full MVP completion.

## Current state

VNext has a polished but demo-backed UI in `nous-vnext/app/page.tsx`. It uses `initialCards` and React state, so it is not yet the real product loop. The legacy root app is preserved.

## Active engineering line

Implement MVP Core in order: contract, domain/schema/validator, source store, import pipeline, repository persistence, study engine, effective rating, repair pool, baseline scheduler, and real daily queue.

Current implementation is partial, not accepted MVP gates. Domain helpers and browser persistence wiring exist, but Schema is not yet executed by the validator and per-type constraints remain incomplete. Content and personal state are still mixed in the page's legacy-shaped cards. Scheduling helpers are not wired to real due timestamps. Repair only deduplicates IDs; spacing and non-advancement are not implemented. ReviewEvent construction is wired to rating, but atomic persistence, response timing, full evidence and replay remain incomplete.

Latest security correction: import now requires independent saved sources and rejects changed source hashes/chunks instead of trusting or silently replacing LLM-provided originals. Three regression tests reproduced and then passed this boundary. The UI currently has no saved-source input, so import is intentionally blocked until Source Store UI is connected. Do not remove this gate to make the UI appear functional.

Next: Source Store persistence/entry and prompt contract; strict schema execution and seven complete question types; separate content/state/events repository; full study session and real due scheduling; browser reload verification. Existing build/unit tests do not prove browser persistence, append-only events, real source acceptance, or deployment.

Source repository increment: `SourceRepository` now persists canonical originals through StorageLike, assigns full SHA-256-based source IDs, deduplicates equivalent text, preserves original titles, and reports malformed storage/write failures without overwriting it. Six tests verified repository reconstruction, deduplication, same-tab concurrent adds, corruption, wrong shape, and quota failures (36 domain tests total). Multi-tab coordination and browser UI integration are not yet verified. Next concrete action is to connect source entry and prompt generation to this repository, retaining the independent-source import gate.

Source entry is now present in the VNext import drawer: title + pasted text are saved to `SourceRepository`, saved source count is shown, and import passes the saved source list into strict provenance validation. The page build and 36-test suite pass. Browser interaction/reload acceptance still needs a real UI run; source import intentionally cannot accept a package until the source is saved first.

Browser acceptance evidence (local production build): saved `Notes` source, imported a matching source-linked package, saw the new `Retrieval` card, reloaded, and confirmed both the card and `已保存 1 份原文` remained. A Reveal → 记住 interaction advanced the card and persisted its review count; the user-facing toast was corrected to report the effective rating when Reveal makes the result `forgot`.

Learning-state increment: `LearningStateRepository` stores per-user state separately from content, and `ReviewEventRepository` appends deduplicated evidence. The page rating action now calculates baseline-v1 `dueAt`, writes state and event, updates repair membership, and reloads state on startup. Latest browser smoke test showed the imported card at review 1, performed Reveal → 记住, observed the effective forgotten/repaired feedback, reloaded, and observed review 2. Full suite is 40 tests; server-backed persistence and independent submit-before-reveal are still open.

Study-flow increment: the page now requires a non-empty answer submission before feedback/ratings; user Reveal is tracked separately from feedback visibility. Browser smoke test confirmed the unanswered state shows `提交回答` with disabled ratings, submission reveals feedback and enables ratings, and an independent submitted answer can be rated `记住`. Full build and 40 tests pass.

Objective grading increment: `gradeResponse` now evaluates normalized single choice, order-independent multiple choice, true/false, and all-blank fill-in responses; subjective types remain self-assessed. Page ratings use the computed correctness, so a wrong objective answer cannot be upgraded by clicking `记住`. Production browser smoke test confirmed a wrong single-choice answer produced the forgotten/repair result. Full build and 45 tests pass.

Input/repair increment: multiple-choice cards now support toggling multiple options in the study UI, and semicolon-delimited expected answers are parsed as sets. Repair entries now carry `remainingReviews`; wrong/skip entries wait for two other completed questions before becoming ready, and successful completion removes them. Production smoke test selected three correct multiple-choice options and received the remember result. Full build and 49 tests pass.

Queue/input increment: fill-blank prompts now render one input per underscore/named blank and join answers for full-blank grading. The home due count now derives from per-question learning state (`new` or `dueAt <= now`) instead of card display labels. Production smoke test showed a dedicated fill-blank field; full build and 51 tests pass.

Daily queue increment: `buildDailyQuestionQueue` now orders ready repair questions before due questions before new questions. The home “开始今日复习” action opens the exact first queue item and displays a question count derived from real learning state. Production smoke test clicked the button and opened the due single-choice question; full build and 52 tests pass.

Session increment: a queue started from the home action now advances automatically after rating or skipping a question, then closes and announces completion at the last item. Production smoke test completed the first single-choice question and observed the next short-answer question open automatically. Full build and 53 tests pass.

## Working rules

- Keep UI redesign and legacy migration out of MVP Core.
- Prefer small testable modules and repository boundaries.
- Do not claim completion without focused tests and a real-course acceptance run.
