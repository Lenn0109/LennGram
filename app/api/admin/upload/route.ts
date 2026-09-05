import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/auth';
import { createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';
  const adminCookie = cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);

  if (!verifyAdminCookie(adminCookie)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file_required' }, { status: 400 });
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json({ error: 'invalid_mime' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    // Dev mode without Supabase: return a data URL so the form can preview.
    const buf = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buf.toString('base64')}`;
    return NextResponse.json({ url: dataUrl, mock: true });
  }

  const client = await createServerSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ error: 'storage_unavailable' }, { status: 503 });
  }

  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
  const path = `${randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage
    .from('covers')
    .upload(path, buf, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json(
      { error: 'upload_failed', details: error.message },
      { status: 500 },
    );
  }

  const { data: pub } = client.storage.from('covers').getPublicUrl(path);
  return NextResponse.json({ url: pub.publicUrl });
}
