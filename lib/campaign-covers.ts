/** Local creative placeholders — keep filenames stable for next/image caching. */
const COVER_BY_NAME: Record<string, string> = {
  'Summer Launch': '/campaigns/summer-launch.png',
  'Brand Refresh 2026': '/campaigns/brand-refresh.png',
  'APJ Expansion': '/campaigns/apj-expansion.png',
  'Acrobat AI Upsell': '/campaigns/ai-upsell.png',
  'Firefly Holiday Push': '/campaigns/holiday-push.png',
  'Enterprise Onboarding': '/campaigns/enterprise-onboarding.png',
};

export function getCampaignCoverUrl(name: string): string {
  return COVER_BY_NAME[name] ?? '/campaigns/brand-refresh.png';
}
