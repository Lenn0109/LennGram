import { NextResponse } from 'next/server';
import { hashIp } from '@/lib/ip-hash';
import { getRequestIp } from '@/lib/request';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';

interface Body {
  projectId?: string;
  unlike?: boolean;
}

const RATE_LIMIT_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { projectId, unlike } = body;
  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 });
  }

  const ip = getRequestIp(req);
  const ipHash = hashIp(ip);

  if (!isSupabaseConfigured()) {
    // Dev mode without Supabase: return success so UI flow works.
    return NextResponse.json({ liked: !unlike, totalLikes: 1, mock: true });
  }

  const client = await createServerSupabaseClient();
  if (!client) {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });
  }

  // Rate limit: count this IP's likes in the last hour.
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const { count: recentCount } = await client
    .from('project_likes')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since);

  if (!unlike && (recentCount ?? 0) >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSeconds: RATE_WINDOW_MS / 1000 },
      { status: 429, headers: { 'Retry-After': String(RATE_WINDOW_MS / 1000) } },
    );
  }

  if (unlike) {
    const { error: delError } = await client
      .from('project_likes')
      .delete()
      .eq('project_id', projectId)
      .eq('ip_hash', ipHash);
    if (delError) {
      return NextResponse.json({ error: 'delete_failed' }, { status: 500 });
    }
  } else {
    const { error: insError } = await client
      .from('project_likes')
      .insert({ project_id: projectId, ip_hash: ipHash });
    if (insError && !String(insError.message).includes('duplicate')) {
      return NextResponse.json({ error: 'insert_failed' }, { status: 500 });
    }
  }

  // Return updated count.
  const { count: total } = await client
    .from('project_likes')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  return NextResponse.json({
    liked: !unlike,
    totalLikes: total ?? 0,
  });
}
