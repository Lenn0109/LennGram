# LennGram

> **Project showcase by [lenn0109](https://github.com/Lenn0109).**
> Handmade, monochrome.

LennGram is a personal project portfolio styled like a social media feed.
Visitors browse projects in a masonry grid; the owner (lenn0109) curates
from a hidden admin dashboard. No user accounts, no comments, no signup.

## Stack

- **Framework**: [Next.js 15.5.24](https://nextjs.org) (App Router) + React 19.1.0
- **Styling**: Tailwind CSS 3.4.17 + custom monochrome design tokens
- **DB / Storage**: [Supabase](https://supabase.com) (Postgres + Storage)
- **Hosting**: [Vercel](https://vercel.com) Hobby (free)
- **Auth**: Shared password (env var) — no OAuth, no email signup

## Features

- **Public feed** at `/` — masonry grid of project cards
- **Project detail** at `/p/[slug]` — full description, screenshots, links
- **Like** by IP (hashed, no PII) — anonymous, rate-limited
- **View counter** — anonymous, by hashed IP
- **Admin dashboard** at `/admin` — CRUD projects + upload cover images
- **No login** — admin gated by single shared password (no auth UI for visitors)

## Quick Start

```bash
git clone https://github.com/Lenn0109/LennGram.git
cd LennGram

# Install deps
npm install

# Copy env template, fill in values (see "Environment" below)
cp .env.local.example .env.local

# Run dev server (works without Supabase — see "Dev without Supabase" below)
npm run dev
# Open http://localhost:3000
```

## Dev without Supabase

If you skip filling in Supabase env vars, the app falls back to a small
mock dataset (5 projects) so you can still click through the public UI
locally. Likes/views/admin writes return success stubs but do not
persist anywhere. Fill in the env vars for real data.

## Environment

| Var | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | for real data | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for real data | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Supabase service role key — bypasses RLS, used by `/admin` |
| `ADMIN_PASSWORD` | yes for admin | Shared password to access `/admin` |
| `LIKES_SALT` | yes for likes/views | Random 32+ char string — mixed with IP before hashing |
| `COOKIE_SECRET` | yes for admin | Random 32+ char string — HMAC secret for the admin session cookie |
| `NEXT_PUBLIC_SITE_URL` | for SEO | Public URL (e.g. `https://lenngram.vercel.app`) |

Generate the secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy values from `.env.local.example` and fill in. Do not commit `.env.local`.

## Build

```bash
npm run build   # production build (next build)
npm run start   # serve production build
```

## Deploy to Vercel

1. Push to GitHub (already done).
2. Import `Lenn0109/LennGram` in [Vercel dashboard](https://vercel.com/new).
3. Set all 7 env vars from the table above (Vercel → Settings → Environment Variables).
4. Vercel auto-builds + deploys on every push to `main`.
5. (Optional) Add custom domain in Vercel → Domains.

## Database setup (one-time)

Apply schema:

```bash
# In Supabase dashboard: SQL Editor → paste supabase/schema.sql → Run
```

Create Storage bucket:

1. Supabase dashboard → Storage → New bucket
2. Name: `covers`
3. Public bucket: ON
4. File size limit: 5 MB
5. Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

## Admin access

1. Navigate to `/admin/login` (Vercel URL or `localhost:3000`).
2. Enter `ADMIN_PASSWORD` value.
3. Session cookie valid for 7 days. Click "Logout" in top bar to clear.

## Architecture

See [`Architecture.md`](./Architecture.md) for data flow + tech choices.
See [`Schema.md`](./Schema.md) for DB schema + RLS policies.
See [`Design.md`](./Design.md) for visual system + tokens.

## Status

See [`progress.md`](./progress.md) for current phase + roadmap.

## License

[MIT](./LICENSE) © Lenn0109
