import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/auth';

const ADMIN_PREFIX = '/admin';
const PUBLIC_ADMIN_PATHS = new Set(['/admin/login']);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = verifyAdminCookie(cookie);

  if (!ok) {
    // 404 instead of 401 to obscure existence.
    const notFound = new NextResponse('Not Found', { status: 404 });
    return notFound;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
