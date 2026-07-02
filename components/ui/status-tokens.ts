// Platform-owned status token data. Kept Spectrum-free (no React, no CSS
// imports) so the a11y gate (status-badge.test.ts) can import it under Node
// without pulling in Adobe React Spectrum's bundled stylesheets.

export type CampaignStatus = 'draft' | 'live' | 'review' | 'archived';

// Source of truth for the legacy StatusBadge path — now the pre-hydration SSR
// fallback, since Spectrum is the default. Each pair must clear WCAG AA in BOTH
// themes; status-badge.test.ts enforces it. This is the hand-authored hex map
// whose failure mode INJURY B exploits — and which the rendered Spectrum path
// makes obsolete.
export const STATUS_TOKENS: Record<
  CampaignStatus,
  { label: string; light: { bg: string; fg: string }; dark: { bg: string; fg: string } }
> = {
  draft: { label: 'Draft', light: { bg: '#EDEDEA', fg: '#44443F' }, dark: { bg: '#26262F', fg: '#B9B9B2' } },
  live: { label: 'Live', light: { bg: '#DCF5E4', fg: '#0F6B33' }, dark: { bg: '#14331F', fg: '#57D98A' } },
  review: { label: 'In review', light: { bg: '#FFF1D6', fg: '#8A4B00' }, dark: { bg: '#3A2A12', fg: '#E0A24E' } },
  archived: { label: 'Archived', light: { bg: '#E7E9EC', fg: '#3A4250' }, dark: { bg: '#2B313B', fg: '#A9B2C0' } },
};

// Spectrum path (the rendered default): semantic StatusLight variants,
// pre-validated AA in light + dark by Spectrum — there is no hand-authored hex
// left to get wrong. status-badge.spectrum.test.ts asserts these stay semantic.
export const SPECTRUM_STATUS: Record<CampaignStatus, 'neutral' | 'positive' | 'notice'> = {
  draft: 'neutral',
  live: 'positive',
  review: 'notice',
  archived: 'neutral',
};

// Filter options + human labels are DERIVED from STATUS_TOKENS — the one
// exhaustive, compiler-checked source of truth. Adding a status there is forced
// to add its token + Spectrum entry, and it then propagates to the filter and
// labels automatically, so there is no second place to forget.
export const CAMPAIGN_STATUSES = Object.keys(STATUS_TOKENS) as CampaignStatus[];

export const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  ...CAMPAIGN_STATUSES.map((status) => ({ value: status, label: STATUS_TOKENS[status].label })),
];
