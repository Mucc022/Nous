---
pmm_schema: pmm.task/v1
task_id: nous-mvp
parent_task_id: none
task_kind: primary
execution_status: active
verification_status: pending
delivery_status: not-requested
owner: nous-mvp-agent
branch: main
base_sha: d2d1bcadabc618a4ad512918ecf9fe86ee516a97
revision: 5
verification_head: none
verification_source_hash: none
verified_at: none
updated_at: 2026-09-29T05:35:06Z
---

# Active Task

Purpose: Single primary task contract, verifier, retry state, and integration checkpoint.
Read when: Starting, executing, verifying, integrating, or recovering this task.
Skip when: The task is unrelated to the current execution context.

## Status

- Title: Nous complete MVP Core and Release
- Runtime Profile: Sprint
- Risk Level: normal
- Loop Budget: 3
- Current Attempt: 1
- Stop Condition: required behavior is verified or a concrete blocker is recorded.

## Task

- Objective: Nous complete MVP Core and Release
- Scope: nous-vnext and project documentation; preserve legacy and current deployment until verified
- Allowed Files or Areas: nous-vnext and project documentation; preserve legacy and current deployment until verified
- Forbidden Actions: unrelated edits, destructive operations, publication, and production writes without explicit authorization.
- Source Artifacts: project instructions, current source, and task request.

## Harness

- Agent Mode: solo
- Owner: nous-mvp-agent
- Branch: main
- Parent Task: none
- Tools: project-local tools and pmm lifecycle helpers.
- Environment Notes: one writer owns this task file and branch.

## Verifier

- Required Checks: domain tests, strict import adversarial tests, TypeScript, lint, build, browser study/reload acceptance, real-course gate, release isolation tests
- Manual Acceptance: task-specific acceptance remains explicit.
- Evidence Needed: fresh command output bound to the current HEAD and source hash.

## Critic

- Pass/Fail: pending
- Missing Evidence: required checks have not completed.
- False-Pass Risk: stale or unrelated evidence must not count.
- Next Action: execute the first unverified acceptance step.

## Repair

- Last Failure: none
- Failure Class: none
- Attempted Fix: none
- Next Concrete Action: Local subfolder creation tested and available on isolated localhost3100 preview; continue user trial. Folder card assignment is not implemented. Core course acceptance and backend release gates remain pending.

## Record

- Verification Evidence: pending after checkpoint
- Delivery Status: not-requested
- Delivery Evidence: pending
- Docs Updated: pending
- Remaining Risk: pending verification.
- Memory Promotion Decision: pending
- Last Updated: 2026-09-24T13:08:44Z
