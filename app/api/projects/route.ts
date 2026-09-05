import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/auth';
import { getFeed, getAllProjectsForAdmin } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') ?? '1');
  const tech = url.searchParams.get('tech');

  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin = verifyAdminCookie(adminCookie);

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
