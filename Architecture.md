# LennGram — Architecture

> System design + data flow. Read this before changing the schema,
> the Supabase client wiring, or the admin auth model.

## High-level diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        Vercel (Edge CDN)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Next.js 15 App Router (single app)             │   │
│  │                                                          │   │
│  │  ┌──────────┐   ┌──────────┐   ┌──────────────────┐   │   │
│  │  │ / (RSC)  │   │ /p/[slug]│   │ /admin/* (cookie)│   │   │
│  │  │ 3-col    │   │ Detail   │   │ Dashboard        │   │   │
│  │  │ 12-col   │   │ (anon)   │   │ (service_role)  │   │   │
│  │  └────┬─────┘   └────┬─────┘   └────────┬─────────┘   │   │
│  │       │              │                   │               │   │
│  │       │              │           ┌───────▼──────┐      │   │
│  │       │              │           │  middleware   │      │   │
│  │       │              │           │ cookie check  │      │   │
│  │       │              │           └───────┬──────┘      │   │
│  │       │              │                   │               │   │
│  │       ▼              ▼                   ▼               │   │
│  │  ┌──────────────────────────────────────────────┐      │   │
│  │  │         /api/like  /api/view  /api/admin/* │      │   │
│  │  └──────────────────────┬───────────────────────┘      │   │
│  └─────────────────────────┼─────────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────────┘
                             │ Supabase HTTP API
                             ▼
              ┌──────────────────────────────────┐
              │   Supabase (Singapore region)    │
              │                                  │
              │   ┌────────────┐ ┌────────────┐ │
              │   │ Postgres   │ │  Storage   │ │
              │   │ 3 tables  │ │  covers/   │ │
              │   │ RLS bypass│ │ public     │ │
              │   │ via service│ │ bucket     │ │
              │   └────────────┘ └────────────┘ │
              └──────────────────────────────────┘
```

## Tech layers

| Layer | Tech | Where |
|---|---|---|
| Edge CDN | Vercel | Vercel-managed |
| Framework | Next.js 15.5.24 (App Router) | `app/` |
| Rendering | Server Components (default) + Client Components (interactivity) | mixed |
| Styling | Tailwind 3.4.17 + Apple DNA + Vercel tokens | `app/globals.css`, `tailwind.config.ts` |
| Fonts | Geist (next/font/google) + Geist Mono | `app/layout.tsx` |
| DB client | `@supabase/supabase-js` 2.49.4 + `@supabase/ssr` 0.6.1 | `lib/supabase/` |
| Cookie session | httpOnly cookie + HMAC-SHA256 signature | `lib/auth.ts` |
| IP hashing | `node:crypto` sha256 with `LIKES_SALT` env | `lib/ip-hash.ts` |
| Image upload | Supabase Storage REST API | `lib/supabase/server.ts` |

## Data flow

### Public visitor → Feed

```
[Visitor browser]
  GET /
    ↓ (Vercel edge cache, if configured)
[RSC: server fetch feed]
  createBrowserClient(URL, ANON_KEY)  ← reads NEXT_PUBLIC_*
    ↓
  supabase.from('projects')
    .select('*, project_likes(count)')
    .eq('status', 'published')
    .order('featured', desc)
    .order('display_order', asc)
    .order('created_at', desc)
    ↓
[Supabase Postgres] (anon key, RLS enforces status='published')
    ↓
[RSC renders 3-col grid layout with sidebars]
  ↓
HTML to browser
```

### Visitor → Like

```
[Visitor clicks heart on card]
  POST /api/like  { projectId }
    ↓
[Next.js route handler (edge runtime)]
  req.headers.get('x-forwarded-for')  ← Vercel injects client IP
    ↓
  hash = sha256(IP + LIKES_SALT)
    ↓
  Rate limit: count(likes) by hash in last hour, max 10
    ↓
  createServerClient(URL, ANON_KEY)  ← still anon for like (public write)
    ↓
  upsert(project_likes { project_id, ip_hash: hash })
    ↓
[Supabase] (RLS: public insert on project_likes)
    ↓
200 OK { liked: true, totalLikes: N+1 }
    ↓
[Browser optimistic UI: heart fills, count increments]
```

### Visitor → Project detail

```
GET /p/[slug]
  ↓
[RSC: server fetch project by slug]
  supabase.from('projects').select('*').eq('slug', params.slug).single()
    ↓
[RSC: render detail page with sticky cover + markdown + comments]
  ↓
[Client component: <ViewTracker projectId={...} />]
  useEffect(() => {
    fetch('/api/view', { method: 'POST', body: { projectId } })
  }, [])
    ↓
[/api/view handler]
  hash = sha256(IP + SALT)
  insert(project_views { project_id, ip_hash, viewed_at })
    ↓
200 OK (no body needed)
```

### Admin login

```
[Owner types password at /admin/login]
  POST /api/admin/login  { password }
    ↓
[Route handler]
  if (sha256(password) === sha256(env.ADMIN_PASSWORD))  ← constant-time compare
    ↓
  setCookie('lenngram_admin', hmacSign(timestamp + ':' + passwordHash, COOKIE_SECRET), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
    ↓
  200 OK → redirect to /admin
```

### Admin → CRUD project

```
GET /admin
  ↓
[middleware.ts runs first]
  if (!hasValidAdminCookie(req)) return NextResponse.redirect('/admin/login')
    ↓
[RSC: list projects]
  createServerClient(URL, SERVICE_KEY)  ← service role, bypasses RLS
    ↓
  supabase.from('projects').select('*').order('updated_at', desc)
    ↓
[Render <AdminList /> table]

POST /api/admin/projects  (create or update)
  ↓
[middleware: requires admin cookie]
  ↓
[Route handler with service role client]
  parse body, validate with zod
  insert/update project row
  return JSON { id, slug, ... }
  ↓
[Browser redirect to /admin or toast]
```

### Admin → Image upload

```
[Owner selects file in form]
  POST /api/admin/upload  (multipart/form-data)
    ↓
[middleware: requires admin cookie]
  ↓
[Route handler]
  parse formdata, validate (mime, size)
  generate filename: `${crypto.randomUUID()}.${ext}`
  upload to Supabase Storage: bucket='covers', path=`${filename}`
  return { publicUrl: 'https://<ref>.supabase.co/storage/v1/object/public/covers/...' }
  ↓
[Form shows preview, sets cover_url in form state]
```

## Environment model

```ts
// .env.local (gitignored)
NEXT_PUBLIC_SUPABASE_URL=https://gufjubglnddginxqjdym.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  // SERVER ONLY, never NEXT_PUBLIC_
ADMIN_PASSWORD=MyMinji@123
LIKES_SALT=<32+ char random>
COOKIE_SECRET=<32+ char random>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Var | Public? | Used by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes (in client bundle) | browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | browser + server (anon queries) |
| `SUPABASE_SERVICE_ROLE_KEY` | **no** (server only) | `/api/admin/*`, `/admin/*` server components |
| `ADMIN_PASSWORD` | **no** | `/api/admin/login` only |
| `LIKES_SALT` | **no** | `/api/like`, `/api/view` only |
| `COOKIE_SECRET` | **no** | `lib/auth.ts` (HMAC signing) |
| `NEXT_PUBLIC_SITE_URL` | yes | OG meta, sitemap, robots |

## Security model

### Visitor trust
- Can read published projects (anon key + RLS)
- Can like/view (anon key + RLS, IP-hashed)
- **Cannot** read draft projects (RLS `status='published'`)
- **Cannot** access `/admin/*` (middleware redirects to login, returns 404 if no auth)

### Admin trust
- Single shared password (`ADMIN_PASSWORD`)
- Cookie session: httpOnly + sameSite=lax + HMAC-signed
- Service role key (bypasses RLS, full DB access)
- **Threat**: shared password leak = full admin + DB access (user accepted this trade-off)

### Defense in depth
- Middleware: cookie check BEFORE route renders
- API routes: re-check cookie in each handler
- Supabase RLS: anon key has only `select published` and `insert likes/views`
- Service role key: NEVER exposed to client, NEVER prefixed with `NEXT_PUBLIC_`
- IP hashing: raw IP never stored, GDPR-friendly

## Deployment pipeline

```
git push origin main
  ↓
[Vercel GitHub integration]
  → clone repo, install deps
  → next build (cloud-side, t3.micro constraint N/A)
  → upload edge functions + static assets
  → assign preview URL
  → if main branch: assign production URL
  → set env vars from Vercel dashboard (not from .env)
  ↓
[Live at lenngram.vercel.app or custom domain]
```

## Performance budget

- **LCP**: <1.5s (Vercel edge + Supabase Singapore)
- **First Load JS**: <150 KB per route (gated by manual review)
- **Cover images**: <300 KB each, served as `next/image` with `sizes` prop
- **DB queries**: all feed/detail queries under 100ms (indexed on `status`, `featured`, `display_order`, `created_at`)
- **Cold start**: Vercel functions ~300ms first request, ~50ms subsequent

## Failure modes

| Failure | User-visible | Server behavior |
|---|---|---|
| Supabase down | Feed shows error state, link to retry | API returns 503 |
| Storage down | Cover images broken, fallback to OG default | `/api/admin/upload` returns 503 |
| Vercel deploy fail | Site unchanged from last successful deploy | Vercel rolls back automatically |
| IP rate limit exceeded | Like button shows "try again later" | 429 with Retry-After header |
| Admin password wrong | Login form shows "invalid password" | 401, no hint (no enumeration) |
| Admin cookie expired | Redirect to `/admin/login` | 302 to login |
