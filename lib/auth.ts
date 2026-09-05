export const ADMIN_COOKIE = 'lenngram_admin';
const COOKIE_MAX_AGE_S = 7 * 24 * 60 * 60;

function getSecret(): string {
  return process.env.COOKIE_SECRET ?? 'dev-cookie-secret-do-not-use-in-production';
}

async function hmacHex(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function signAdminCookie(): Promise<string> {
  const issued = Date.now();
  const payload = `${issued}`;
  const sig = await hmacHex(payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const idx = value.indexOf('.');
  if (idx <= 0) return false;
  const payload = value.slice(0, idx);
  const sig = value.slice(idx + 1);

  const expected = await hmacHex(payload);

  if (sig.length !== expected.length) return false;
  if (!timingSafeEqualStr(sig, expected)) return false;

  const issued = Number(payload);
  if (!Number.isFinite(issued)) return false;
  return Date.now() - issued < COOKIE_MAX_AGE_S * 1000;
}

export function isAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? '';
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  return timingSafeEqualStr(input, expected);
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: COOKIE_MAX_AGE_S,
};
