# LennGram — Progress

> Phase tracker. Update after each milestone.

## Status

| Phase | Description | Status |
|---|---|---|
| 0 | Docs + Supabase schema | ✅ done |
| 1 | Scaffold Next.js 15 + Tailwind v3 | 🔄 in progress |
| 2 | Public feed (masonry) + project detail | ⏳ pending |
| 3 | Like (IP hash) + view counter API | ⏳ pending |
| 4 | Admin auth (password cookie) | ⏳ pending |
| 5 | Admin dashboard (CRUD + image upload) | ⏳ pending |
| 6 | Polish (empty states, SEO, OG) | ⏳ pending |
| 7 | Deploy (Vercel + Supabase) | ⏳ pending |

## Phase log

### 2026-09-05 — Phase 0: Docs + Schema

- ✅ Created repo `Lenn0109/LennGram` (public)
- ✅ 8 docs: README, CLAUDE, PRD, Architecture, Design, Animation, Schema, progress
- ✅ Schema designed: 3 tables (projects, project_likes, project_views) + 1 storage bucket (covers)
- ✅ RLS: public read published projects + public like/view + admin via service_role
- 🔄 Pending: apply schema to Supabase + create storage bucket
- 🔄 Pending: scaffold Next.js project

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
- [ ] No AI UI generators (21st.dev, v0, Galileo, Uizard)
- [ ] No accent color in components (gray only)
- [ ] No emoji in copy
- [ ] No shadow on cards (border + hover bg only)
- [ ] No Co-authored-by AI trailers in commits
- [ ] Author always `lenn0109 <lennlynx91@gmail.com>`
- [ ] Tailwind v3.4.17 only (not v4)
