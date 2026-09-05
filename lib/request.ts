export function getRequestIp(req: Request): string {
  // Vercel / edge sets x-forwarded-for.
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return '0.0.0.0';
}
