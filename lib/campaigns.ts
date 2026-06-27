import { createClient } from '@/lib/supabase/server';
import { allowsSeedFallback, hasSupabaseEnv } from '@/lib/supabase/env';
import type { CampaignStatus } from '@/components/ui/status-badge';

export type Campaign = {
  id: string;
  name: string;
  owner: string;
  status: CampaignStatus;
  updatedAt: string;
};

// Seed data so the app renders before Supabase is configured (non-production tiers only).
const SEED: Campaign[] = [
  { id: 'c1', name: 'Summer Launch', owner: 'Growth', status: 'live', updatedAt: '2026-06-24' },
  { id: 'c2', name: 'Brand Refresh 2026', owner: 'Design', status: 'review', updatedAt: '2026-06-23' },
  { id: 'c3', name: 'APJ Expansion', owner: 'Field', status: 'draft', updatedAt: '2026-06-22' },
  { id: 'c4', name: 'Acrobat AI Upsell', owner: 'Document Cloud', status: 'live', updatedAt: '2026-06-21' },
  { id: 'c5', name: 'Firefly Holiday Push', owner: 'Creative Cloud', status: 'review', updatedAt: '2026-06-20' },
  { id: 'c6', name: 'Enterprise Onboarding', owner: 'Experience Cloud', status: 'draft', updatedAt: '2026-06-19' },
];

export async function getCampaigns(): Promise<Campaign[]> {
  if (!hasSupabaseEnv()) {
    if (allowsSeedFallback()) return SEED;
    console.error('[campaigns] Production requires Supabase env vars; no seed fallback.');
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('id, name, owner, status, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      if (allowsSeedFallback()) return SEED;
      console.error('[campaigns] Supabase query failed in production:', error.message);
      return [];
    }

    if (!data?.length) {
      if (allowsSeedFallback()) return SEED;
      return [];
    }

    return data.map((r) => ({
      id: r.id,
      name: r.name,
      owner: r.owner,
      status: r.status as CampaignStatus,
      updatedAt: r.updated_at,
    }));
  } catch (err) {
    if (allowsSeedFallback()) return SEED;
    console.error('[campaigns] Supabase client error in production:', err);
    return [];
  }
}
