# Nous MVP Core Implementation Plan

> **For agentic workers:** Implement task-by-task with test-first changes and verify each task before proceeding.

**Goal:** Turn the VNext prototype into a source-linked, persistent learning system while preserving its existing visual surface.

**Architecture:** Immutable content is stored separately from per-user learning state and append-only review events. A repository boundary keeps browser persistence replaceable by a server backend later. Import validation is strict and source-aware before content can enter a deck.

**Tech Stack:** TypeScript, React/Vinext, JSON Schema validation with a small dependency-free validator, Node test runner, browser storage adapter.

**Spec:** `MVP_PLAN.md`, `DECISIONS.md`

## Global Constraints

- `nous-package-v0.1` supports only the seven frozen question types.
- Missing or invalid source references block import.
- Existing UI and legacy app remain intact until the real loop replaces their data source.
- Do not add built-in AI APIs, FSRS, or multi-user backend in MVP Core.

### Task 1: Formal content contract

Create focused domain types, the JSON Schema, validator, valid/invalid fixtures, and tests for required fields, question-type constraints, and source references.

### Task 2: Canonical source store

Add normalization, SHA-256 identity, deterministic chunking, and a source repository with tests for stable hashes and exact quote lookup.

### Task 3: Import pipeline

Connect JSON parsing, schema validation, and source-reference validation into a previewable import service with hard-error behavior.

### Task 4: Persistence repositories

Define content, learning-state, and review-event repository interfaces and a browser storage implementation with reload tests.

### Task 5: Study and scheduling engine

Implement attempt/hint/submit/reveal/grade/rating transitions, effective-rating rules, repair queue behavior, baseline-v1 intervals, and daily due selection.

### Task 6: VNext integration and acceptance

Replace demo data access incrementally, run the full automated suite, then perform the real-course acceptance checklist before beginning account/server work.
