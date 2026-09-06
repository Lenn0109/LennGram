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
│   ├── page.tsx                ← Public feed (3-col desktop, single mobile)
│   ├── p/[slug]/page.tsx     ← Project detail
│   ├── admin/                  ← Owner dashboard
│   │   ├── login/page.tsx
│   │   ├── page.tsx            ← List projects
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx      ← Edit
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
├── Animation.md
├── Architecture.md
├── Design.md
├── PRD.md
├── progress.md
├── README.md
├── middleware.ts               ← /admin route protection
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Visual contract (Apple DNA + Vercel tokens, since 2026-09-06)

- **Theme**: Light only — Apple `#f5f5f7` muted sections, `#0071e3` single blue accent
- **Layout**: 3-col desktop (left nav 2/12, feed 7/12, right sidebar 3/12) / single col mobile
- **Typography**: Geist (via next/font/google) — compressed tracking scale, tabular nums
- **Cards**: Shadow-as-border (`0 0 0 1px rgba(0,0,0,0.08)`) + subtle ambient lift
- **Motion**: ≤150ms ease-out, no bounce, no spring, no parallax
- **No emoji**, no stock photos, no generic stock imagery
- **No serif**

## Typography scale (Vercel token discipline)

| Level | Class | Size | Tracking | Weight | Use |
|-------|-------|------|----------|--------|-----|
| Display | `tracking-display` | 64px | -0.05em | 600 | Hero billboard |
| Heading | `tracking-heading` | 32px | -0.03em | 600 | Section heads |
| Title | `tracking-title` | 20-28px | -0.022em | 600 | Card titles |
| Body | `tracking-body` | 15-17px | -0.011em | 400 | Paragraphs |
| Small | `tracking-small` | 12-13px | -0.006em | 400-500 | Labels, captions |

## Conventions

- **Language**: English in code/comments. Indonesian in user-facing chat.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
  - **NO Co-authored-by trailers** for AI agents (enforced by global git hook)
  - **Author**: only `lenn0109 <lennlynx91@gmail.com>`
- **Branches**: `feat/<scope>`, `fix/<scope>`. Default branch: `main`.
- **Update `progress.md`** after each milestone.

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
2. `Design.md` — visual system + tokens
3. `Architecture.md` — how it fits together
4. `Schema.md` — DB schema + RLS
5. `PRD.md` — features + scope
6. `Animation.md` — motion specs
7. `README.md` — onboarding

## Anti-patterns (avoid)

- ❌ `bg-gradient-*` — no gradients
- ❌ `shadow-lg shadow-xl` — use `shadow-vc` (shadow-as-border)
- ❌ `font-bold` — use `font-semibold` (600 max; Vercel 3-weight rule)
- ❌ `transition-all` — be specific (`transition-colors`, `transition-transform`)
- ❌ Emoji in UI (🚀, ✨) — none
- ❌ `rounded-2xl` or higher on cards — keep ≤lg (18px)
- ❌ `animate-pulse` on cards — distracting
- ❌ Icon with fill — use stroke only (lucide stroke=1.75)
- ❌ Tailwind v4 — stay on v3.4.17 (lighter)
- ❌ ORM (Prisma, Drizzle) — Supabase JS client + RLS is enough
- ❌ Automated UI tools (template generators, low-effort design tools) — manual only
- ❌ Sentry, PostHog, analytics — out of scope
- ❌ OAuth for visitors — no auth UI
