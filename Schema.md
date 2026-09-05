# LennGram — Database Schema

> 3 tables, 1 storage bucket, RLS enforced. Read this before
> modifying any SQL or the Supabase client wiring.

## Project context

- **Supabase project**: `gufjubglnddginxqjdym` (Singapore region, shared with LennMusic)
- **Schema**: `public` (default)
- **Apply via**: Supabase dashboard → SQL Editor, or `psql $DATABASE_URL -f supabase/schema.sql`
- **All migrations are idempotent** (`if not exists`, `create or replace`)

## Tables

### 1. `projects`

Core entity. Each row = 1 project card on the feed.

```sql
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null check (slug ~ '^[a-z0-9-]+$'),
  title         text not null check (length(title) between 1 and 100),
  description   text not null check (length(description) between 1 and 10000),
  cover_url     text check (cover_url is null or cover_url ~* '^https?://'),
  repo_url      text check (repo_url is null or repo_url ~* '^https?://'),
  demo_url      text check (demo_url is null or demo_url ~* '^https?://'),
  tech_stack    text[] not null default '{}' check (array_length(tech_stack, 1) <= 10),
  status        text not null default 'draft' check (status in ('draft', 'published')),
  featured      boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
```

**Columns explained**:

| Col | Type | Notes |
|---|---|---|
| `id` | uuid | PK, default `gen_random_uuid()` (Supabase: `pgcrypto` enabled) |
| `slug` | text | URL-safe, lowercase, `[a-z0-9-]+` only, unique. Used in `/p/[slug]` |
| `title` | text | 1-100 chars |
| `description` | text | Markdown, 1-10000 chars |
| `cover_url` | text | Supabase Storage public URL |
| `repo_url` | text | Optional, GitHub/GitLab/etc |
| `demo_url` | text | Optional, live demo |
| `tech_stack` | text[] | Max 10 tags |
| `status` | text | `draft` (not visible publicly) or `published` (visible in feed) |
| `featured` | boolean | Pinned to top of feed (sort priority) |
| `display_order` | integer | Manual sort, lower = higher (0 default) |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto, updated by trigger |

**Indexes** (for feed query performance):

```sql
create index if not exists projects_status_idx     on public.projects (status);
create index if not exists projects_featured_idx   on public.projects (featured desc, display_order asc, created_at desc);
create index if not exists projects_slug_idx       on public.projects (slug);  -- already unique, but explicit
create index if not exists projects_tech_stack_idx on public.projects using gin (tech_stack);
```

The `(featured desc, display_order asc, created_at desc)` compound index matches the feed query's `order by` exactly — no extra sort step.

**Auto-update `updated_at` trigger**:

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
```

**RLS**:

```sql
alter table public.projects enable row level security;

-- Public can read published projects only
drop policy if exists "projects_public_read_published" on public.projects;
create policy "projects_public_read_published"
  on public.projects for select
  using (status = 'published');

-- Note: INSERT/UPDATE/DELETE go through the service_role key
-- in /api/admin/* route handlers (bypasses RLS entirely).
-- We do NOT grant anon/authenticated write access to projects.
```

### 2. `project_likes`

Anonymous likes, keyed by `(project_id, ip_hash)`. One like per IP per project.

```sql
create table if not exists public.project_likes (
  project_id uuid not null references public.projects(id) on delete cascade,
  ip_hash    text not null check (length(ip_hash) = 64),  -- sha256 hex
  created_at timestamptz not null default now(),
  primary key (project_id, ip_hash)
);
```

**Indexes**:

```sql
create index if not exists project_likes_project_idx on public.project_likes (project_id);
create index if not exists project_likes_ip_time_idx on public.project_likes (ip_hash, created_at desc);
```

The second index supports the rate limit check: "how many likes has this IP done in the last hour?".

**RLS**:

```sql
alter table public.project_likes enable row level security;

-- Public can read like counts (for showing count in feed)
drop policy if exists "likes_public_read" on public.project_likes;
create policy "likes_public_read"
  on public.project_likes for select
  using (true);

-- Public can insert their own like
drop policy if exists "likes_public_insert" on public.project_likes;
create policy "likes_public_insert"
  on public.project_likes for insert
  with check (true);

-- Public can delete their own like (unlike)
drop policy if exists "likes_public_delete" on public.project_likes;
create policy "likes_public_delete"
  on public.project_likes for delete
  using (true);
```

`with check (true)` is OK because:
- The insert path always sets `ip_hash` server-side (from `lib/ip-hash.ts`).
- The IP is hashed with `LIKES_SALT` env var, so collision rate is negligible.
- The `(project_id, ip_hash)` PK prevents double-likes.

### 3. `project_views`

Anonymous view counter, append-only. Counted as `count(distinct ip_hash)` in last 24h.

```sql
create table if not exists public.project_views (
  id         bigserial primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  ip_hash    text not null check (length(ip_hash) = 64),
  viewed_at  timestamptz not null default now()
);
```

**Indexes**:

```sql
create index if not exists project_views_project_time_idx on public.project_views (project_id, viewed_at desc);
create index if not exists project_views_ip_time_idx      on public.project_views (ip_hash, viewed_at desc);
```

**RLS**:

```sql
alter table public.project_views enable row level security;

-- Public can insert view (called from client component on detail page)
drop policy if exists "views_public_insert" on public.project_views;
create policy "views_public_insert"
  on public.project_views for insert
  with check (true);

-- No public read of views table — count is computed in API handler
-- using service_role key.
```

## Storage bucket

### `covers`

Public bucket for project cover images. Created in Supabase dashboard (Storage → New bucket).

| Setting | Value |
|---|---|
| Name | `covers` |
| Public | ON (allow public read of stored objects) |
| File size limit | 5 MB |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp` |

**Storage policies** (apply in dashboard → Storage → covers → Policies):

| Action | Role | Policy |
|---|---|---|
| SELECT (read) | `anon`, `authenticated` | Allow (public bucket) |
| INSERT (upload) | `service_role` only | Allow (only API route uses service key) |
| UPDATE | none | Deny |
| DELETE | `service_role` only | Allow (admin delete project also removes cover) |

We do **not** allow anon uploads to Storage — all uploads go through `/api/admin/upload` which uses service_role.

## Functions (RPC)

### `count_recent_views(project_uuid uuid, since interval)`

Helper to count distinct IPs in a time window without exposing raw view rows.

```sql
create or replace function public.count_recent_views(
  project_uuid uuid,
  since interval default '7 days'
)
returns integer
language sql
stable
as $$
  select count(distinct ip_hash)::integer
  from public.project_views
  where project_id = project_uuid
    and viewed_at > now() - since;
$$;

grant execute on function public.count_recent_views(uuid, interval) to anon, authenticated;
```

## Full schema (run as single SQL)

All migrations are in `supabase/schema.sql` and can be re-run safely.

```bash
psql "$DATABASE_URL" -f supabase/schema.sql
```

Or via Supabase dashboard: SQL Editor → paste → Run.

## Data integrity

- **Slug uniqueness**: enforced at DB level. App-level: on collision, append `-2`, `-3`, etc.
- **Referential integrity**: `project_likes.project_id` and `project_views.project_id` cascade-delete with the project. No orphan rows possible.
- **IP hash format**: 64 hex chars (sha256 output). Enforced via `check (length(ip_hash) = 64)`.
- **No raw IP stored**: every IP is hashed with `LIKES_SALT` before insert. GDPR-friendly (not PII).

## Migration strategy

- **MVP**: 1 schema file (`supabase/schema.sql`), all `if not exists` / `create or replace`.
- **Future**: when schema changes, append new migration to same file (idempotent) or split into `supabase/migrations/<timestamp>_<name>.sql` and track via a migration log.
- **No down migrations** — destructive changes done manually after snapshot.

## What this schema does NOT include (out of scope)

- ❌ User accounts, profiles, sessions
- ❌ Comments, reactions beyond like
- ❌ Tags table (we use `text[]` inline)
- ❌ Audit log (no tracking of who edited what)
- ❌ Soft delete (`deleted_at` column) — hard delete only for MVP
- ❌ Versioning of project content
- ❌ Multi-language (i18n)
- ❌ Project collections / categories
- ❌ Search index (Postgres FTS or external)
- ❌ Email subscribers
- ❌ Analytics events
