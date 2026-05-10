---
title: Implement Tessellations Mini-App
created: 2026-05-10
profile: pi-local
---

# Implement Tessellations Mini-App

## Problem / Motivation

The site needs a new kid-friendly math mini-app for tessellations. The user gap is that learners cannot currently experiment with shapes to discover which ones repeat cleanly without gaps/overlaps. The Schaake OS epic `34bca765-7610-4991-a22c-098b52055129` is in progress, medium priority, unblocked, tagged `mini-app`, `math`, `tessellations`, and asks for a drag/drop or arrange-on-canvas experience, a single-shape tessellation demonstration, a repeating-pattern preview, and an architecture that can later grow into multi-shape elemental patterns.

Current site only has the Fractions mini-app (`app/page.tsx`, `app/fractions/**`), so `/tessellations` is a new route rather than an extension of existing math app state.

## Goal

Add a touch-first, client-side tessellations mini-app where kids select from a curated set of basic shapes, arrange/drag a shape on a board, see whether the selected single shape tessellates cleanly with kid-readable feedback, and preview a repeating pattern — while keeping the architecture open for a later multi-shape elemental pattern mode.

## Approach

1. **No new dependencies or libraries.** Use SVG/HTML with pointer events for drag/arrange interactions (consistent with the existing `app/fractions/_components/representations/NumberLine.tsx` pattern using pointer events, pointer capture, `touch-none`, and 48px targets). No canvas, drag/drop library, state management library, database, API routes, auth, or analytics.

2. **Follow existing project conventions:**
   - Register the new route by adding a tessellations tile to the `apps` array in `app/page.tsx`.
   - Split route/page from interactive app: `app/tessellations/page.tsx` stays a small server component with metadata; `TessellationsApp` is the client boundary (`"use client"` only where interactivity requires it).
   - Keep feature-local code under `app/tessellations/_components` and `app/tessellations/_lib`, matching the Fractions app pattern.

3. **Represent shapes as data, not hard-coded UI branches.** Suggested model: `id`, `name`, `emoji/icon/color`, normalized SVG polygon/circle data, `tessellatesByItself`, kid-readable explanation, and optional `singleShapePattern` config. This leaves room for future multi-shape elemental patterns by extending pattern definitions rather than rewriting the UI.

4. **Curated finite shape list for V1.** Suggested set: square, equilateral triangle, regular hexagon, regular pentagon, circle/round tile. Square/triangle/hexagon demonstrate classic regular tessellations; pentagon/circle provide teaching contrast. Wording must be precise — e.g., "this selected regular pentagon/circle does not tessellate by itself in this app," not "all pentagons cannot tessellate" — because some non-regular pentagons do tessellate.

5. **Preview mode generates deterministic repeated copies** from the selected shape's pattern config (rows/columns/offsets within the board). For tessellating shapes, fill the board; for non-tessellating shapes, show a friendly gap/overlap explanation and no successful repeating grid. Satisfies demonstration/preview without a full physics/snapping engine.

6. **Drag/arrange interaction is tactile but bounded.** A board displays one prominent selected tile that can be dragged with pointer/touch controls. A "Repeat it" or preview toggle fills the board from the selected shape's pattern config.

7. **No persistence is needed** per the epic and `AGENTS.md`. If saved patterns become a requirement later, localStorage can be added without server changes.

8. **No in-repo roadmap needs updating** — `find docs ...` returned no `docs/roadmap.md` files; alignment comes from the active Schaake OS epic.

## Scope

**In scope:**
- Add a new `/tessellations` mini-app route and a ready tile on the home page (`app/page.tsx`).
- Provide a curated basic shape picker, including shapes that tessellate by themselves and at least one teaching-contrast shape that does not.
- Provide a touch-first board/canvas-like interaction where the selected shape can be arranged/dragged and repeated.
- Demonstrate whether the selected single shape tessellates cleanly, with kid-readable feedback explaining why.
- Generate a repeating-pattern preview from the selected shape.
- Keep all behavior static/client-side with no database, API route, auth, analytics, or new dependency unless proven necessary.
- Keep the implementation self-contained under `app/tessellations/**`, except for the home tile update in `app/page.tsx`.
- Leave a clear model boundary for later multi-shape pattern support (separate shape metadata, tessellation capability, and repeat-generation logic).

**Out of scope for V1:**
- Freeform polygon drawing/editor.
- Combining multiple different shapes into one tessellating unit.
- Persistent saved patterns, sharing/exporting, accounts, server storage, or analytics.
- Audio/autoplay behavior.

## Acceptance Criteria

- Home page includes a ready Tessellations tile that links to `/tessellations`.
- `/tessellations` renders a unique title/H1 and a kid-friendly, touch-first UI consistent with the Fractions app/home page styling.
- Users can select from a finite set of basic shapes; the set includes self-tessellating examples such as square/triangle/hexagon and at least one non-self-tessellating contrast shape such as regular pentagon or circle.
- Users can drag or arrange the selected shape on a board using pointer/touch-friendly controls with targets at least 44px where applicable.
- The app clearly labels whether the selected shape tessellates by itself and gives a simple explanation.
- The app can preview a repeating pattern for tessellating shapes; non-tessellating shapes show a clear "does not repeat cleanly by itself" demonstration/message rather than pretending success.
- The tessellation data/model separates shape metadata, tessellation capability, and repeat-generation logic so future multi-shape mode can reuse or extend it.
- No API routes, database, auth, analytics, global state library, or unnecessary external drag/canvas dependency is introduced.
- `bun run lint` and `bun run build` pass.
