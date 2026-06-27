/** Stable URL slugs — keep in sync with generateStaticParams and detail seed keys. */
const SLUG_BY_NAME: Record<string, string> = {
  'Summer Launch': 'summer-launch',
  'Brand Refresh 2026': 'brand-refresh-2026',
  'APJ Expansion': 'apj-expansion',
  'Acrobat AI Upsell': 'acrobat-ai-upsell',
  'Firefly Holiday Push': 'firefly-holiday-push',
  'Enterprise Onboarding': 'enterprise-onboarding',
};

const NAME_BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_BY_NAME).map(([name, slug]) => [slug, name]),
);

export function getCampaignSlug(name: string): string {
  return SLUG_BY_NAME[name] ?? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function getCampaignNameBySlug(slug: string): string | undefined {
  return NAME_BY_SLUG[slug];
}

export function getAllCampaignSlugs(): string[] {
  return Object.values(SLUG_BY_NAME);
}
