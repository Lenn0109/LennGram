# LennGram — Product Requirements Document

> Version 0.2 · 2026-09-06 · Author: lenn0109

## 1. Problem

A personal portfolio site that is:
- **Visually premium** enough to hold attention (HRD + random visitor)
- **Information-dense** enough to convey skills (HRD)
- **Approachable** enough to feel personal (friends)

Existing portfolio templates are either:
- Generic SaaS landing pages (boring, identical)
- Heavy design systems (Vercel/Linear clones — overclaimed, looks AI)
- Static MD-based (GitHub README style — no visual hook)

LennGram resolves this with a **social feed** format: visitors scroll instead of read,
and a **premium aesthetic** (Apple DNA + Vercel tokens) that signals taste without trying too hard.

## 2. Goals (success criteria)

| Goal | Metric | Target |
|---|---|---|
| HRD can find tech stack in ≤10s | time-to-first-tech-tag | <10s |
| Visitor scrolls ≥3 cards | scroll depth | ≥3 cards |
| Admin can publish new project in ≤2 min | time-to-publish | <2 min |
| Site loads in <2s on 3G | LCP p75 | <2s |
| Zero auth/account friction for visitors | login screens shown to visitors | 0 |

## 3. User personas

### HRD / Recruiter
- **Goal**: assess candidate fit in 30 seconds
- **Pain point**: most portfolios hide tech stack behind "About" page
- **Need**: tech tags visible on every card, repo link 1 click away

### Friend / acquaintance
- **Goal**: see what lenn0109 is building recently
- **Pain point**: stiff "Welcome to my portfolio" pages
- **Need**: visual feed, like a friend's Instagram

### Random visitor (e.g. from Twitter/Reddit)
- **Goal**: get a vibe in 5 seconds
- **Pain point**: slow, generic, AI-flavored sites
- **Need**: instant visual hook, premium aesthetic, no fluff

### Owner (lenn0109) — admin
- **Goal**: publish a new project in 2 minutes from any device
- **Pain point**: CMS systems are overkill; Supabase dashboard is too raw
- **Need**: simple CRUD UI with cover image upload

## 4. Features (MVP scope)

### 4.1 Public feed (`/`)
- **Desktop**: 3-column grid (12-col CSS Grid: left nav 2, feed 7, right sidebar 3)
- **Mobile**: single column, bottom nav (Home/Liked/Saved/You)
- **Tablet**: 2-column, no sidebars
- Sort: pinned first, then `display_order`, then `created_at DESC`
- Each card: CoverArt monogram, title, tech tags, like count
- Filter by tech stack (top-of-page pill row)
- StoryStrip: circular project avatars (60×60px) above feed
- Suggestions: "You might like" section below feed

### 4.2 Project detail (`/p/[slug]`)
- 2-col layout: cover sticky left (5/12), content right (7/12)
- Mobile: 1-col, cover full-width on top
- Markdown-rendered description
- Tech tags, repo link, demo link, like button
- View counter (incremented once per IP per session)
- Comments section (mock seeded, no auth)

### 4.3 /you profile page
- Single column
- Hero: avatar + "lenn0109" at 64px display + tagline
- PreviewStrip: thumbnail grids for Liked + Saved sections
- CTA: "View work" pill + GitHub/Email icon buttons

### 4.4 Like (anonymous)
- Heart icon, optimistic UI
- POST `/api/like` with `projectId`
- Server: hash IP, upsert `(project_id, ip_hash)` row
- Rate limit: 10 likes/IP/hour (server-side check)

### 4.5 View counter (anonymous)
- POST `/api/view` on detail page load
- Server: hash IP, insert `(project_id, ip_hash, viewed_at)`
- Counter shown: "viewed by N people this week"

### 4.6 Admin login (`/admin/login`)
- Single password field
- POST to API route, compare with `ADMIN_PASSWORD` env var
- On success: set httpOnly cookie signed with HMAC-SHA256
- Cookie: `lenngram_admin`, 7 days, sameSite=lax, secure (prod)

### 4.7 Admin dashboard (`/admin`)
- Project list (table): cover thumb, title, status, like count, created_at
- Actions: New, Edit, Delete
- Filter: status (all / published / draft)

### 4.8 Admin project form (`/admin/new`, `/admin/[id]`)
- Fields: title, slug (auto), description (markdown), cover_url, repo_url, demo_url, tech_stack, status, featured, display_order
- Image upload: drag-drop, preview, max 5 MB, jpg/png/webp

### 4.9 SEO
- Per-project OG image
- Per-project `<title>` and `<meta description>`
- `sitemap.xml` listing all published projects
- `robots.txt` allowing all

## 5. Non-goals (out of scope)

- ❌ User accounts / OAuth
- ❌ Comment system (display only, no auth)
- ❌ Search (full-text)
- ❌ Email notifications
- ❌ Analytics (PostHog, Plausible)
- ❌ RSS feed
- ❌ Dark mode (light only)
- ❌ i18n (English only)
- ❌ Animations beyond hover/subtle
- ❌ Visitor profile pages

## 6. Tech stack

| Choice | Why |
|---|---|
| **Next.js 15 App Router** | Server components default = less JS shipped; static + serverless friendly |
| **React 19.1.0** | Pinned to match Next 15.5 (not 19.2 which is Next 16) |
| **Tailwind v3.4.17** | Lighter build than v4; stable, well-documented |
| **Geist font** | Vercel's typeface — geometric, compressed tracking, tabular nums |
| **Supabase** | Same project as LennMusic; reusing DB/Storage; generous free tier |
| **Vercel Hobby** | Free, integrates with GitHub push, edge CDN |
| **No ORM** | Supabase JS client + RLS = no schema duplication |
| **No Sentry/PostHog** | Out of scope per PRD; Vercel handles runtime errors |
| **shadcn primitives** (manual) | Handmade copy of source, written by humans |

## 7. Design system

See [`Design.md`](./Design.md) for full visual spec.

Visual language: **Apple DNA + Vercel token discipline**
- Apple color palette: `#f5f5f7` muted sections, `#0071e3` single blue accent
- Vercel typography: Geist font, compressed tracking scale, tabular nums
- Shadow-as-border: `0 0 0 1px rgba(0,0,0,0.08)` — looks like border, lifts off page
- 8px spacing grid
- 3-weight type system (400/500/600 only)

## 8. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| `ADMIN_PASSWORD` leaks | high | Rotate both DB + admin password together if compromised |
| Supabase Storage abuse (anon upload) | low | Upload endpoint requires admin cookie; not public |
| IP-hash collision allowing double-like | very low | sha256(ip + SALT) collision rate ≈ 0 for any practical scale |
| Vercel build OOM (free tier RAM cap) | medium | Pin deps, no bundle-analyzer, no source-map upload |
| Visitor bypasses admin by guessing URL | medium | `/admin` returns 404 (not 401) to obscure existence |
| Cover image EXIF data leak | low | `next/image` strips EXIF by default |
