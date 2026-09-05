import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/auth';
import { createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';
import { projectFormSchema, slugify } from '@/lib/project-schema';

export const dynamic = 'force-dynamic';

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, ctx: Ctx) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!verifyAdminCookie(adminCookie)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = projectFormSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', details: parsed.error.issues[0]?.message ?? 'invalid' },
      { status: 400 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mock: true });
  }

  const client = await createServerSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) update.title = parsed.data.title;
  if (parsed.data.slug !== undefined) {
    // Re-check uniqueness if slug is changing.
    let candidate = parsed.data.slug || slugify(parsed.data.title ?? '');
    const { data: conflict } = await client
      .from('projects')
      .select('id')
      .eq('slug', candidate)
      .neq('id', id)
      .maybeSingle();
    if (conflict) {
      candidate = `${candidate}-${Math.floor(Math.random() * 9000) + 1000}`;
    }
    update.slug = candidate;
  }
  if (parsed.data.description !== undefined) update.description = parsed.data.description;
  if (parsed.data.cover_url !== undefined) update.cover_url = parsed.data.cover_url;
  if (parsed.data.repo_url !== undefined) update.repo_url = parsed.data.repo_url;
  if (parsed.data.demo_url !== undefined) update.demo_url = parsed.data.demo_url;
  if (parsed.data.tech_stack !== undefined) update.tech_stack = parsed.data.tech_stack;
  if (parsed.data.status !== undefined) update.status = parsed.data.status;
  if (parsed.data.featured !== undefined) update.featured = parsed.data.featured;
  if (parsed.data.display_order !== undefined) update.display_order = parsed.data.display_order;

  const { data, error } = await client
    .from('projects')
    .update(update)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'update_failed', details: error?.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, project: data });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!verifyAdminCookie(adminCookie)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mock: true });
  }

  const client = await createServerSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }

  const { error } = await client.from('projects').delete().eq('id', id);
  if (error) {
    return NextResponse.json(
      { error: 'delete_failed', details: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
