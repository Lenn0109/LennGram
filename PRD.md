# LennGram — Product Requirements Document

> Version 0.1 · 2026-09-05 · Author: lenn0109

## 1. Problem

A personal portfolio site that is:
- **Visually striking** enough to hold attention for ≥3 seconds (random visitor)
- **Information-dense** enough to convey skills (HRD)
- **Approachable** enough to feel personal (friends)

Existing portfolio templates are either:
- Generic SaaS landing pages (boring, identical)
- Heavy design systems (Vercel/Linear clones — overclaimed, looks AI)
- Static MD-based (GitHub README style — no visual hook)

LennGram resolves this by treating the portfolio as a **feed**, not a
landing page. Visitors scroll instead of read.

## 2. Goals (success criteria)

| Goal | Metric | Target |
|---|---|---|
| HRD can find tech stack in ≤10s | time-to-first-tech-tag | <10s |
| Visitor scrolls ≥3 cards | scroll depth | ≥3 cards |
| Admin can publish new project in ≤2 min | time-to-publish | <2 min |
| Site loads in <2s on 3G | LCP p75 | <2s |
| Zero auth/account friction for visitors | login screens shown to visitors | 0 |

## 3. User personas

### 3.1 HRD / Recruiter
- **Goal**: assess candidate fit in 30 seconds
- **Pain point**: most portfolios hide tech stack behind "About" page
- **Need**: tech tags visible on every card, repo link 1 click away

### 3.2 Friend / acquaintance
- **Goal**: see what lenn0109 is building recently
- **Pain point**: stiff "Welcome to my portfolio" pages
- **Need**: visual feed, like a friend's Instagram

### 3.3 Random visitor (e.g. from Twitter/Reddit)
- **Goal**: get a vibe in 5 seconds
- **Pain point**: slow, generic, AI-flavored sites
- **Need**: instant visual hook, monochrome aesthetic, no fluff

### 3.4 Owner (lenn0109) — admin
- **Goal**: publish a new project in 2 minutes from any device
- **Pain point**: CMS systems are overkill; Supabase dashboard is too raw
- **Need**: simple CRUD UI with cover image upload

## 4. Features (MVP scope)

### 4.1 Public feed (`/`)
- Masonry grid, 3 columns desktop, 2 tablet, 1 mobile
- Sort: pinned first, then `display_order`, then `created_at DESC`
- Each card: cover image, title, tech tags, like count
- Infinite scroll (cursor pagination, 12 per page)
- Filter by tech stack (top-of-page chip row)

### 4.2 Project detail (`/p/[slug]`)
- 2-col layout: cover sticky left, content right
- Markdown-rendered description
- Tech tags, repo link, demo link, like button
- View counter (incremented once per IP per session)

### 4.3 Like (anonymous)
- Heart icon, optimistic UI
- POST `/api/like` with `projectId`
- Server: hash IP, upsert `(project_id, ip_hash)` row
- Rate limit: 10 likes/IP/hour (server-side check)

### 4.4 View counter (anonymous)
- POST `/api/view` on detail page load
- Server: hash IP, insert `(project_id, ip_hash, viewed_at)` (no unique constraint — view count = `count(distinct ip_hash)` over 24h)
- Counter shown: "viewed by N people this week"

### 4.5 Admin login (`/admin/login`)
- Single password field
- POST to API route, compare with `ADMIN_PASSWORD` env var (constant-time)
- On success: set httpOnly cookie signed with HMAC-SHA256
- Cookie: `lenngram_admin`, 7 days, sameSite=lax, secure (prod)
- On failure: 401, generic "invalid password" message

### 4.6 Admin dashboard (`/admin`)
- Project list (table): cover thumb, title, status, like count, created_at
- Actions: New, Edit, Delete
- Filter: status (all / published / draft)

### 4.7 Admin project form (`/admin/new`, `/admin/[id]`)
- Fields:
  - `title` (text, required, max 100 char)
  - `slug` (auto-generated from title, editable, URL-safe)
  - `description` (markdown textarea, required)
  - `cover_url` (image upload to Supabase Storage → returns public URL)
  - `repo_url` (URL, optional)
  - `demo_url` (URL, optional)
  - `tech_stack` (tag input, comma-separated, max 10)
  - `status` (select: draft / published)
  - `featured` (checkbox, pinned to top of feed)
  - `display_order` (number, lower = higher in feed)
- Save: POST to API route (server-side service_role key)
- Image upload: drag-drop, preview, max 5 MB, jpg/png/webp

### 4.8 SEO
- Per-project OG image (use `cover_url` as fallback, or `/og.png` default)
- Per-project `<title>` and `<meta description>` from project fields
- `sitemap.xml` listing all published projects
- `robots.txt` allowing all

## 5. Non-goals (out of scope for MVP)

- ❌ User accounts / OAuth
- ❌ Comment system
- ❌ Search (full-text)
- ❌ Email notifications
- ❌ Analytics (PostHog, Plausible)
- ❌ RSS feed
- ❌ Dark mode (light only)
- ❌ i18n (Indonesian first; English OK)
- ❌ Animations beyond hover/subtle
- ❌ Visitor profile pages

## 6. Tech stack rationale

| Choice | Why |
|---|---|
| **Next.js 15 App Router** | Server components default = less JS shipped; static + serverless friendly |
| **React 19.1.0** | Pinned to match Next 15.5 (not 19.2 which is Next 16) |
| **Tailwind v3.4.17** | Lighter build than v4; stable, well-documented |
| **Supabase** | Same project as LennMusic; reusing DB/Storage saves setup; generous free tier |
| **Vercel Hobby** | Free, integrates with GitHub push, edge CDN, 100GB bandwidth |
| **No ORM** | Supabase JS client + RLS = no schema duplication |
| **No Sentry/PostHog** | Out of scope per PRD; Vercel handles runtime errors |
| **shadcn primitives** (manual) | Handmade copy of source, written by humans |
| **JetBrains Mono** (font) | For tech tags; matches "indie dev" aesthetic |

## 7. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| `ADMIN_PASSWORD` leaks (already in chat) | high | Rotate both DB + admin password together if compromised |
| Supabase Storage abuse (anon upload) | low | Upload endpoint requires admin cookie; not public |
| IP-hash collision allowing double-like | very low | sha256(ip + SALT) collision rate ≈ 0 for any practical scale |
| Vercel build OOM (free tier RAM cap) | medium | Pin deps, no bundle-analyzer, no source-map upload |
| Visitor bypasses admin by guessing URL | medium | `/admin` returns 404 (not 401) to obscure existence |
| Cover image EXIF data leak | low | `next/image` strips EXIF by default |

## 8. Open questions

- Custom domain? (lenngram.lennmusic.web.id vs lenngram.com)
- Should admin see raw view count, or weekly?
- Featured projects — manual pin or auto (by like count)?
- Future: visitor "save" / bookmark (localStorage, no account)?

## 9. Timeline

| Phase | Deliverable | Est. |
|---|---|---|
| 0 | Scaffold + Supabase schema | 1 hr |
| 1 | Public feed + detail page | 2 hr |
| 2 | Like + view API | 1 hr |
| 3 | Admin auth + dashboard list | 2 hr |
| 4 | Admin project form + image upload | 2 hr |
| 5 | Polish + SEO + deploy | 1 hr |
| **Total** | | **~9 hr** |
