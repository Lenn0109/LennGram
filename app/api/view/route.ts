import { NextResponse } from 'next/server';
import { hashIp } from '@/lib/ip-hash';
import { getRequestIp } from '@/lib/request';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';

interface Body {
  projectId?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { projectId } = body;
  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mock: true });
  }

  const client = await createServerSupabaseClient();
  if (!client) {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });
  }

  const ipHash = await hashIp(getRequestIp(req));
  const { error } = await client
    .from('project_views')
    .insert({ project_id: projectId, ip_hash: ipHash });

  if (error) {
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
