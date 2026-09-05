import { createHash } from 'node:crypto';

export function hashIp(ip: string): string {
  const salt = process.env.LIKES_SALT ?? 'dev-salt-do-not-use-in-production';
  return createHash('sha256').update(`${ip}:${salt}`).digest('hex');
}
