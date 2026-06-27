import { cacheLife, cacheTag } from 'next/cache';
import { queryCampaignDetailFromSupabase } from '@/lib/campaign-details-query';

export async function getCachedCampaignDetail(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('campaigns', `campaign-${slug}`);
  return queryCampaignDetailFromSupabase(slug);
}
