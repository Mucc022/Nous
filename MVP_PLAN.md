# Nous MVP Plan

## Frozen Definition

Nous MVP Core is complete when one real source document can be source-linked, imported as a validated `nous-package-v0.1`, studied, graded, repaired, scheduled, persisted, and resumed after reopening the site.

## Scope

- In scope: source-linked content, strict package validation, separated content/learning/review-event models, browser persistence, baseline scheduler, repair queue, and the existing VNext study UI.
- Out of scope until MVP Core passes: built-in AI APIs, FSRS, semantic verification, automatic course crawlers, matching/ordering/output tasks, analytics, gamification, legacy migration, and multi-user backend.
- MVP Release follows Core: authentication, server persistence, per-user isolation, and public deployment hardening.

## Frozen Content Types

`single_choice`, `multiple_choice`, `true_false`, `fill_blank`, `short_answer`, `explanation`, `analysis`.

## Frozen Rating Rules

- Wrong objective answer is `forgot`.
- Full answer reveal is `forgot`.
- Substantive hint followed by a correct answer is at most `fuzzy`.
- Only independent success without a substantive hint can be `remember`.

## Delivery Gates

1. `NOUS-MVP-000`: contract and decisions documented.
2. `NOUS-MVP-001`: domain types, JSON Schema, validator, and fixtures.
3. `NOUS-MVP-002`: canonical source store.
4. `NOUS-MVP-003`: real import pipeline.
5. `NOUS-MVP-004`: repository-backed persistence.
6. `NOUS-MVP-005`–`009`: study engine, effective rating, repair, scheduler, and daily queue.
7. Real-course acceptance run before Release work.
