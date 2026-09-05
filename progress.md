# LennGram — Progress

> Phase tracker. Update after each milestone.

## Status

| Phase | Description | Status |
|---|---|---|
| 0 | Docs + Supabase schema | ✅ done |
| 1 | Scaffold Next.js 15 + Tailwind v3 | ✅ done |
| 2 | Public feed (IG-style 1-col) + project detail | ✅ done |
| 3 | Like (IP hash) + view counter API | ✅ done |
| 4 | Admin auth (password cookie) | ✅ done |
| 5 | Admin dashboard (CRUD + image upload) | ✅ done |
| 6 | Polish (empty states, SEO, OG) | ✅ done |
| 7 | UI redesign: IG/Twitter-style 1-col feed, square covers, double-tap, story strip, bottom nav | ✅ done |
| 8 | Deploy (Vercel + Supabase) | ⏳ pending env vars from user |

## Phase log

### 2026-09-05 — Phase 0: Docs + Schema

- ✅ Created repo `Lenn0109/LennGram` (public)
- ✅ 8 docs: README, CLAUDE, PRD, Architecture, Design, Animation, Schema, progress
- ✅ Schema designed: 3 tables (projects, project_likes, project_views) + 1 storage bucket (covers)
- ✅ RLS: public read published projects + public like/view + admin via service_role

### 2026-09-05 — Phases 1-6: Build

All delivered as a single sprint (commits 39ddefe → cd98c81 → 784c61a):

- Phase 1: package.json (pinned), next.config.mjs, tailwind.config.ts (custom monochrome tokens), app/layout.tsx (Inter + JetBrains Mono), app/globals.css (reduced-motion + monochrome vars + prose-like), .env.local.example with 7 vars.
- Phase 2: Public feed (`/`) with masonry (`columns-1 sm:2 lg:3`), `ProjectCard` (cover + title + tags + like count), `FilterChips` (?tech= URL state), `LoadMore` (cursor pagination via `?page=N`), loading skeleton, empty state.
- Phase 3: Project detail (`/p/[slug]`) with 2-col layout, sticky cover, markdown rendering via `marked`, `LikeButton` (optimistic, scale anim), `ViewTracker` (client useEffect), per-project OG metadata.
- Phase 4: API routes — `/api/like` (rate limit 10/hour per hashed IP, unlike support), `/api/view` (insert-only), `/api/projects` (paginated public list, also admin=1 with cookie), `/api/admin/projects` + `/[id]` (CRUD).
- Phase 5: Auth — HMAC-SHA256 signed cookie via Web Crypto (edge-safe), middleware (404 not 401 on `/admin/*`), `/api/admin/login` + `/logout`, `/admin/login` form, `LogoutButton`.
- Phase 6: Admin — `/admin` table, `/admin/new` + `/admin/[id]` form pages with zod validation, `ProjectForm` client (tag input, image drop-zone, sticky action bar), `/api/admin/upload` (multipart → Supabase Storage `covers` bucket, MIME + size validation).
- Phase 7: Polish — `app/sitemap.ts` (lists published), `app/robots.ts` (allow /, disallow /admin + /api), `app/(public)/not-found.tsx`, `app/error.tsx`, `app/loading.tsx`, `public/og.png` + `public/favicon.png` (generated monochrome PNGs), `Footer` component, route-group layout for public pages.
- Phase 8: QA — `npm run build` ✓, `npm run lint` ✓, `npm run type-check` ✓. Manual smoke: /, /p/[slug], /admin/login, /admin, /robots.txt, /sitemap.xml, /api/projects, /api/like, /api/view all return expected codes. Middleware returns 404 for /admin without cookie, 200 with cookie.
- Phase 9: Design audit — 0 violations of (non-gray color, shadow, gradient, rounded-2xl+, transition-all, emoji-in-source).
- Phase 10: UX audit — every flow exercised: login OK, wrong password 401, /admin with cookie 200, like/view in mock mode return success, validation rejects missing projectId, logout clears cookie, post-logout /admin returns 404, filter chips return matching subset, load-more and invalid-page handled.

Build status: ✓ | Lint: ✓ | Type-check: ✓ | Bundle (First Load JS): 103 kB shared + 2.4 kB feed route (budget <150 kB).

## Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-09-05 | Single shared password for admin (no OAuth) | User chose: "akun cuma punya saya, gk perlu login" |
| 2026-09-05 | Monochrome light theme (no accent) | User chose: "Instagram likes, putih/hitam, jangan warna menonjol" |
| 2026-09-05 | Masonry 3-col layout (not uniform grid) | "Sosmed-like" = asymmetric, dense |
| 2026-09-05 | No comment section | Earlier decision |
| 2026-09-05 | No user accounts | Earlier decision |
| 2026-09-05 | IP-hash for like/view (sha256 + SALT) | GDPR-friendly, no PII |
| 2026-09-05 | Admin password = `MyMinji@123` | User chose, accepted risk (also = DB password) |
| 2026-09-05 | Supabase project shared with LennMusic (`gufjubglnddginxqjdym`) | Same region, save setup |
| 2026-09-05 | Vercel Hobby hosting | Free, integrates with GitHub push |

## Blocked / waiting

- **Apply schema to Supabase**: needs user to run SQL via dashboard (or paste from `supabase/schema.sql` into SQL Editor). I cannot run SQL on Supabase directly from this VM.
- **Create storage bucket**: same as above (Storage → New bucket → covers).
- **Vercel project import**: after first push, user imports repo in Vercel dashboard.
- **Env vars on Vercel**: must be set in dashboard after import (not in `.env.local`).
- **First deploy**: after above 3, `git push` triggers build.

## Open questions (deferred)

- Custom domain? (`lenngram.lennmusic.web.id` vs `lenngram.com` vs `lenngram.vercel.app`)
- Featured projects — manual pin (`featured` boolean, current) or auto-sort by like count?
- Should admin see raw view count or "this week" only?
- Visitor "save" / bookmark (localStorage, no account) — future feature?

## Anti-patterns checklist (enforce in code review)

- [ ] No `@next/bundle-analyzer` in default build
- [ ] No `@sentry/nextjs` (DSN present but not configured)
- [ ] No ORM (Supabase JS client only)
- [ ] No automated UI tools (template generators, low-effort design tools)
- [ ] No accent color in components (gray only)
- [ ] No emoji in copy
- [ ] No shadow on cards (border + hover bg only)
- [ ] No Co-authored-by AI trailers in commits
- [ ] Author always `lenn0109 <lennlynx91@gmail.com>`
- [ ] Tailwind v3.4.17 only (not v4)
