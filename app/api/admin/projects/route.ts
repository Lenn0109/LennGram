import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/auth';
import { createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';
import { projectFormSchema, slugify } from '@/lib/project-schema';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!verifyAdminCookie(adminCookie)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = projectFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', details: parsed.error.issues[0]?.message ?? 'invalid' },
      { status: 400 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mock: true, slug: slugify(parsed.data.title) });
  }

  const client = await createServerSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }

  // Slug uniqueness: try slug, append -2/-3 if collision.
  let candidate = parsed.data.slug || slugify(parsed.data.title);
  for (let i = 2; i < 100; i++) {
    const { data: existing } = await client
      .from('projects')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    if (!existing) break;
    candidate = `${parsed.data.slug || slugify(parsed.data.title)}-${i}`;
  }

  const { data, error } = await client
    .from('projects')
    .insert({
      slug: candidate,
      title: parsed.data.title,
      description: parsed.data.description,
      cover_url: parsed.data.cover_url ?? null,
      repo_url: parsed.data.repo_url ?? null,
      demo_url: parsed.data.demo_url ?? null,
      tech_stack: parsed.data.tech_stack,
      status: parsed.data.status,
      featured: parsed.data.featured,
      display_order: parsed.data.display_order,
    })
    .select('*')
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'insert_failed', details: error?.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, project: data });
}
