import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, hasSupabaseEnv } from '@/lib/supabase/env';

/** Anonymous read client — no cookies(), usable from any server context. */
export function createAnonClient() {
  if (!hasSupabaseEnv()) {
    throw new Error('Supabase env vars are not configured for this deployment tier.');
  }

  const { url, anonKey } = getSupabaseConfig();
  return createClient(url, anonKey);
}
