export async function hashIp(ip: string): Promise<string> {
  const salt = process.env.LIKES_SALT ?? 'dev-salt-do-not-use-in-production';
  const enc = new TextEncoder();
  const data = enc.encode(`${ip}:${salt}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
