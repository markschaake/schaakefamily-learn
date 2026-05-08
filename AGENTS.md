# learn.schaakefamily.com

Hub for homeschool practice mini-apps. Lives at https://learn.schaakefamily.com.

## What this is

- Public site, **no auth, no database, no API routes** — every mini-app is fully static / client-side.
- Deployed to Vercel (Schaake Family scope, Hobby plan). Push to `main` = redeploy.
- Tracked in os.schaake.solutions as project `learn-schaakefamily` (client: Mark Schaake, billing: pro_bono).

## Stack

- Next.js 16 App Router (Turbopack), Tailwind v4, TypeScript, Bun, no `src/` dir.
- `bun dev` to run locally, `bun run build` to verify, `bun run lint` to lint.

## Adding a new mini-app

1. Create `app/<slug>/page.tsx` — that's the route.
2. Add a tile entry to the `apps` array in `app/page.tsx`:
   ```ts
   { href: "/<slug>", title, description, emoji, status: "ready" | "coming-soon" }
   ```
3. The tile component is `components/MiniAppTile.tsx`. Reuse it; don't reinvent.

## Conventions

- **Touch-first.** Hit targets ≥44px, no hover-only affordances, prefer `active:scale-[0.98]` for tactile feedback. The primary device is iPad.
- **Self-contained apps.** No shared state across mini-apps. If two apps need the same helper, duplicate it; only extract when there's a third use.
- **No auto-play audio.** Sound-producing apps require a tap to start (browser policy + autistic-kid-friendly).
- **No tracking, no analytics, no auth.** Don't add them. This is a kid's practice site.
- **Server vs Client.** Default to server components. Only use `"use client"` when interactivity actually requires it (forms, sound, animation, state).

## Things to NOT do

- Don't add a database, ORM, or API routes. If a mini-app needs persistence, store in `localStorage`.
- Don't introduce a state management library. `useState` + `useReducer` is plenty.
- Don't add tests for trivial mini-apps. If a mini-app gets complex enough to want tests, that's a sign it should be its own repo.
- Don't add Vercel-specific edge/serverless features. These are static pages.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
