import { afterEach, describe, expect, it } from 'vitest';

import {
  allowsSeedFallback,
  getSupabaseDeployment,
  hasSupabaseEnv,
} from '@/lib/supabase/env';

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('getSupabaseDeployment', () => {
  it('maps Vercel env values', () => {
    process.env.VERCEL_ENV = 'production';
    expect(getSupabaseDeployment()).toBe('production');

    process.env.VERCEL_ENV = 'preview';
    expect(getSupabaseDeployment()).toBe('preview');

    process.env.VERCEL_ENV = 'development';
    expect(getSupabaseDeployment()).toBe('development');
  });

  it('defaults to local when VERCEL_ENV is unset', () => {
    delete process.env.VERCEL_ENV;
    expect(getSupabaseDeployment()).toBe('local');
  });
});

describe('allowsSeedFallback', () => {
  it('allows seed fallback outside production', () => {
    for (const env of ['local', 'preview', 'development'] as const) {
      if (env === 'local') {
        delete process.env.VERCEL_ENV;
      } else {
        process.env.VERCEL_ENV = env;
      }
      expect(allowsSeedFallback()).toBe(true);
    }
  });

  it('disallows seed fallback in production', () => {
    process.env.VERCEL_ENV = 'production';
    expect(allowsSeedFallback()).toBe(false);
  });
});

describe('hasSupabaseEnv', () => {
  it('returns false when url or anon key is missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(hasSupabaseEnv()).toBe(false);

    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    expect(hasSupabaseEnv()).toBe(false);

    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    expect(hasSupabaseEnv()).toBe(false);
  });

  it('returns true when both url and anon key are set', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    expect(hasSupabaseEnv()).toBe(true);
  });
});
