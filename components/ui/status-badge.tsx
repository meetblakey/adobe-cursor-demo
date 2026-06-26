'use client';

import { useTheme } from '@/components/theme-provider';

export type CampaignStatus = 'draft' | 'live' | 'review';

// Semantic status tokens — platform-owned source of truth for the StatusBadge.
// Each pair must clear WCAG AA in BOTH themes; status-badge.test.ts enforces it.
export const STATUS_TOKENS: Record<
  CampaignStatus,
  { label: string; light: { bg: string; fg: string }; dark: { bg: string; fg: string } }
> = {
  draft: { label: 'Draft', light: { bg: '#EDEDEA', fg: '#44443F' }, dark: { bg: '#26262F', fg: '#B9B9B2' } },
  live: { label: 'Live', light: { bg: '#DCF5E4', fg: '#0F6B33' }, dark: { bg: '#14331F', fg: '#57D98A' } },
  review: { label: 'In review', light: { bg: '#FFF1D6', fg: '#8A4B00' }, dark: { bg: '#3A2A12', fg: '#E0A24E' } },
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const { theme } = useTheme();
  const token = STATUS_TOKENS[status][theme];
  return (
    <span
      style={{ backgroundColor: token.bg, color: token.fg }}
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    >
      {STATUS_TOKENS[status].label}
    </span>
  );
}
