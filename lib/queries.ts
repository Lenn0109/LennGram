import 'server-only';
import { MOCK_PROJECTS, MOCK_TAGS } from '@/lib/mock';
import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from '@/lib/supabase/server';
import type { Project, ProjectWithCount } from '@/lib/types';

export interface FeedQuery {
  page?: number;
  pageSize?: number;
  tech?: string | null;
}

export interface FeedResult {
  items: ProjectWithCount[];
  hasMore: boolean;
  page: number;
  total?: number;
  tags: string[];
}

async function attachLikeCounts(rows: Project[]): Promise<ProjectWithCount[]> {
  if (!rows.length) return [];
  const client = await createServerSupabaseClient();
  if (!client) {
    const map = new Map(MOCK_PROJECTS.map((p) => [p.id, p.like_count]));
    return rows.map((r) => ({ ...r, like_count: map.get(r.id) ?? 0 }));
  }

  const ids = rows.map((r) => r.id);
  const { data: likes } = await client
    .from('project_likes')
    .select('project_id')
    .in('project_id', ids);

  const counts = new Map<string, number>();
  for (const row of likes ?? []) {
    counts.set(row.project_id, (counts.get(row.project_id) ?? 0) + 1);
  }
  return rows.map((r) => ({ ...r, like_count: counts.get(r.id) ?? 0 }));
}

function paginate<T>(arr: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const slice = arr.slice(start, start + pageSize);
  return { slice, hasMore: start + slice.length < arr.length };
}

function sortForFeed<T extends Project>(arr: T[]): T[] {
  return [...arr].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.display_order !== b.display_order) return a.display_order - b.display_order;
    return b.created_at.localeCompare(a.created_at);
  });
}

export async function getFeed({ page = 1, pageSize = 12, tech = null }: FeedQuery): Promise<FeedResult> {
  const client = await createServerSupabaseClient();

  if (!client) {
    const filtered = tech
      ? MOCK_PROJECTS.filter((p) => p.tech_stack.includes(tech))
      : MOCK_PROJECTS;
    const sorted = sortForFeed(filtered);
    const { slice, hasMore } = paginate(sorted, page, pageSize);
    const items: ProjectWithCount[] = slice.map((p) => ({ ...p }));
    return {
      items,
      hasMore,
      page,
      total: sorted.length,
      tags: MOCK_TAGS,
    };
  }

  let query = client
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (tech) query = query.contains('tech_stack', [tech]);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count } = await query;
  const rows = (data ?? []) as Project[];
  const items = await attachLikeCounts(rows);

  // Tags come from a separate cheap query (union of all tech_stack entries).
  const { data: tagRows } = await client
    .from('projects')
    .select('tech_stack')
    .eq('status', 'published');
  const set = new Set<string>();
  for (const r of (tagRows ?? []) as Array<{ tech_stack: string[] | null }>) {
    for (const t of r.tech_stack ?? []) set.add(t);
  }
  const tags = Array.from(set).sort();

  return {
    items,
    hasMore: items.length === pageSize && from + items.length < (count ?? 0),
    page,
    total: count ?? undefined,
    tags,
  };
}

export async function getProjectBySlug(slug: string): Promise<{
  project: ProjectWithCount | null;
  recentViews: number;
}> {
  const client = await createServerSupabaseClient();

  if (!client) {
    const p = MOCK_PROJECTS.find((x) => x.slug === slug) ?? null;
    return { project: p, recentViews: p ? 7 : 0 };
  }

  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) return { project: null, recentViews: 0 };

  const project = data as Project;
  const [likesResult, viewsResult] = await Promise.all([
    client
      .from('project_likes')
      .select('project_id')
      .eq('project_id', project.id),
    client.rpc('count_recent_views', {
      project_uuid: project.id,
      since: '7 days',
    }),
  ]);

  const like_count = likesResult.data?.length ?? 0;
  const recentViews = (viewsResult.data as number | null) ?? 0;
  return { project: { ...project, like_count }, recentViews };
}

export async function getAllProjectsForAdmin(): Promise<ProjectWithCount[]> {
  const client = await createServerSupabaseAdminClient();

  if (!client) {
    return MOCK_PROJECTS.map((p) => ({ ...p, status: 'published' as const }));
  }

  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error || !data) return [];
  return attachLikeCounts(data as Project[]);
}
