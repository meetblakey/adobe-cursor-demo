import type { CampaignStatus } from '@/components/ui/status-badge';

type SeedCampaign = {
  id: string;
  name: string;
  owner: string;
  status: CampaignStatus;
  updatedAt: string;
  summary: string;
  channels: string[];
  campaignType: string;
};

/** Canonical campaign seed — keep supabase/migrations/0002 backfill in sync. */
export const CAMPAIGN_SEED: SeedCampaign[] = [
  {
    id: 'c1',
    name: 'Summer Launch',
    owner: 'Growth',
    status: 'live',
    updatedAt: '2026-06-24',
    campaignType: 'Product launch',
    summary: 'Seasonal Creative Cloud feature push across digital surfaces.',
    channels: ['In-app', 'Email', 'Web'],
  },
  {
    id: 'c2',
    name: 'Brand Refresh 2026',
    owner: 'Design',
    status: 'review',
    updatedAt: '2026-06-23',
    campaignType: 'Brand awareness',
    summary: 'Cross-product visual identity rollout for 200+ Pigment surfaces.',
    channels: ['Design system', 'In-app'],
  },
  {
    id: 'c3',
    name: 'APJ Expansion',
    owner: 'Field',
    status: 'draft',
    updatedAt: '2026-06-22',
    campaignType: 'Lead generation',
    summary: 'Enterprise trial go-to-market for APJ field teams.',
    channels: ['Field events', 'Email'],
  },
  {
    id: 'c4',
    name: 'Acrobat AI Upsell',
    owner: 'Document Cloud',
    status: 'live',
    updatedAt: '2026-06-21',
    campaignType: 'Product launch',
    summary: 'Document Cloud AI tier upgrade for existing subscribers.',
    channels: ['In-app', 'Email', 'Paid social'],
  },
  {
    id: 'c5',
    name: 'Firefly Holiday Push',
    owner: 'Creative Cloud',
    status: 'review',
    updatedAt: '2026-06-20',
    campaignType: 'Brand awareness',
    summary: 'Holiday generative-AI awareness and trial activation.',
    channels: ['Social', 'Email', 'Web'],
  },
  {
    id: 'c6',
    name: 'Enterprise Onboarding',
    owner: 'Experience Cloud',
    status: 'archived',
    updatedAt: '2026-06-19',
    campaignType: 'Lead generation',
    summary: 'Experience Cloud admin onboarding for new enterprise tenants.',
    channels: ['Email', 'In-app', 'Sales enablement'],
  },
];
