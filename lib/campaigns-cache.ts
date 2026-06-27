import { cacheLife, cacheTag } from 'next/cache';
import { queryCampaignsFromSupabase } from '@/lib/campaigns-query';

export async function getCachedCampaigns() {
  'use cache';
  cacheLife('hours');
  cacheTag('campaigns');
  return queryCampaignsFromSupabase();
}
