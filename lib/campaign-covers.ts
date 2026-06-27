/** Local creative placeholders — keep filenames stable for next/image caching. */
const COVER_BY_NAME: Record<string, string> = {
  'Summer Launch': '/campaigns/summer-launch.svg',
  'Brand Refresh 2026': '/campaigns/brand-refresh.svg',
  'APJ Expansion': '/campaigns/apj-expansion.svg',
  'Acrobat AI Upsell': '/campaigns/acrobat-ai.svg',
  'Firefly Holiday Push': '/campaigns/firefly-holiday.svg',
  'Enterprise Onboarding': '/campaigns/enterprise-onboarding.svg',
};

export function getCampaignCoverUrl(name: string): string {
  return COVER_BY_NAME[name] ?? '/campaigns/campaign-default.svg';
}
