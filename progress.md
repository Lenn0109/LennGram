# LennGram — Progress

> Phase tracker. Update after each milestone.

## Status

| Phase | Description | Status |
|---|---|---|
| 0 | Docs + Supabase schema | ✅ done |
| 1 | Scaffold Next.js 15 + Tailwind v3 | ✅ done |
| 2 | Public feed + project detail | ✅ done |
| 3 | Like (IP hash) + view counter API | ✅ done |
| 4 | Admin auth (password cookie) | ✅ done |
| 5 | Admin dashboard (CRUD + image upload) | ✅ done |
| 6 | Polish (empty states, SEO, OG) | ✅ done |
| 7 | UX Polish Iter 1-12 (IG-style redesign + Apple DNA) | ✅ done |
| 8 | UX Polish Iter 13-14 (Vercel design system + desktop layout) | ✅ done |
| 9 | Update docs (Apple DNA + Vercel tokens + 3-col desktop) | ✅ done |
| 10 | Deploy (Vercel + Supabase) | ⏳ pending env vars from user |

## Design decisions (2026-09-06)

| Decision | Rationale |
|---|---|
| Apple DNA + Vercel tokens | Premium feel: `#f5f5f7` sections, `#0071e3` accent, Geist font, shadow-as-border |
| Geist font | Vercel's typeface — geometric, compressed tracking, tabular nums |
| 3-col desktop (12-col grid) | Left nav sidebar + main feed + right profile sidebar fill the viewport |
| Shadow-as-border | Vercel pattern: `0 0 0 1px rgba(0,0,0,0.08)` — looks like border, lifts off page |
| Single blue accent `#0071e3` | Apple Blue — used only for links, active states, CTA |
| 8px spacing grid | Vercel standard — all spacing multiples of 8 |
| 3-weight type system (400/500/600) | Vercel discipline — no 700/bold anywhere |
| 64px hero billboard | Vercel-style display text with `tracking-display` (-0.05em) |

## Blocked / waiting

- **Apply schema to Supabase**: paste `supabase/schema.sql` to https://supabase.com/dashboard/project/gufjubglnddginxqjdym/sql/new
- **Create storage bucket**: Supabase → Storage → New bucket "covers", public ON
- **Vercel deploy**: set 7 env vars in Vercel dashboard
- **First deploy**: after schema + bucket + env vars, `git push` triggers build

## Open questions (deferred)

- Custom domain? (`lenngram.io` or `lenngram.vercel.app`)
- Featured projects — manual pin or auto-sort by like count?
- Visitor "save" / bookmark (localStorage) — future feature?
