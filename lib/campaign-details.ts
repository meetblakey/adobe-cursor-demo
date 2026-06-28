import { allowsSeedFallback, hasSupabaseEnv } from '@/lib/supabase/env';
import { getCampaignNameBySlug } from '@/lib/campaign-slugs';
import { CAMPAIGN_SEED } from '@/lib/campaigns-seed';
import { enrichCampaign } from '@/lib/campaigns-query';
import { getDetailSeedBySlug } from '@/lib/campaign-details-seed';
import { getCachedCampaignDetail } from '@/lib/campaign-details-cache';
import { queryCampaignDetailFromSupabase } from '@/lib/campaign-details-query';
import type { CampaignDetail } from '@/lib/campaigns-types';

export type { CampaignDetail } from '@/lib/campaigns-types';

function buildDetailFromSeed(slug: string): CampaignDetail | null {
  const name = getCampaignNameBySlug(slug);
  const seedRow = CAMPAIGN_SEED.find((row) => row.name === name);
  const detailSeed = getDetailSeedBySlug(slug);
  if (!seedRow || !detailSeed) return null;

  const base = enrichCampaign({
    id: seedRow.id,
    name: seedRow.name,
    owner: seedRow.owner,
    status: seedRow.status,
    updated_at: seedRow.updatedAt,
    summary: seedRow.summary,
    channels: seedRow.channels,
    campaign_type: seedRow.campaignType,
  });

  return { ...base, slug, ...detailSeed };
}

async function loadCampaignDetailFromSupabase(slug: string): Promise<CampaignDetail | null> {
  if (process.env.NODE_ENV === 'test') {
    return queryCampaignDetailFromSupabase(slug);
  }
  return getCachedCampaignDetail(slug);
}

export async function getCampaignDetail(slug: string): Promise<CampaignDetail | null> {
  if (!hasSupabaseEnv()) {
    if (allowsSeedFallback()) return buildDetailFromSeed(slug);
    console.error('[campaign-details] Production requires Supabase env vars; no seed fallback.');
    return null;
  }

  try {
    return await loadCampaignDetailFromSupabase(slug);
  } catch (err) {
    if (allowsSeedFallback()) return buildDetailFromSeed(slug);
    const message = err instanceof Error ? err.message : String(err);
    console.error('[campaign-details] Supabase query failed in production:', message);
    return null;
  }
}

export { getAllCampaignSlugs } from '@/lib/campaign-slugs';
