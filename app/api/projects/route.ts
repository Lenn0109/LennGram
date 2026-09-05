import { NextResponse } from 'next/server';
import { getFeed } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') ?? '1');
  const tech = url.searchParams.get('tech');

  const result = await getFeed({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 12,
    tech: tech && tech.length ? tech : null,
  });

  return NextResponse.json(result);
}
