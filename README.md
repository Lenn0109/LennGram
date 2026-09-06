# LennGram

> **Project portfolio by [lenn0109](https://github.com/lenn0109).**
> Styled like a social media feed — scroll, not read.

LennGram is a personal project portfolio. Visitors browse projects in an
Instagram-style feed; the owner (lenn0109) manages content from a hidden
admin dashboard. No user accounts, no signup.

## Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router) + React 19.1.0
- **Styling**: Tailwind CSS 3.4.17 + Apple DNA + Vercel tokens
- **Fonts**: Geist (next/font/google) — compressed tracking, tabular nums
- **DB / Storage**: [Supabase](https://supabase.com) (Postgres + Storage)
- **Hosting**: [Vercel](https://vercel.com) Hobby (free)
- **Auth**: Shared password (env var) — no OAuth, no visitor auth

## Features

- **Public feed** at `/` — 3-col desktop / single-col mobile, project cards
- **Project detail** at `/p/[slug]` — full description, sticky cover, comments
- **Profile page** at `/you` — liked/saved thumbnail strips, personal hero
- **Like** by IP (hashed, no PII) — anonymous, rate-limited
- **View counter** — anonymous, by hashed IP
- **Admin dashboard** at `/admin` — CRUD projects + cover image upload
- **No visitor auth** — admin gated by single shared password

## Quick Start

```bash
git clone https://github.com/Lenn0109/LennGram.git
cd LennGram
npm install
cp .env.local.example .env.local   # fill in values
npm run dev
# Open http://localhost:3000
```

## Dev without Supabase

If you skip Supabase env vars, the app falls back to a mock dataset
(5 projects) so you can still click through the public UI locally.
Likes/views return success stubs but don't persist. Fill in the env vars
for real data.

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

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Do not commit `.env.local`.

## Build

```bash
npm run build   # production build
npm run start   # serve production build
```

## Deploy to Vercel

1. Push to GitHub (already done).
2. Import `Lenn0109/LennGram` in [Vercel dashboard](https://vercel.com/new).
3. Set all 7 env vars in Vercel → Settings → Environment Variables.
4. Vercel auto-builds + deploys on every push to `main`.
5. (Optional) Add custom domain in Vercel → Domains.

## Database setup (one-time)

Apply schema:

1. Supabase dashboard → SQL Editor → paste `supabase/schema.sql` → Run

Create Storage bucket:

1. Supabase dashboard → Storage → New bucket
2. Name: `covers`
3. Public bucket: ON
4. File size limit: 5 MB
5. Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

## Admin access

1. Navigate to `/admin/login`.
2. Enter `ADMIN_PASSWORD` value.
3. Session cookie valid for 7 days. Click "Logout" to clear.

## Design system

The visual language is **Apple DNA + Vercel token discipline**:
- Apple color palette (`#f5f5f7` muted, `#0071e3` accent)
- Vercel typography (Geist, compressed tracking, tabular nums)
- Shadow-as-border pattern (`0 0 0 1px rgba(0,0,0,0.08)`)
- 8px spacing grid

See [`Design.md`](./Design.md) for the full design system.
See [`Architecture.md`](./Architecture.md) for data flow + tech choices.
See [`Schema.md`](./Schema.md) for DB schema + RLS policies.
See [`progress.md`](./progress.md) for current phase + roadmap.

## License

[MIT](./LICENSE) © Lenn0109
