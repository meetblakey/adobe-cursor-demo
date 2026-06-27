import { afterEach, describe, expect, it, vi } from 'vitest';

const { createAnonClientMock } = vi.hoisted(() => ({
  createAnonClientMock: vi.fn(),
}));

vi.mock('@/lib/supabase/anon-client', () => ({
  createAnonClient: createAnonClientMock,
}));

import { getAllCampaignSlugs, getCampaignSlug } from '@/lib/campaign-slugs';
import { getCampaignDetail } from '@/lib/campaign-details';
import { CAMPAIGN_DETAIL_SEED } from '@/lib/campaign-details-seed';

const originalEnv = { ...process.env };

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

function mockSupabaseDetailQuery(result: {
  data?: {
    id: string;
    name: string;
    owner: string;
    status: string;
    updated_at: string;
    summary?: string;
    channels?: string[];
    campaign_type?: string;
    detail?: Record<string, unknown> | null;
  } | null;
  error?: { message: string } | null;
}) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });
  createAnonClientMock.mockReturnValue({ from });
  return { from, select, eq, maybeSingle };
}

afterEach(() => {
  process.env = { ...originalEnv };
  createAnonClientMock.mockReset();
  vi.restoreAllMocks();
});

describe('campaign slugs', () => {
  it('maps known campaign names to stable slugs', () => {
    expect(getCampaignSlug('Summer Launch')).toBe('summer-launch');
    expect(getCampaignSlug('Brand Refresh 2026')).toBe('brand-refresh-2026');
  });

  it('returns all six campaign slugs for static generation', () => {
    expect(getAllCampaignSlugs()).toEqual([
      'summer-launch',
      'brand-refresh-2026',
      'apj-expansion',
      'acrobat-ai-upsell',
      'firefly-holiday-push',
      'enterprise-onboarding',
    ]);
  });
});

describe('CAMPAIGN_DETAIL_SEED', () => {
  it('includes narrative fields for every slug', () => {
    for (const slug of getAllCampaignSlugs()) {
      const detail = CAMPAIGN_DETAIL_SEED[slug];
      expect(detail?.objective.length).toBeGreaterThan(0);
      expect(detail?.audience.length).toBeGreaterThan(0);
      expect(detail?.milestones.length).toBeGreaterThan(0);
      expect(detail?.channelPlan.length).toBeGreaterThan(0);
      expect(detail?.assets.length).toBeGreaterThan(0);
      expect(detail?.stakeholders.length).toBeGreaterThan(0);
      expect(detail?.activity.length).toBeGreaterThan(0);
    }
  });

  it('includes pending approvals for review campaigns', () => {
    const brandRefresh = CAMPAIGN_DETAIL_SEED['brand-refresh-2026'];
    const firefly = CAMPAIGN_DETAIL_SEED['firefly-holiday-push'];
    expect(brandRefresh?.approvals.some((a) => a.status === 'pending')).toBe(true);
    expect(firefly?.approvals.some((a) => a.status === 'pending')).toBe(true);
  });
});

describe('getCampaignDetail seed fallback policy', () => {
  it('returns seed detail when Supabase env is missing outside production', async () => {
    setNonProduction();
    clearSupabaseEnv();

    const detail = await getCampaignDetail('summer-launch');

    expect(detail?.name).toBe('Summer Launch');
    expect(detail?.slug).toBe('summer-launch');
    expect(detail?.objective.length).toBeGreaterThan(0);
    expect(createAnonClientMock).not.toHaveBeenCalled();
  });

  it('returns null for unknown slug outside production', async () => {
    setNonProduction();
    clearSupabaseEnv();

    const detail = await getCampaignDetail('unknown-campaign');

    expect(detail).toBeNull();
  });

  it('returns null when Supabase env is missing in production', async () => {
    setProduction();
    clearSupabaseEnv();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const detail = await getCampaignDetail('summer-launch');

    expect(detail).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    expect(createAnonClientMock).not.toHaveBeenCalled();
  });

  it('returns seed detail on Supabase query error outside production', async () => {
    setNonProduction();
    setSupabaseEnv();
    mockSupabaseDetailQuery({ data: null, error: { message: 'query failed' } });

    const detail = await getCampaignDetail('summer-launch');

    expect(detail?.slug).toBe('summer-launch');
  });

  it('maps Supabase rows when data is returned', async () => {
    setNonProduction();
    setSupabaseEnv();
    mockSupabaseDetailQuery({
      data: {
        id: 'db1',
        name: 'Summer Launch',
        owner: 'Growth',
        status: 'live',
        updated_at: '2026-06-24',
        summary: 'Seasonal Creative Cloud feature push across digital surfaces.',
        channels: ['In-app', 'Email', 'Web'],
        campaign_type: 'Product launch',
        detail: null,
      },
      error: null,
    });

    const detail = await getCampaignDetail('summer-launch');

    expect(detail?.id).toBe('db1');
    expect(detail?.slug).toBe('summer-launch');
    expect(detail?.channelPlan.length).toBeGreaterThan(0);
  });
});
