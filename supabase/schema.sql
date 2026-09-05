-- LennGram — Database Schema
-- Idempotent: safe to re-run. Apply via Supabase dashboard SQL Editor
-- or `psql "$DATABASE_URL" -f supabase/schema.sql`

-- ============================================================================
-- 1. projects
-- ============================================================================

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

create index if not exists projects_status_idx     on public.projects (status);
create index if not exists projects_featured_idx   on public.projects (featured desc, display_order asc, created_at desc);
create index if not exists projects_slug_idx       on public.projects (slug);
create index if not exists projects_tech_stack_idx on public.projects using gin (tech_stack);

-- ============================================================================
-- 2. project_likes
-- ============================================================================

create table if not exists public.project_likes (
  project_id uuid not null references public.projects(id) on delete cascade,
  ip_hash    text not null check (length(ip_hash) = 64),
  created_at timestamptz not null default now(),
  primary key (project_id, ip_hash)
);

create index if not exists project_likes_project_idx  on public.project_likes (project_id);
create index if not exists project_likes_ip_time_idx  on public.project_likes (ip_hash, created_at desc);

-- ============================================================================
-- 3. project_views
-- ============================================================================

create table if not exists public.project_views (
  id         bigserial primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  ip_hash    text not null check (length(ip_hash) = 64),
  viewed_at  timestamptz not null default now()
);

create index if not exists project_views_project_time_idx on public.project_views (project_id, viewed_at desc);
create index if not exists project_views_ip_time_idx      on public.project_views (ip_hash, viewed_at desc);

-- ============================================================================
-- 4. updated_at trigger
-- ============================================================================

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

-- ============================================================================
-- 5. count_recent_views() helper
-- ============================================================================

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

-- ============================================================================
-- 6. Row-Level Security
-- ============================================================================

-- projects: anon can read published only; write via service_role
alter table public.projects enable row level security;

drop policy if exists "projects_public_read_published" on public.projects;
create policy "projects_public_read_published"
  on public.projects for select
  using (status = 'published');

-- project_likes: anon can read, insert, delete (unlike)
alter table public.project_likes enable row level security;

drop policy if exists "likes_public_read"   on public.project_likes;
create policy "likes_public_read"
  on public.project_likes for select using (true);

drop policy if exists "likes_public_insert" on public.project_likes;
create policy "likes_public_insert"
  on public.project_likes for insert with check (true);

drop policy if exists "likes_public_delete" on public.project_likes;
create policy "likes_public_delete"
  on public.project_likes for delete using (true);

-- project_views: anon can insert only; count via service_role RPC
alter table public.project_views enable row level security;

drop policy if exists "views_public_insert" on public.project_views;
create policy "views_public_insert"
  on public.project_views for insert with check (true);

-- ============================================================================
-- 7. Seed (optional) — LennMusic as first project
-- ============================================================================

insert into public.projects (slug, title, description, repo_url, demo_url, tech_stack, status, featured, display_order)
values (
  'lennmusic-io',
  'LennMusic.io',
  E'# LennMusic.io\n\nSaaS music streaming platform. YouTube Music-like experience: search, stream, playlists, synced lyrics.\n\n- Frontend: Next.js 15 + TypeScript + Tailwind\n- API: FastAPI + ytmusicapi + yt-dlp\n- DB: Supabase (Postgres + Auth + Storage)\n- Billing: Stripe (Free / Premium tiers)\n- Deploy: Vercel + AWS EC2 + Cloudflare Tunnel\n\nLive: https://lenn-music-io-web.vercel.app',
  'https://github.com/Lenn0109/LennMusic.io',
  'https://lenn-music-io-web.vercel.app',
  array['next.js', 'fastapi', 'supabase', 'stripe', 'docker', 'cloudflare'],
  'published',
  true,
  0
)
on conflict (slug) do nothing;
