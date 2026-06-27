import { allowsSeedFallback, hasSupabaseEnv } from '@/lib/supabase/env';
import { CAMPAIGN_SEED } from '@/lib/campaigns-seed';
import { enrichCampaign } from '@/lib/campaigns-query';
import { getCachedCampaigns } from '@/lib/campaigns-cache';
import { queryCampaignsFromSupabase } from '@/lib/campaigns-query';

export type { Campaign } from '@/lib/campaigns-types';

import type { Campaign } from '@/lib/campaigns-types';

const SEED: Campaign[] = CAMPAIGN_SEED.map((row) =>
  enrichCampaign({
    id: row.id,
    name: row.name,
    owner: row.owner,
    status: row.status,
    updated_at: row.updatedAt,
    summary: row.summary,
    channels: row.channels,
    campaign_type: row.campaignType,
  }),
);

async function loadCampaignsFromSupabase(): Promise<Campaign[]> {
  if (process.env.NODE_ENV === 'test') {
    return queryCampaignsFromSupabase();
  }
  return getCachedCampaigns();
}

export async function getCampaigns(): Promise<Campaign[]> {
  if (!hasSupabaseEnv()) {
    if (allowsSeedFallback()) return SEED;
    console.error('[campaigns] Production requires Supabase env vars; no seed fallback.');
    return [];
  }

  try {
    return await loadCampaignsFromSupabase();
  } catch (err) {
    if (allowsSeedFallback()) return SEED;
    const message = err instanceof Error ? err.message : String(err);
    console.error('[campaigns] Supabase query failed in production:', message);
    return [];
  }
}

export { CAMPAIGN_SEED } from '@/lib/campaigns-seed';
