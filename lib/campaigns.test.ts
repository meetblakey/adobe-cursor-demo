import { afterEach, describe, expect, it, vi } from 'vitest';

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: createClientMock,
}));

import { getCampaigns } from '@/lib/campaigns';

const originalEnv = { ...process.env };

const SEED_IDS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

function setNonProduction() {
  delete process.env.VERCEL_ENV;
}

function setProduction() {
  process.env.VERCEL_ENV = 'production';
}

function setSupabaseEnv() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
}

function clearSupabaseEnv() {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

function mockSupabaseQuery(result: {
  data?: Array<{
    id: string;
    name: string;
    owner: string;
    status: string;
    updated_at: string;
  }> | null;
  error?: { message: string } | null;
}) {
  const order = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ order });
  const from = vi.fn().mockReturnValue({ select });
  createClientMock.mockResolvedValue({ from });
  return { from, select, order };
}

afterEach(() => {
  process.env = { ...originalEnv };
  createClientMock.mockReset();
  vi.restoreAllMocks();
});

describe('getCampaigns seed fallback policy', () => {
  it('returns seed data when Supabase env is missing outside production', async () => {
    setNonProduction();
    clearSupabaseEnv();

    const campaigns = await getCampaigns();

    expect(campaigns.map((c) => c.id)).toEqual(SEED_IDS);
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it('returns an empty list when Supabase env is missing in production', async () => {
    setProduction();
    clearSupabaseEnv();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const campaigns = await getCampaigns();

    expect(campaigns).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      '[campaigns] Production requires Supabase env vars; no seed fallback.',
    );
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it('returns seed data on Supabase query error outside production', async () => {
    setNonProduction();
    setSupabaseEnv();
    mockSupabaseQuery({ data: null, error: { message: 'query failed' } });

    const campaigns = await getCampaigns();

    expect(campaigns.map((c) => c.id)).toEqual(SEED_IDS);
  });

  it('returns an empty list on Supabase query error in production', async () => {
    setProduction();
    setSupabaseEnv();
    mockSupabaseQuery({ data: null, error: { message: 'query failed' } });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const campaigns = await getCampaigns();

    expect(campaigns).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      '[campaigns] Supabase query failed in production:',
      'query failed',
    );
  });

  it('returns seed data when Supabase returns no rows outside production', async () => {
    setNonProduction();
    setSupabaseEnv();
    mockSupabaseQuery({ data: [], error: null });

    const campaigns = await getCampaigns();

    expect(campaigns.map((c) => c.id)).toEqual(SEED_IDS);
  });

  it('returns an empty list when Supabase returns no rows in production', async () => {
    setProduction();
    setSupabaseEnv();
    mockSupabaseQuery({ data: [], error: null });

    const campaigns = await getCampaigns();

    expect(campaigns).toEqual([]);
  });

  it('returns seed data when the Supabase client throws outside production', async () => {
    setNonProduction();
    setSupabaseEnv();
    createClientMock.mockRejectedValue(new Error('client failed'));

    const campaigns = await getCampaigns();

    expect(campaigns.map((c) => c.id)).toEqual(SEED_IDS);
  });

  it('returns an empty list when the Supabase client throws in production', async () => {
    setProduction();
    setSupabaseEnv();
    createClientMock.mockRejectedValue(new Error('client failed'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const campaigns = await getCampaigns();

    expect(campaigns).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      '[campaigns] Supabase client error in production:',
      expect.any(Error),
    );
  });
});

describe('getCampaigns with live Supabase data', () => {
  it('maps Supabase rows when data is returned', async () => {
    setNonProduction();
    setSupabaseEnv();
    mockSupabaseQuery({
      data: [
        {
          id: 'db1',
          name: 'DB Campaign',
          owner: 'Growth',
          status: 'live',
          updated_at: '2026-06-25',
        },
      ],
      error: null,
    });

    const campaigns = await getCampaigns();

    expect(campaigns).toEqual([
      {
        id: 'db1',
        name: 'DB Campaign',
        owner: 'Growth',
        status: 'live',
        updatedAt: '2026-06-25',
      },
    ]);
  });
});
