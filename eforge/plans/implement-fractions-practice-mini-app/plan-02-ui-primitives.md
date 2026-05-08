---
id: plan-02-ui-primitives
name: "UI primitives: representations, feedback, rule-panel, and chime"
branch: implement-fractions-practice-mini-app/plan-02-ui-primitives
---

# UI primitives: representations, feedback, rule-panel, and chime

## Architecture Context

Depends on `plan-01-foundation` for problem-domain types and the `localStorage` wrapper. This plan ports the visual primitives from the source app — `VisualFraction`, `NumberLine`, `DivisionFraction`, `WordFraction`, `AnswerFeedback`, `RulePanel` — plus the `playChime` utility, adapted for Tailwind v4 and the hub's slate/dark color scheme. Per AGENTS.md, no new dependencies are added: `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, `tailwind-merge`, and `clsx` are all replaced. Source files use Tailwind v3 custom tokens (`bg-bg`, `text-ink`, `bg-accent`, `bg-correct`, `bg-incorrect`, `border-ink`) and `var(--color-ink)` SVG strokes; these are translated to existing Tailwind v4 utility classes (slate / emerald / amber families) and `currentColor` strokes.

## Implementation

### Overview

Port and adapt the source files listed below into private folders under `app/fractions/_components/`. Replace every source `Button` import (from `@/components/ui/button`) with a native `<button>` element styled with Tailwind utility classes that match the hub's slate-based button styling (mirroring the back-home button pattern in the existing `app/fractions/page.tsx` and the tile pattern in `components/MiniAppTile.tsx`). Replace `lucide-react` icon usage in `AnswerFeedback.tsx` (`Check`, `AlertCircle`) with text glyphs (`'✓'` for correct, `'!'` for retry) wrapped in `<span aria-hidden="true">`. Replace `var(--color-ink)` SVG strokes with `stroke="currentColor"` and a parent text-color utility class so SVGs track the theme.

### Key Decisions

1. Replace `lucide-react` icons with text glyphs; do not add the dependency.
2. Apply this Tailwind token translation table consistently across all files in this plan:
   - `text-ink` → `text-slate-900 dark:text-slate-100`
   - `bg-bg` → `bg-white dark:bg-slate-950`
   - `border-ink` → `border-slate-400 dark:border-slate-600`
   - `bg-accent` → `bg-emerald-600` (with `text-white` for foreground over accent)
   - `text-bg` (foreground over accent) → `text-white`
   - `bg-correct/10 text-correct` → `bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100`
   - `bg-incorrect/10 text-incorrect` → `bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100`
3. Replace `stroke="var(--color-ink)"` (and any other `var(--color-ink)` references) with `stroke="currentColor"`; ensure the parent `<svg>` or wrapper carries `text-slate-900 dark:text-slate-100`.
4. Preserve the source's `'use client'` directives where present (every file in this plan that has the directive in source keeps it).
5. `chime.ts` imports `readSettings` from the storage module created in plan-01; gate playback behind `readSettings().soundEnabled` (off by default per `DEFAULT_SETTINGS`).
6. Do not modify `app/globals.css`. Tailwind v4's existing utility set covers every needed style; no new CSS variables or utility helpers are required because the source's `--color-ink` is replaced by `currentColor` and theme is conveyed via text-color classes.

## Scope

### In Scope
- Representation primitives: `VisualFraction`, `NumberLine`, `DivisionFraction`, `WordFraction` plus their shared types and barrel.
- Feedback layer: `AnswerFeedback` (no `Button`, no lucide icons), `retry-copy`, structural `Problem`/`Answer`/`FeedbackOutcome` types, and the `playChime` Web Audio utility.
- `RulePanel` and its barrel.
- Tailwind v3 → v4 token translation across these files.

### Out of Scope
- Question components (`VisualToFraction`, `FractionToNumberLine`, `WordToVisual`, `QuestionHost`) — plan-03.
- Session player and supporting components — plan-03.
- Routes and home tile changes — plan-03.
- Adding any dependency to `package.json`.
- `app/globals.css` edits.

## Files

### Create
- `app/fractions/_components/representations/types.ts` — copy verbatim from `~/projects/markschaake/fractions-practice/src/components/representations/types.ts` (`RepresentationMode`, `FractionProps`, `NumberLineProps`).
- `app/fractions/_components/representations/index.ts` — barrel re-exporting `VisualFraction`, `NumberLine`, `DivisionFraction`, `WordFraction`, plus the types.
- `app/fractions/_components/representations/VisualFraction.tsx` — port; apply the token translation table; the SVG `<rect>` `className` switches between `text-emerald-600` (filled) and `text-white dark:text-slate-950` (unfilled) with `fill="currentColor"`; `stroke="currentColor"` plus a parent `text-slate-900 dark:text-slate-100` class.
- `app/fractions/_components/representations/NumberLine.tsx` — port; replace `stroke="var(--color-ink)"` with `stroke="currentColor"` and add a wrapper utility class `text-slate-900 dark:text-slate-100`; knob class becomes `bg-emerald-600`; preserve all pointer-event behavior and `KNOB_SIZE_PX = 48`.
- `app/fractions/_components/representations/DivisionFraction.tsx` — port with token translation.
- `app/fractions/_components/representations/WordFraction.tsx` — port with token translation.
- `app/fractions/_components/feedback/types.ts` — copy verbatim from source (`QuestionType`, `Problem`, `Answer`, `FeedbackOutcome`).
- `app/fractions/_components/feedback/index.ts` — barrel re-exporting `AnswerFeedback`, `playChime`, and the types from `./types`.
- `app/fractions/_components/feedback/retry-copy.ts` — copy verbatim.
- `app/fractions/_components/feedback/chime.ts` — port; replace import `'@/lib/storage/progress'` with `'../../_lib/storage/progress'`; preserve the `'use client'` directive, `AudioContext` lazy init, and the `readSettings().soundEnabled` early return.
- `app/fractions/_components/feedback/AnswerFeedback.tsx` — port; remove `import { Check, AlertCircle } from 'lucide-react'` and the `Button` import; render the correct-icon as `<span aria-hidden="true" className="text-xl">✓</span>`, the retry-icon as `<span aria-hidden="true" className="text-xl font-bold">!</span>`; replace `Button` with native `<button>`/`<Link>` styled `min-h-[44px] px-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium active:scale-[0.98] transition`; update representation imports to `'../representations'`; apply the token translation table for `bg-correct/10 text-correct` and `bg-incorrect/10 text-incorrect`.
- `app/fractions/_components/rule-panel/index.ts` — barrel re-exporting `RulePanel`.
- `app/fractions/_components/rule-panel/RulePanel.tsx` — port with token translation.

### Modify
- None.

## Verification

- [ ] `bun run lint` exits with status 0.
- [ ] `bun run build` exits with status 0.
- [ ] `git diff` of `package.json` is empty for both `dependencies` and `devDependencies` blocks across this plan's commits.
- [ ] No file under `app/fractions/_components/{representations,feedback,rule-panel}/` contains the literal string `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, `tailwind-merge`, or `clsx`.
- [ ] No file under those folders contains the literal class tokens `bg-bg`, `text-ink`, `bg-accent`, `bg-correct`, `bg-incorrect`, `border-ink`, `text-bg`.
- [ ] No file under those folders contains the literal `var(--color-ink)`.
- [ ] `app/fractions/_components/feedback/chime.ts` imports `readSettings` from `../../_lib/storage/progress` and contains an early `return` when `readSettings().soundEnabled` is `false`.
- [ ] `app/fractions/_components/representations/NumberLine.tsx` exports a `NumberLine` component that renders a slider element (role="slider") with `aria-valuemin=0`, `aria-valuemax={denominator}`, and a `KNOB_SIZE_PX` constant equal to `48`.
- [ ] `app/fractions/_components/feedback/AnswerFeedback.tsx` renders three branches keyed by `outcome`: `'correct'`, `'retry'`, `'reveal'`, and the reveal branch renders all four representation primitives (`VisualFraction`, `WordFraction`, `DivisionFraction`, `NumberLine`).
- [ ] `app/globals.css` is byte-identical to its state at the start of the plan.
