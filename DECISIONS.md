# Nous Decisions

## 2026-09-24 — MVP Core boundary

- VNext is the active product surface; the legacy single-page app remains reference-only.
- Content, user learning state, and append-only review evidence are separate models.
- External LLMs remain content compilers; Nous owns the schema, prompt contract, validation, study engine, scheduling, and history.
- Source provenance is called `source-linked`; MVP does not claim semantic proof.
- Browser persistence is acceptable for MVP Core behind repository interfaces.
- Scheduler is transparent `baseline-v1`; FSRS is deferred until the loop is proven.

## 2026-09-24 — Package v0.1

- Unknown question types are hard errors.
- Every question requires at least one source reference with an exact quote found in the referenced chunk.
- Cards are concept containers; questions are the schedulable learning units.
