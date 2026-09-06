import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/auth';
import { getFeed, getAllProjectsForAdmin } from '@/lib/queries';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProjectWithCount } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') ?? '1');
  const tech = url.searchParams.get('tech');
  const idsParam = url.searchParams.get('ids');

  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin = await verifyAdminCookie(adminCookie);

  // Support filtering by specific IDs (used by /liked and /saved pages)
  if (idsParam) {
    const wantedIds = idsParam.split(',').filter(Boolean);
    const client = await createServerSupabaseClient();
    if (!client) {
      return NextResponse.json({ items: [] });
    }

    const { data, error } = await client
      .from('projects')
      .select('*, project_likes(project_id)', { count: 'exact' })
      .eq('status', 'published')
      .in('id', wantedIds);

    if (error || !data) {
      return NextResponse.json({ items: [] });
    }

    const items: ProjectWithCount[] = (data as unknown as Array<{
      id: string; slug: string; title: string; description: string;
      cover_url: string | null; images?: string[]; repo_url: string | null; demo_url: string | null;
      tech_stack: string[]; status: string; featured: boolean; display_order: number;
      created_at: string; updated_at: string;
      project_likes?: { project_id: string }[];
    }>).map((row) => ({
      ...row,
      status: row.status as 'draft' | 'published',
      like_count: row.project_likes?.length ?? 0,
    }));

    return NextResponse.json({ items });
  }

  if (isAdmin && url.searchParams.get('admin') === '1') {
    const items = await getAllProjectsForAdmin();
    return NextResponse.json({ items, hasMore: false, page: 1, total: items.length });
  }

  const result = await getFeed({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 12,
    tech: tech && tech.length ? tech : null,
  });

  return NextResponse.json(result);
}
