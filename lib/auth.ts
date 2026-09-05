import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'lenngram_admin';
const COOKIE_MAX_AGE_S = 7 * 24 * 60 * 60;

function getSecret(): string {
  return process.env.COOKIE_SECRET ?? 'dev-cookie-secret-do-not-use-in-production';
}

export function signAdminCookie(): string {
  const issued = Date.now();
  const payload = `${issued}`;
  const sig = createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifyAdminCookie(value: string | undefined): boolean {
  if (!value) return false;
  const idx = value.indexOf('.');
  if (idx <= 0) return false;
  const payload = value.slice(0, idx);
  const sig = value.slice(idx + 1);

  const expected = createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');

  if (sig.length !== expected.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }

  const issued = Number(payload);
  if (!Number.isFinite(issued)) return false;
  return Date.now() - issued < COOKIE_MAX_AGE_S * 1000;
}

export function isAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? '';
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: COOKIE_MAX_AGE_S,
};
