# learn.schaakefamily.com

Hub for homeschool practice mini-apps. No auth, deploys to Vercel, iPad-friendly.

## Local dev

```bash
bun dev
```

Open http://localhost:3000

## Adding a new mini-app

1. Create `app/<slug>/page.tsx` — that's the new route.
2. Add a tile to the `apps` array in `app/page.tsx`:

```ts
{
  href: "/<slug>",
  title: "Display Name",
  description: "One-line summary.",
  emoji: "🎯",
  status: "ready", // or "coming-soon"
}
```

That's it. Push to `main`, Vercel redeploys.

## Stack

Next.js 16 (App Router), Tailwind v4, TypeScript, Bun. No database, no auth, no API routes — these are static client-rendered practice tools.

## Conventions

- **Routes per app**: each mini-app lives at `/<slug>`. Keep slugs short.
- **No shared state across apps**: each one is self-contained.
- **Touch first**: large hit targets (≥44px), no hover-only affordances, `active:scale-*` for tactile feedback.
- **Quiet by default**: don't auto-play audio; require a tap to start sound-producing apps.
