import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig, hasSupabaseEnv } from '@/lib/supabase/env';

// Server-side Supabase client for React Server Components / Route Handlers.
export async function createClient() {
  if (!hasSupabaseEnv()) {
    throw new Error('Supabase env vars are not configured for this deployment tier.');
  }

  const { url, anonKey } = getSupabaseConfig();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component (read-only cookies) — safe to ignore;
          // middleware refreshes the session.
        }
      },
    },
  });
}
