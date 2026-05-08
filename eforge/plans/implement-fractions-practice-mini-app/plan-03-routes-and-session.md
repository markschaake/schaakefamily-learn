---
id: plan-03-routes-and-session
name: Routes, session player, question components, and home tile flip
branch: implement-fractions-practice-mini-app/plan-03-routes-and-session
---

# Routes, session player, question components, and home tile flip

## Architecture Context

Final assembly. Builds on plan-01 (domain + storage + reducer) and plan-02 (representations + feedback + rule-panel). This plan ports the question components and session-level UI, wires the `/fractions` landing page and the nested `/fractions/session` route, and flips the home tile from `coming-soon` to `ready`. After this plan, the user-visible flow described in the source planning document's acceptance criteria is complete: tile → landing → 10-problem session → summary → restart.

## Implementation

### Overview

Apply the same Tailwind v3 → v4 token translation table established in plan-02. Replace source `Button` usage with native `<button>` / `<Link>` elements styled to match the hub's slate-based button utility classes (`min-h-[44px] px-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium active:scale-[0.98] transition`). Update the source's `<Link href="/session">` reference to `<Link href="/fractions/session">`. The new `app/fractions/page.tsx` is a server component whose only client child is `SoundToggle`; everything else is `<Link>` and static markup. The new `app/fractions/session/page.tsx` is a thin route wrapper that renders `SessionPlayer`. Update `app/page.tsx` to set the fractions tile entry's `status` to `"ready"`.

### Key Decisions

1. Nested session route at `/fractions/session` (not top-level `/session`) per AGENTS.md slug convention and the source planning document. Each mini-app owns its full subtree under its slug.
2. `app/fractions/page.tsx` stays a server component because only `SoundToggle` requires `'use client'`; React permits a client child inside a server parent.
3. Touch-first: every `<button>` and `<Link>` styled as a button uses `min-h-[44px]` and `active:scale-[0.98]`. iPad is the primary device per AGENTS.md.
4. `SessionPlayer.tsx` keeps the source's four effects 1:1: persist progress on entering `'summary'` (guarded by a `useRef` to fire exactly once), play chime on `correctTick` increments, dispatch `REBUILT` when `pendingRebuild` is set, auto-advance from `'correct'` after 800 ms.
5. `SessionSummary.tsx` keeps the source layout but replaces the `Button` with a native `<button>` styled per the hub pattern; the restart action calls the passed-in `onRestart` callback.
6. The landing page's primary CTA links to `/fractions/session`; the secondary link returns to `/` for the hub home.
7. Home tile flip in `app/page.tsx` is a one-property change (`status: "coming-soon"` → `status: "ready"`) — no other tile entries are introduced.

## Scope

### In Scope
- Question components (`QuestionHost`, `VisualToFraction`, `FractionToNumberLine`, `WordToVisual`) and supporting types/barrel.
- Session-level UI (`SessionPlayer`, `SessionSummary`, `ProgressIndicator`, `SoundToggle`, `PageShell`) and barrel.
- Replacing the placeholder `app/fractions/page.tsx` with the landing page.
- Creating `app/fractions/session/page.tsx` that renders `SessionPlayer`.
- Flipping the home tile entry in `app/page.tsx` from `"coming-soon"` to `"ready"`.

### Out of Scope
- PWA manifest, app icons, standalone deployment artifacts.
- Any new home tile entries beyond the existing fractions tile.
- Adding any dependency to `package.json`.
- Automated tests (per AGENTS.md, do not add tests for trivial mini-apps).
- `app/layout.tsx` or `app/globals.css` edits.

## Files

### Create
- `app/fractions/_components/questions/types.ts` — copy verbatim; imports become `'../../_lib/problems/types'`.
- `app/fractions/_components/questions/index.ts` — barrel re-exporting `QuestionHost`.
- `app/fractions/_components/questions/QuestionHost.tsx` — port; switch on `problem.questionType` to render the matching question component; `'use client'`.
- `app/fractions/_components/questions/VisualToFraction.tsx` — port; apply token-translation table; the submit button becomes a native `<button>` styled `min-h-[44px] px-6 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-40 active:scale-[0.98] transition`; representation import becomes `'../representations'`.
- `app/fractions/_components/questions/FractionToNumberLine.tsx` — port with token translation; representation import becomes `'../representations'`.
- `app/fractions/_components/questions/WordToVisual.tsx` — port with token translation; representation imports become `'../representations'`; problem type import becomes `'../../_lib/problems/types'`.
- `app/fractions/_components/session/index.ts` — barrel re-exporting `SessionPlayer` (and any other session-level pieces needed by the route).
- `app/fractions/_components/session/PageShell.tsx` — port with token translation; `'use client'` if source has it, else server.
- `app/fractions/_components/session/ProgressIndicator.tsx` — port with token translation.
- `app/fractions/_components/session/SoundToggle.tsx` — port; replace import `'@/lib/storage/progress'` with `'../../_lib/storage/progress'`; `'use client'`; keeps `useState`-based read/write of `Settings`.
- `app/fractions/_components/session/SessionSummary.tsx` — port; replace `Button` with native `<button>` styled per the hub pattern; replace `'@/lib/storage/progress'` import with `'../../_lib/storage/progress'`.
- `app/fractions/_components/session/SessionPlayer.tsx` — port; update imports to relative paths (`'../questions'`, `'../rule-panel'`, `'../feedback'`, `'../../_lib/problems/session-builder'`, `'../../_lib/storage/progress'`); preserve all four effects (persist on `summary`, chime on `correctTick`, REBUILT on `pendingRebuild`, ADVANCE_FROM_CORRECT after 800 ms); `'use client'`.
- `app/fractions/session/page.tsx` — minimal wrapper: `import { SessionPlayer } from '../_components/session'; export default function FractionsSessionPage() { return <SessionPlayer />; }`. May export `metadata = { title: 'Fractions Practice — Session' }`.

### Modify
- `app/fractions/page.tsx` — replace the existing placeholder. New content: a server component rendering a centered hero with a 7xl emoji `\u{1F355}`, an h1 `"Fractions Practice"`, a one-line description (e.g. `"A short, predictable 10-problem session."`), a primary `<Link href="/fractions/session">` styled as a button (`min-h-[44px] px-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium active:scale-[0.98] transition`) with the label `"Start"`, a secondary `<Link href="/">` styled `"← Back home"`, and the `SoundToggle` client component imported from `./_components/session`. Remove the literal string `"Coming soon"`.
- `app/page.tsx` — change the fractions tile entry's `status` value from the literal `"coming-soon"` to the literal `"ready"`. No other property of the tile changes.

## Verification

- [ ] `bun run lint` exits with status 0.
- [ ] `bun run build` exits with status 0.
- [ ] `app/page.tsx` contains the substring `status: "ready"` for the `/fractions` tile entry and does not contain `status: "coming-soon"` for that entry.
- [ ] `app/fractions/page.tsx` does not contain the literal string `Coming soon`.
- [ ] `app/fractions/page.tsx` contains a `<Link>` element with `href="/fractions/session"`.
- [ ] `app/fractions/page.tsx` contains a `<Link>` element with `href="/"` for the back-home affordance.
- [ ] `app/fractions/session/page.tsx` exports a default React component that renders `SessionPlayer`.
- [ ] `app/fractions/_components/session/SessionPlayer.tsx` contains a `useEffect` that calls `writeProgress` only when `state.phase === 'summary'`, and a `useRef` boolean that is checked to avoid duplicate writes.
- [ ] `app/fractions/_components/session/SoundToggle.tsx` imports `readSettings` and `writeSettings` from `'../../_lib/storage/progress'`.
- [ ] `app/fractions/_components/questions/QuestionHost.tsx` switches on `problem.questionType` and renders one of `VisualToFraction`, `FractionToNumberLine`, `WordToVisual` for each of the three values.
- [ ] No file under `app/fractions/` (recursive) contains the literal string `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, `tailwind-merge`, or `clsx`.
- [ ] No file under `app/fractions/` (recursive) contains the literal class tokens `bg-bg`, `text-ink`, `bg-accent`, `bg-correct`, `bg-incorrect`, `border-ink`, `text-bg`, or the literal `var(--color-ink)`.
- [ ] `package.json` `dependencies` and `devDependencies` are byte-identical to their state at the start of the plan set (across all three plans).
- [ ] `app/layout.tsx` and `app/globals.css` are byte-identical to their state at the start of the plan set.
- [ ] Manual smoke (executed during validate stage if available, otherwise documented for the user): `bun run build` followed by visiting `/`, clicking the fractions tile, clicking Start, and confirming the route is `/fractions/session` and a question renders.
