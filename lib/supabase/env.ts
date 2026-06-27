export type SupabaseDeployment = 'development' | 'preview' | 'production' | 'local';

/** Maps the running Vercel tier (or local) to a deployment label. */
export function getSupabaseDeployment(): SupabaseDeployment {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === 'production' || vercelEnv === 'preview' || vercelEnv === 'development') {
    return vercelEnv;
  }
  return 'local';
}

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '',
    deployment: getSupabaseDeployment(),
  } as const;
}

export function hasSupabaseEnv(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

/** Whether in-app seed data is allowed when Supabase is missing or errors. */
export function allowsSeedFallback(): boolean {
  return getSupabaseDeployment() !== 'production';
}
