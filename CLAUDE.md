# CLAUDE.md — LennGram

> AI agent context file. **Read this first** in every session before
> writing or modifying code in this repo.

## Project

LennGram is a **personal project portfolio** styled like a social media
feed. Single owner (lenn0109), public visitors. No user accounts.

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS 3
- **DB/Storage**: Supabase (Postgres + Storage, same project as LennMusic — `gufjubglnddginxqjdym`)
- **Hosting**: Vercel Hobby (free)
- **Auth model**: Shared password (env var) for admin; no visitor auth
- **Audience**: Mixed — HRD research, friends, random visitors

## Repo layout (flat, single Next.js app)

```
LennGram/                       ← repo root = Next.js project root
├── app/                        ← App Router
│   ├── page.tsx                ← Public feed
│   ├── p/[slug]/page.tsx       ← Project detail
│   ├── admin/                  ← Owner dashboard
│   │   ├── login/page.tsx
│   │   ├── page.tsx            ← List projects
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx       ← Edit
│   ├── api/                    ← API routes
│   │   ├── like/route.ts
│   │   └── view/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── feed/
│   ├── project/
│   ├── admin/
│   └── ui/                     ← shadcn-style primitives (handmade)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           ← Browser client (anon key)
│   │   ├── server.ts           ← Server client (service role)
│   │   └── admin.ts            ← Middleware-gated admin client
│   ├── auth.ts                 ← Password hashing + cookie session
│   ├── ip-hash.ts              ← IP → sha256 hash with SALT
│   └── markdown.ts             ← MDX/markdown renderer
├── public/                     ← Static assets
├── supabase/
│   └── schema.sql              ← DB schema (idempotent)
├── docs/                       ← Design + animation references
├── middleware.ts               ← /admin route protection
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── progress.md
```

## Visual contract (since 2026-09-05)

- **Theme**: **monochrome light only** — white background, black text, gray borders. No accent color. No gradient. No shadow.
- **Layout**: masonry 3-col desktop / 2-col tablet / 1-col mobile
- **Typography**: sans primary (Inter), mono secondary (JetBrains Mono) for tech tags
- **Motion**: subtle — 150ms ease-out hover, no bounce, no spring
- **No emoji**, no stock photos, no generic stock imagery
- **No serif** (Victorian was discussed and rejected — too ornament)

## Conventions

- **Language**: English in code/comments. Indonesian in user-facing chat.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
  - **NO Co-authored-by trailers** for AI agents (enforced by global git hook)
  - **Author**: only `lenn0109 <lennlynx91@gmail.com>`
- **Branches**: `feat/<scope>`, `fix/<scope>`. Default branch: `main`.
- **Update `progress.md`** after each phase.

## Build constraints (t3.micro 1.9GB RAM)

- **No** `@next/bundle-analyzer` in default build
- **No** source-map upload (Sentry DSN present but not configured for source maps)
- **No** `@sentry/nextjs` unless explicitly enabled
- **Pin versions exact** (no caret) — reproducibility over freshness
- **Vercel build is cloud-side** — local `next build` may OOM, OK to skip

## Auth model — quick reference

```ts
// Public visitor (any IP) — anon client
const supabase = createBrowserClient(URL, ANON_KEY)

// Admin (must pass middleware) — service role bypasses RLS
const supabase = createServerClient(URL, SERVICE_KEY, { cookies })

// Middleware: /admin/* requires valid signed cookie
// Cookie set by POST /admin/login with valid ADMIN_PASSWORD
// Cookie expiry: 7 days, httpOnly, sameSite=lax
```

## Key files priority

1. `progress.md` — where we are now
2. `Architecture.md` — how it fits together
3. `Schema.md` — DB schema + RLS
4. `Design.md` — visual system
5. `PRD.md` — features + scope
6. `Animation.md` — motion specs
7. `README.md` — onboarding

## Anti-patterns (avoid)

- ❌ Accent color (gold, violet, blue) — monochrome only
- ❌ Drop shadow on cards — use border + subtle gray hover bg
- ❌ Emoji in UI (🛠️, ✨) — none
- ❌ Tailwind v4 — stay on v3.4.17 (lighter)
- ❌ ORM (Prisma, Drizzle) — Supabase JS client + RLS is enough
- ❌ Automated UI tools (template generators, low-effort design tools) — manual only
- ❌ Sentry, PostHog, analytics — out of scope
- ❌ OAuth for visitors — no auth UI
