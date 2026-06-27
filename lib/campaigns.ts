import { createClient } from '@/lib/supabase/server';
import { allowsSeedFallback, hasSupabaseEnv } from '@/lib/supabase/env';
import type { CampaignStatus } from '@/components/ui/status-badge';

export type Campaign = {
  id: string;
  name: string;
  owner: string;
  status: CampaignStatus;
  updatedAt: string;
  image: {
    src: string;
    alt: string;
  };
};

type CampaignRecord = Omit<Campaign, 'image'>;

const CAMPAIGN_IMAGES: Record<string, Campaign['image']> = {
  c1: {
    src: '/campaigns/summer-launch.png',
    alt: 'A tablet showing abstract campaign analytics in a sunlit creative studio.',
  },
  c2: {
    src: '/campaigns/brand-refresh.png',
    alt: 'A refined design studio wall covered with brand system mood boards.',
  },
  c3: {
    src: '/campaigns/apj-expansion.png',
    alt: 'An enterprise strategy room with an illuminated global market planning table.',
  },
  c4: {
    src: '/campaigns/ai-upsell.png',
    alt: 'A dark workspace with abstract AI workflow cards on laptop and tablet screens.',
  },
  c5: {
    src: '/campaigns/holiday-push.png',
    alt: 'A festive creative studio desk with premium packaging and campaign mockups.',
  },
  c6: {
    src: '/campaigns/enterprise-onboarding.png',
    alt: 'An enterprise onboarding session in a modern executive training room.',
  },
};

const FALLBACK_IMAGE: Campaign['image'] = {
  src: '/campaigns/brand-refresh.png',
  alt: 'A refined design studio wall covered with campaign planning materials.',
};

function withCampaignImage(campaign: CampaignRecord): Campaign {
  return {
    ...campaign,
    image: CAMPAIGN_IMAGES[campaign.id] ?? FALLBACK_IMAGE,
  };
}

// Seed data so the app renders before Supabase is configured (non-production tiers only).
const SEED: Campaign[] = [
  withCampaignImage({ id: 'c1', name: 'Summer Launch', owner: 'Growth', status: 'live', updatedAt: '2026-06-24' }),
  withCampaignImage({ id: 'c2', name: 'Brand Refresh 2026', owner: 'Design', status: 'review', updatedAt: '2026-06-23' }),
  withCampaignImage({ id: 'c3', name: 'APJ Expansion', owner: 'Field', status: 'draft', updatedAt: '2026-06-22' }),
  withCampaignImage({ id: 'c4', name: 'Acrobat AI Upsell', owner: 'Document Cloud', status: 'live', updatedAt: '2026-06-21' }),
  withCampaignImage({ id: 'c5', name: 'Firefly Holiday Push', owner: 'Creative Cloud', status: 'review', updatedAt: '2026-06-20' }),
  withCampaignImage({ id: 'c6', name: 'Enterprise Onboarding', owner: 'Experience Cloud', status: 'draft', updatedAt: '2026-06-19' }),
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

    return data.map((r) => withCampaignImage({
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
