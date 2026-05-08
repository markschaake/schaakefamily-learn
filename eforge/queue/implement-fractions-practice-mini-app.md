---
title: Implement fractions-practice mini-app
created: 2026-05-08
---

# Implement fractions-practice mini-app

## Problem / Motivation

The `/fractions` mini-app currently exists only as a disabled/coming-soon home tile plus a placeholder page. The Schaake OS epic `6e546f67-c50e-4db2-9ba4-8801781ca65c` (in progress) requires the existing standalone `~/projects/markschaake/fractions-practice` app to be ported into this hub so the fractions practice experience is available from `learn.schaakefamily.com`.

Affected users are homeschool/iPad users of the learning hub, especially the intended kid user of the fractions practice flow. This matters now because the epic is in progress and the hub already advertises the mini-app but does not provide the practice session.

### Epic source
- Schaake OS epic `6e546f67-c50e-4db2-9ba4-8801781ca65c` is in progress and asks to implement/port the existing `~/projects/markschaake/fractions-practice` project into this mini-app hub.
- Epic acceptance criteria: existing fractions functionality available here; placeholder tile/page replaced or linked; core practice flow works end-to-end; styling/navigation consistent with surrounding app.

### Target project evidence
- `AGENTS.md` and `README.md` describe this as a public static/client-side Next.js 16 App Router + Tailwind v4 + TypeScript + Bun hub. No auth, database, analytics, or API routes. Mini-apps live under `app/<slug>/page.tsx` and should be touch-first for iPad.
- Current placeholder exists at `app/fractions/page.tsx` and only renders "Coming soon" plus a home link.
- Home tile in `app/page.tsx` points to `/fractions` but has `status: "coming-soon"`, so `MiniAppTile` renders a disabled non-link tile.
- Existing shell patterns: `app/layout.tsx` supplies site metadata/viewport and `app/globals.css` defines Tailwind v4/global colors. No `src/` directory in target.
- No `docs/roadmap.md` was found; roadmap alignment is inferred from the epic and app hub README/AGENTS conventions.
- Next.js 16 docs present in `node_modules/next/dist/docs/`; relevant App Router and accessibility docs confirm filesystem app routes and route-announcement behavior. Implementation should keep unique/descriptive page headings/titles where practical.

### Source fractions app evidence
- Source project at `/Users/markschaake/projects/markschaake/fractions-practice` is a Next.js 15 + React 19 + Tailwind v3 app with no backend/API/database and versioned `localStorage` state under `fractions-practice:v1:*`.
- Core flow is a 10-problem session: landing page starts a session, `src/app/session/page.tsx` renders `SessionPlayer`, problems are built by `src/lib/problems/session-builder.ts`, session state lives in `src/components/session/session-reducer.ts`, and completion appends progress via `src/lib/storage/progress.ts`.
- Question types are `visual-to-fraction`, `fraction-to-number-line`, and `word-to-visual` (`src/lib/problems/types.ts`) with a curated/validated problem set in `src/lib/problems/problem-set.ts`.
- UI components include question components, representation components, feedback/reveal, a fixed rule panel, sound toggle/chime, progress indicator, and summary.
- Source has a few dependencies not present in target (`lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, `tailwind-merge`, `clsx`) and Tailwind v3 custom tokens (`bg-bg`, `text-ink`, `bg-accent`, etc.). Porting should either add those dependencies/tokens or adapt to target Tailwind v4/site styles. Lower-risk path: avoid new UI dependencies and translate styling to target/site Tailwind classes.

### Early assumptions / unknowns
- Assumption: the mini-app should live entirely under `/fractions`, including a nested `/fractions/session` route, rather than creating a top-level `/session` route. Evidence: target README says each mini-app lives at `/<slug>` and source's top-level `/session` would conflict with that pattern. Confidence high; validation cost low; impact if wrong is mostly navigation cleanup.
- Assumption: full PWA/domain/deploy setup from the standalone source app is out of scope for the hub port. Evidence: target hub already owns global layout/deploy and epic asks for a mini-app experience, not a second standalone PWA/domain. Confidence medium-high; impact if wrong is missing standalone install affordances/icons.
- Assumption: preserving the `fractions-practice:v1:*` localStorage namespace is acceptable in the hub. Evidence: source documents this namespace and target allows localStorage for mini-app persistence. Confidence high; impact if wrong is migration/renaming work.

## Goal

Port the existing standalone `~/projects/markschaake/fractions-practice` app into the `learn.schaakefamily.com` hub as a self-contained `/fractions` mini-app so that the full 10-problem fractions practice flow is available end-to-end with hub-consistent styling and navigation.

## Approach

- Route shape: keep the mini-app under `/fractions`; use `/fractions/session` for the session player. Rationale: target conventions say each mini-app lives at `/<slug>`, and top-level `/session` would be too generic for a hub.
- Self-contained file organization: place ported code inside `app/fractions/_components` and `app/fractions/_lib` (private route folders) rather than creating global shared `components`/`lib` modules. Rationale: project instructions say mini-apps should be self-contained and no shared state should be introduced unless there is a third use.
- Styling adaptation: translate source Tailwind v3 custom tokens (`bg-bg`, `text-ink`, `bg-accent`, etc.) to target Tailwind v4/site-friendly classes (slate/teal/emerald/amber) or app-local utilities. Rationale: avoids global Tailwind theme work and keeps styling consistent with the hub.
- Dependency policy: do not add `lucide-react`, Radix Slot, CVA, `tailwind-merge`, or `clsx` just for this port. Replace source `Button` usage with direct `button`/`Link` classes and replace icons with text glyphs/inline SVG/emoji as needed. Rationale: keeps the static kid app small and avoids unnecessary dependencies.
- Persistence: preserve source `fractions-practice:v1:*` localStorage keys. Rationale: source documents them; target allows localStorage for mini-app persistence; retaining the namespace avoids accidental collision and preserves any existing user data if same browser/domain ever shares it.
- Audio: keep sound muted by default and gated by the existing settings toggle; sound failures stay no-op. Rationale: source already implements this and target explicitly forbids autoplay audio.
- PWA/source layout: do not port standalone `RootLayout`, manifest/apple icon tags, or `RotateIpadHint` by default. Rationale: target root layout and deployment own site-level shell; epic asks for a mini-app, not a second app shell. If the session layout needs safe-area treatment, add only the minimal CSS/utilities needed.
- Navigation: source summary/back links that point to `/` should become `/fractions` or hub-appropriate links, and landing should provide a path back home. Rationale: inside the hub, `/` is the mini-app index, not the standalone fractions start page.
- Problem logic: copy the source curated problem set and module-import validator behavior. Rationale: build-time validation catches bad hand-authored problems and preserves existing functionality.

### Code Impact

Evidence gathered:
- Target files read: `AGENTS.md`, `README.md`, `package.json`, `app/page.tsx`, `app/fractions/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/MiniAppTile.tsx`.
- Source files read/search-inspected: `CLAUDE.md`, `README.md`, `package.json`, source route files, session reducer/player, problem set/types/session builder, storage wrapper, representative question/feedback/session components, and dependency/token usage via `rg`.

Expected target changes:
- Modify `app/page.tsx`: set the fractions tile `status` to `"ready"` so `MiniAppTile` renders a link.
- Replace `app/fractions/page.tsx`: implement landing/start page adapted from the source `src/app/page.tsx`, with start link pointing to `/fractions/session` and hub-consistent back/home navigation.
- Add `app/fractions/session/page.tsx`: render the client session player for the nested fractions route.
- Add a self-contained fractions implementation, preferably under private route folders such as:
  - `app/fractions/_lib/problems/*` from source `src/lib/problems/*`
  - `app/fractions/_lib/storage/progress.ts` from source `src/lib/storage/progress.ts`
  - `app/fractions/_components/session/*` from source `src/components/session/*`
  - `app/fractions/_components/questions/*` from source `src/components/questions/*`
  - `app/fractions/_components/representations/*` from source `src/components/representations/*`
  - `app/fractions/_components/feedback/*` from source `src/components/feedback/*`
  - `app/fractions/_components/rule-panel/*` from source `src/components/rule-panel/*`
- Potentially modify `app/globals.css` only if needed for safe-area utility classes or tiny app-local CSS helpers. Prefer Tailwind v4 utility classes and avoid recreating the full source Tailwind v3 theme.
- `package.json` should not need new dependencies if the port replaces source `Button`/Radix/CVA/lucide usage with plain styled `button`/`Link` and text/inline icons. If implementation chooses to preserve those abstractions, dependency changes become necessary, but that is not the preferred plan.

Patterns to follow:
- Target mini-apps live at `app/<slug>/page.tsx`; keep fractions routes under `app/fractions`.
- Target uses no `src/` directory.
- Use client components only where interactivity requires them; session/question/storage/sound components require `"use client"`, while route wrapper/landing can stay server components if they only render links and client children.
- Maintain source SSR-safe localStorage wrapper pattern.

Validation:
- Run `bun run lint` and `bun run build` after implementation.
- Manual smoke path: open `/`, tile opens `/fractions`, start session, answer at least one of each question type, verify retry/reveal/summary/restart/back navigation.

### Assumptions And Validation

| Assumption | Evidence / validation performed | Confidence | Cost to validate further | Validation path | Impact if wrong |
|------------|----------------------------------|------------|--------------------------|-----------------|-----------------|
| The mini-app session should be nested under `/fractions/session`, not top-level `/session`. | Target README/AGENTS say mini-apps live at `/<slug>`; current tile/page are `/fractions`; source top-level `/session` is standalone-app-specific. | High | Low | User review or route smoke test after implementation. | Navigation paths need renaming; no deep architectural rework. |
| Standalone source PWA/domain/deploy features are out of scope. | Target already has global layout/deploy; epic acceptance criteria mention mini-app functionality/styling/navigation, not installability/domain. | Medium-high | Low | User review if PWA install behavior is desired in hub. | Additional manifest/icons/layout work may be needed. |
| Avoiding new UI dependencies is preferable to adding source dependencies. | Target package has only Next/React deps; source dependency usage is limited to Button abstraction and icons per `rg`; equivalent UI can be implemented with native elements/Tailwind. | High | Low | During implementation, compile/lint confirms no imports remain; user can override if exact icons/components matter. | May need dependency additions if replacement misses behavior, but core flow unaffected. |
| Source localStorage namespace can remain `fractions-practice:v1:*`. | Source CLAUDE/storage docs define the namespace; target allows localStorage persistence for mini-apps. | High | Low | Manual browser devtools check after a completed session. | If a different namespace is required, existing storage wrapper constants must change; possible loss/migration of progress data. |
| Source core flow is represented by the files inspected and does not depend on hidden runtime services. | Source docs state no backend/API/database; file search and source reads show all core flow in React/problem/storage modules. | High | Low | `bun run build` in target after port; optional source build if needed. | Missing imported module or asset would cause compile/build failure. |
| Tailwind v4 utility translation can preserve usability without exact visual parity. | Target uses Tailwind v4 and site slate/dark styling; source custom Tailwind v3 tokens are mostly color aliases. | Medium-high | Medium | Manual UI smoke on desktop/iPad dimensions; adjust classes if readability/touch layout suffers. | Visual differences or contrast/layout issues may require style iteration. |
| No automated tests are required for this port. | Target AGENTS says not to add tests for trivial mini-apps unless complexity warrants it; acceptance can be covered by lint/build/manual smoke. | Medium | Low | User can request tests; implementation can add if flow complexity is judged high. | Regression coverage relies on manual smoke/build. |

No low-confidence/high-impact assumptions remain unresolved. The main user-visible assumptions (nested route, no PWA install port, visual adaptation) are disclosed and have low-cost validation paths.

### Profile Signal

Recommended profile: **Excursion**.

Rationale: this is a cohesive feature port involving multiple files and UI states, with enough adaptation work that Errand would be too shallow. A single plan can cover the route structure, copied/adapted modules, styling translation, and validation without delegating independent subsystem plans, so Expedition is unnecessary.

Known trade-off: this is a port/adaptation rather than a byte-for-byte copy. That slightly increases implementation work but reduces dependency/theme mismatch and better fits the hub conventions.

## Scope

### In scope
- Replace the `/fractions` placeholder with a working fractions practice landing/start page.
- Add the core practice session under the fractions route, preferably `/fractions/session`, so the mini-app remains self-contained under its slug.
- Port/adapt the source app's core domain and UI pieces: curated problem set + validation, session builder, answer checking, reducer/session flow, representations, question components, feedback/reveal, progress indicator, rule reminder, sound toggle/chime, summary, and `localStorage` progress/settings.
- Update the home tile in `app/page.tsx` from `coming-soon` to `ready` so it links to `/fractions`.
- Adapt styling/navigation to this hub's Next.js 16 + Tailwind v4 app, preserving touch-first controls and the no-autoplay sound rule.
- Validate with `bun run lint` and `bun run build`.

### Out of scope
- Adding auth, database, API routes, analytics, or server persistence.
- Porting the standalone source app's Vercel/domain setup, standalone manifest/icons, or full PWA install flow unless required by the code to keep the core session usable.
- Adding new mini-app-wide shared state or a state management library.
- Adding automated tests for this port; project instructions say not to add tests for trivial mini-apps unless complexity warrants it.
- Changing unrelated hub layout/routes or adding new app tiles beyond the existing fractions tile.

Roadmap relation: no `docs/roadmap.md` exists; scope aligns with the active Schaake OS epic and the hub's documented mini-app conventions.

## Acceptance Criteria

- The home page fractions tile in `app/page.tsx` is marked ready and opens `/fractions`.
- `/fractions` no longer says "Coming soon"; it presents the fractions practice landing/start experience with navigation consistent with the hub.
- `/fractions/session` (or an equivalent nested fractions route) runs a 10-problem practice session end-to-end.
- All three source question types work: visual-to-fraction, fraction-to-number-line, and word-to-visual.
- User answers are checked correctly; first wrong answer shows retry guidance; second wrong answer reveals the fraction in multiple representations; correct answers advance as in the source flow.
- Completed sessions show a summary and allow starting another session.
- Progress/settings use client-side `localStorage` only and do not crash in SSR/private/quota-failure conditions.
- Sound remains off by default and only plays after user-enabled/tapped settings; no autoplay audio is introduced.
- UI remains touch-first with ≥44px practical controls and no hover-only required affordances.
- No database, auth, analytics, API routes, or unrelated global dependencies are added.
- `bun run lint` and `bun run build` pass.
