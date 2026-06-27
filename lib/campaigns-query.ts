import { createAnonClient } from '@/lib/supabase/anon-client';
import { getCampaignCoverUrl } from '@/lib/campaign-covers';
import { getCampaignSlug } from '@/lib/campaign-slugs';
import { formatCampaignUpdatedAt } from '@/lib/campaigns-format';
import type { CampaignStatus } from '@/components/ui/status-badge';
import type { Campaign } from '@/lib/campaigns-types';

type CampaignRow = {
  id: string;
  name: string;
  owner: string;
  status: string;
  updated_at: string;
  summary?: string | null;
  channels?: string[] | null;
  campaign_type?: string | null;
};

export function enrichCampaign(row: CampaignRow): Campaign {
  const updatedAt = row.updated_at;
  return {
    id: row.id,
    slug: getCampaignSlug(row.name),
    name: row.name,
    owner: row.owner,
    status: row.status as CampaignStatus,
    updatedAt,
    updatedAtLabel: formatCampaignUpdatedAt(updatedAt),
    summary: row.summary ?? '',
    channels: row.channels ?? [],
    campaignType: row.campaign_type ?? '',
    coverImage: getCampaignCoverUrl(row.name),
  };
}

export async function queryCampaignsFromSupabase(): Promise<Campaign[]> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, name, owner, status, updated_at, summary, channels, campaign_type')
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error('No campaigns returned from Supabase');

  return data.map(enrichCampaign);
}
