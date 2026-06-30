import { afterEach, describe, expect, it, vi } from 'vitest';

const { createAnonClientMock } = vi.hoisted(() => ({
  createAnonClientMock: vi.fn(),
}));

vi.mock('@/lib/supabase/anon-client', () => ({
  createAnonClient: createAnonClientMock,
}));

import { getCampaigns, CAMPAIGN_SEED } from '@/lib/campaigns';
import { getCampaignCoverUrl } from '@/lib/campaign-covers';
import { formatCampaignUpdatedAt } from '@/lib/campaigns-format';

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
    summary?: string;
    channels?: string[];
    campaign_type?: string;
  }> | null;
  error?: { message: string } | null;
}) {
  const order = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ order });
  const from = vi.fn().mockReturnValue({ select });
  createAnonClientMock.mockReturnValue({ from });
  return { from, select, order };
}

afterEach(() => {
  process.env = { ...originalEnv };
  createAnonClientMock.mockReset();
  vi.restoreAllMocks();
});

describe('campaign presentation helpers', () => {
  it('maps known campaign names to local cover assets', () => {
    expect(getCampaignCoverUrl('Summer Launch')).toBe('/campaigns/summer-launch.png');
    expect(getCampaignCoverUrl('Unknown')).toBe('/campaigns/brand-refresh.png');
  });

  it('formats updated dates for display', () => {
    expect(formatCampaignUpdatedAt('2026-06-24')).toBe('Jun 24, 2026');
  });
});

describe('getCampaigns seed fallback policy', () => {
  it('returns seed data when Supabase env is missing outside production', async () => {
    setNonProduction();
    clearSupabaseEnv();

    const campaigns = await getCampaigns();

    expect(campaigns.map((c) => c.id)).toEqual(SEED_IDS);
    expect(campaigns[0]?.coverImage).toBe('/campaigns/summer-launch.png');
    expect(campaigns[0]?.updatedAtLabel).toBe('Jun 24, 2026');
    expect(createAnonClientMock).not.toHaveBeenCalled();
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
    expect(createAnonClientMock).not.toHaveBeenCalled();
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
    createAnonClientMock.mockImplementation(() => {
      throw new Error('client failed');
    });

    const campaigns = await getCampaigns();

    expect(campaigns.map((c) => c.id)).toEqual(SEED_IDS);
  });

  it('returns an empty list when the Supabase client throws in production', async () => {
    setProduction();
    setSupabaseEnv();
    createAnonClientMock.mockImplementation(() => {
      throw new Error('client failed');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const campaigns = await getCampaigns();

    expect(campaigns).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      '[campaigns] Supabase query failed in production:',
      'client failed',
    );
  });
});

describe('CAMPAIGN_SEED storytelling content', () => {
  it('includes summary, channels, and campaignType for every row', () => {
    for (const row of CAMPAIGN_SEED) {
      expect(row.summary.length).toBeGreaterThan(0);
      expect(row.channels.length).toBeGreaterThan(0);
      expect(row.campaignType.length).toBeGreaterThan(0);
    }
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
          summary: 'Test summary.',
          channels: ['Email'],
          campaign_type: 'Product launch',
        },
      ],
      error: null,
    });

    const campaigns = await getCampaigns();

    expect(campaigns).toEqual([
      {
        id: 'db1',
        slug: 'db-campaign',
        name: 'DB Campaign',
        owner: 'Growth',
        status: 'live',
        updatedAt: '2026-06-25',
        updatedAtLabel: 'Jun 25, 2026',
        summary: 'Test summary.',
        channels: ['Email'],
        campaignType: 'Product launch',
        coverImage: '/campaigns/brand-refresh.png',
      },
    ]);
  });

  it('normalizes unknown Supabase status values to draft', async () => {
    setNonProduction();
    setSupabaseEnv();
    mockSupabaseQuery({
      data: [
        {
          id: 'db2',
          name: 'Legacy Campaign',
          owner: 'Growth',
          status: 'paused',
          updated_at: '2026-06-25',
        },
      ],
      error: null,
    });

    const campaigns = await getCampaigns();

    expect(campaigns[0]?.status).toBe('draft');
  });
});
