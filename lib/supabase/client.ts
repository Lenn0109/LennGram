'use client';

import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from '@/lib/env';

let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export function createBrowserSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  cachedClient = createBrowserClient(url, anonKey);
  return cachedClient;
}
