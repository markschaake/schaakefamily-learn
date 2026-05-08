---
id: plan-01-foundation
name: "Foundation: domain types, problem set, storage, and session reducer"
branch: implement-fractions-practice-mini-app/plan-01-foundation
---

# Foundation: domain types, problem set, storage, and session reducer

## Architecture Context

Per `AGENTS.md`, the `learn.schaakefamily.com` hub is a public, no-auth, no-database, no-API-route Next.js 16 App Router site where each mini-app lives at `app/<slug>/page.tsx` and must be self-contained with no shared state. The fractions tile in `app/page.tsx` currently shows `status: "coming-soon"` and `app/fractions/page.tsx` is a placeholder. This plan ports the source app's pure (non-React) domain layer from `~/projects/markschaake/fractions-practice/src` — problem types/data, validator, session builder, `localStorage` wrapper, answer-check, and session reducer — into private route folders under `app/fractions/`. It introduces no external dependencies, no global state, no analytics, no API routes.

## Implementation

### Overview

Port seven source files into `app/fractions/_lib/` and `app/fractions/_components/session/`. Update internal import paths from the source's `@/lib/...` and `@/components/...` aliases to relative paths inside the mini-app. No JSX is produced in this plan; all files are `.ts`. The validator runs at module-import time via `validateProblemSet(PROBLEMS)` at the bottom of `problem-set.ts`, so `bun run build` fails if any curated problem violates id/numerator/denominator/distractor rules.

### Key Decisions

1. Place ported code under `app/fractions/_lib/` and `app/fractions/_components/session/` (Next.js excludes underscore-prefixed segments from routing). Matches AGENTS.md self-contained rule and the source planning document's chosen layout.
2. Preserve the `fractions-practice:v1:*` `localStorage` namespace verbatim — source contract, target allows `localStorage` for mini-app persistence.
3. Keep the `QuestionType` union duplicated in `progress.ts` exactly as source does; the source comment documents this as an intentional structural-typing decision so the storage module has no peer-import.
4. Keep the validator throwing at module load — preserves the source's build-time data-integrity guarantee.
5. No agent-tuning overrides; this is a mechanical port at standard effort.

## Scope

### In Scope
- Problem domain types (`QuestionType`, `Problem`, `Answer`, `ROTATION_ORDER`, `QUESTION_TYPES`).
- Curated problem set (40 problems: 14 visual-to-fraction, 13 fraction-to-number-line, 13 word-to-visual) with at-load-time validation.
- `buildSession(rng?)` returning a 10-problem rotated session.
- `localStorage` wrapper: `readProgress`, `writeProgress`, `readSettings`, `writeSettings`, plus `STORAGE_PREFIX`, `PROGRESS_KEY`, `SETTINGS_KEY`, `DEFAULT_SETTINGS`, and SSR-safe internals.
- `isCorrect(problem, answer)` answer-check helper.
- Session reducer (`Phase`, `SessionState`, `SessionAction`, `initialState`, `sessionReducer`, `emptyByType`).

### Out of Scope
- Any React component or JSX file.
- The Web Audio chime utility (depends on `'use client'`; ported in plan-02).
- Route files, landing page, home tile updates.
- New dependencies in `package.json`.

## Files

### Create
- `app/fractions/_lib/problems/types.ts` — copy verbatim from `~/projects/markschaake/fractions-practice/src/lib/problems/types.ts`.
- `app/fractions/_lib/problems/problem-set.ts` — copy verbatim from `~/projects/markschaake/fractions-practice/src/lib/problems/problem-set.ts`. Imports `./types` and `./problem-set.validate`. Calls `validateProblemSet(PROBLEMS)` at module bottom.
- `app/fractions/_lib/problems/problem-set.validate.ts` — copy verbatim from source.
- `app/fractions/_lib/problems/session-builder.ts` — copy verbatim. Exports `SESSION_LENGTH = 10` and `buildSession`.
- `app/fractions/_lib/storage/progress.ts` — copy verbatim. Exports `STORAGE_PREFIX = 'fractions-practice:v1:'`, `PROGRESS_KEY`, `SETTINGS_KEY`, `DEFAULT_SETTINGS = { soundEnabled: false }`, `readProgress`, `writeProgress`, `readSettings`, `writeSettings`, plus types `QuestionType`, `PerTypeCounts`, `SessionRecord`, `Settings`.
- `app/fractions/_components/session/answer-check.ts` — copy from source; replace the import `import type { Problem, Answer } from '@/lib/problems/types'` with `import type { Problem, Answer } from '../../_lib/problems/types'`.
- `app/fractions/_components/session/session-reducer.ts` — copy from source; replace `'@/lib/problems/types'` with `'../../_lib/problems/types'` and `'@/lib/storage/progress'` with `'../../_lib/storage/progress'`.

### Modify
- None.

## Verification

- [ ] `bun run lint` exits with status 0.
- [ ] `bun run build` exits with status 0 (this also exercises `validateProblemSet(PROBLEMS)` at module load).
- [ ] `app/fractions/_lib/problems/problem-set.ts` exports a `PROBLEMS` array of length 40.
- [ ] Counting `questionType` values in `PROBLEMS` yields exactly 14 `'visual-to-fraction'`, 13 `'fraction-to-number-line'`, and 13 `'word-to-visual'` entries.
- [ ] `app/fractions/_lib/problems/session-builder.ts` exports `SESSION_LENGTH` equal to `10`.
- [ ] `app/fractions/_lib/storage/progress.ts` exports `STORAGE_PREFIX` equal to the literal string `'fractions-practice:v1:'`.
- [ ] `app/fractions/_lib/storage/progress.ts` exports `DEFAULT_SETTINGS` whose `soundEnabled` is `false`.
- [ ] No file created in this plan contains JSX (`.tsx`); every created file uses the `.ts` extension.
- [ ] No file created in this plan imports from `@/lib/...` or `@/components/...`; all internal imports are relative paths.
- [ ] `package.json` `dependencies` and `devDependencies` are byte-identical to their state at the start of the plan.
