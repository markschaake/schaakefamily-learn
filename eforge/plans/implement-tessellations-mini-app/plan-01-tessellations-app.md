---
id: plan-01-tessellations-app
name: Implement Tessellations Mini-App
branch: implement-tessellations-mini-app/plan-01-tessellations-app
---

# Implement Tessellations Mini-App

## Architecture Context

New mini-app route `/tessellations` in the Schaake Family Learning site. Follows the same conventions as the existing `app/fractions/` mini-app: server-component page, `"use client"` boundary at the interactive app component, feature-local code under `_components/` and `_lib/` with barrel exports. Uses SVG + pointer events for all interactions (zero new dependencies).

## Implementation

### Overview

Build a self-contained tessellations mini-app with three layers:

1. **Data layer** (`_lib/`): Shape definitions as typed data (not hard-coded UI branches), pattern generation logic, barrel export.
2. **Component layer** (`_components/`): `TessellationsApp` (client boundary + state), `ShapePicker` (shape selection), `Board` (SVG board with drag + preview), `FeedbackPanel` (tessellation info), barrel export.
3. **Route** (`page.tsx`): Server component with metadata, renders `<TessellationsApp />`.

Plus one modification to `app/page.tsx` to register the home tile.

### Key Decisions

1. **Shapes as typed data, not UI branches.** Each shape is a `ShapeDefinition` object with `id`, `name`, `emoji`, `color`, `svgElement` (`"polygon"` | `"circle"`), normalized geometry (`points` or `radius` in 0-1 space), `tessellatesByItself`, kid-readable `explanation`, and optional `singleShapePattern`. Adding multi-shape patterns later means extending the type, not rewriting components.

2. **SVG with pointer events for drag, matching NumberLine pattern.** Use `setPointerCapture`, `touch-none`, 48px targets, and `active:scale-[0.98]` tactile feedback. No canvas, no drag library.

3. **Pattern generation is deterministic and shape-driven.** For tessellating shapes, `generatePattern(shape, boardSize)` produces an array of `{row, col, x, y}` positions from the shape's `singleShapePattern` config (columns/rows/stagger). For non-tessellating shapes, returns empty array. The board scales normalized grid coordinates to pixel positions.

4. **Curated five-shape set for V1.** Square (polygon, tessellates, grid), equilateral triangle (polygon, tessellates, staggered grid with flips), regular hexagon (polygon, tessellates, hexagonal stagger), regular pentagon (polygon, does NOT tessellate by itself), circle (circle geom, does NOT tessellate).

5. **Board sizing: responsive square.** The board is a square SVG viewBox using `100` units. Tile size is `boardSize / Math.max(pattern.columns, pattern.rows)` for tessellating shapes, or a fixed comfortable size (e.g., 20 units) for single-shape drag mode. Shapes scale to fill their tile area.

6. **No test stages** — per `AGENTS.md`: "Don't add tests for trivial mini-apps." The build pipeline uses `[implement, review-cycle]`.

## Scope

### In Scope

- Add `/tessellations` route with server-component page and metadata
- Add Tessellations tile to home page `apps` array in `app/page.tsx`
- Shape data model (`types.ts`) with `ShapeDefinition` and `SingleShapePattern`
- Five curated shapes (`shapes.ts`): square, equilateral triangle, regular hexagon, regular pentagon, circle
- Pattern generator (`pattern-generator.ts`) for deterministic grid layout
- Interactive board (`Board.tsx`) with SVG rendering, pointer-event drag, and preview toggle
- Shape picker (`ShapePicker.tsx`) with emoji-labeled buttons, consistent with home tile styling
- Feedback panel (`FeedbackPanel.tsx`) showing tessellation verdict and kid-readable explanation
- `TessellationsApp.tsx` as client boundary managing selected-shape state and board position
- Barrel exports (`_lib/index.ts`, `_components/index.ts`)
- `bun run lint` and `bun run build` pass

### Out of Scope

- Freeform polygon drawing/editor
- Multi-shape elemental pattern mode
- Persistence, sharing, accounts, auth, analytics
- Audio or autoplay

## Files

### Create

- `app/tessellations/page.tsx` — Server component: metadata (title, description), renders `<TessellationsApp />`
- `app/tessellations/_lib/types.ts` — `ShapeDefinition`, `SingleShapePattern`, `Position` types
- `app/tessellations/_lib/shapes.ts` — Curated array of five `ShapeDefinition` objects
- `app/tessellations/_lib/pattern-generator.ts` — `generatePattern(shape, boardSize)` function
- `app/tessellations/_lib/index.ts` — Barrel: re-exports types, shapes, pattern-generator
- `app/tessellations/_components/TessellationsApp.tsx` — `"use client"` component: state for selected shape + board position, renders ShapePicker + Board + FeedbackPanel
- `app/tessellations/_components/ShapePicker.tsx` — Grid of shape-selection buttons with emoji + name
- `app/tessellations/_components/Board.tsx` — SVG board with pointer-event drag for single shape and pattern preview overlay
- `app/tessellations/_components/FeedbackPanel.tsx` — Shows tessellation status (✓/✗) and explanation for selected shape
- `app/tessellations/_components/index.ts` — Barrel: re-exports TessellationsApp, ShapePicker, Board, FeedbackPanel

### Modify

- `app/page.tsx` — Add tessellations entry to `apps` array: `{ href: "/tessellations", title: "Tessellations", description: "Discover which shapes tile cleanly without gaps.", emoji: "🔷", status: "ready" }`

## Verification

- [ ] Home page (`/`) displays a Tessellations tile with emoji 🔷 and "Open →" link
- [ ] Clicking the Tessellations tile navigates to `/tessellations`
- [ ] `/tessellations` renders an H1 title and five shape-picker buttons (square, triangle, hexagon, pentagon, circle)
- [ ] Selecting square/triangle/hexagon shows a positive tessellation verdict with kid-readable explanation
- [ ] Selecting pentagon/circle shows a negative tessellation verdict with kid-readable explanation
- [ ] Non-tessellating explanations use precise scope wording (e.g., "this selected regular pentagon does not tessellate by itself in this app") rather than inaccurate absolute claims like "pentagons cannot tessellate"
- [ ] Dragging the shape on the board works via pointer/touch events with no page scroll or text selection
- [ ] Shape picker buttons and drag target have at least 44px hit areas
- [ ] Preview mode for tessellating shapes fills the board with a repeating grid of the selected shape
- [ ] Preview mode for non-tessellating shapes shows a clear "does not repeat cleanly" message instead of a grid
- [ ] All new code is self-contained under `app/tessellations/` (except `app/page.tsx` tile addition)
- [ ] No new dependencies in `package.json`
- [ ] `bun run lint` passes with zero errors
- [ ] `bun run build` succeeds