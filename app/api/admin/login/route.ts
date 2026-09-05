import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, COOKIE_OPTIONS, isAdminPassword, signAdminCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Body {
  password?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.password || !isAdminPassword(body.password)) {
    return NextResponse.json({ error: 'invalid_password' }, { status: 401 });
  }

  const value = signAdminCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, value, COOKIE_OPTIONS);
  return res;
}
