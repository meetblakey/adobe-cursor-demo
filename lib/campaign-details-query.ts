import { createAnonClient } from '@/lib/supabase/anon-client';
import { getCampaignNameBySlug } from '@/lib/campaign-slugs';
import { enrichCampaign } from '@/lib/campaigns-query';
import { getDetailSeedBySlug } from '@/lib/campaign-details-seed';
import type { CampaignDetail } from '@/lib/campaigns-types';

type CampaignRow = {
  id: string;
  name: string;
  owner: string;
  status: string;
  updated_at: string;
  summary?: string | null;
  channels?: string[] | null;
  campaign_type?: string | null;
  detail?: Record<string, unknown> | null;
};

export function mergeCampaignDetail(
  row: CampaignRow,
  slug: string,
): CampaignDetail | null {
  const base = enrichCampaign(row);
  const seed = getDetailSeedBySlug(slug);
  if (!seed) return null;

  return {
    ...base,
    slug,
    ...seed,
  };
}

export async function queryCampaignDetailFromSupabase(
  slug: string,
): Promise<CampaignDetail | null> {
  const name = getCampaignNameBySlug(slug);
  if (!name) return null;

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select(
      'id, name, owner, status, updated_at, summary, channels, campaign_type, detail',
    )
    .eq('name', name)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error(`No campaign found for slug: ${slug}`);

  return mergeCampaignDetail(data as CampaignRow, slug);
}
