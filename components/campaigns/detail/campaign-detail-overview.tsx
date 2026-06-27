import type { ReactNode } from 'react';
import { CampaignDetailPanel } from '@/components/campaigns/detail/campaign-detail-panel';
import type { CampaignDetail } from '@/lib/campaign-details';

function OverviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="px-4 py-4 sm:px-5 sm:py-5">
      <h2 className="mb-2 text-sm font-medium">{title}</h2>
      {children}
    </section>
  );
}

export function CampaignDetailOverview({ campaign }: { campaign: CampaignDetail }) {
  return (
    <CampaignDetailPanel className="divide-y divide-border">
      <OverviewSection title="Objective">
        <p className="text-sm text-pretty text-muted-foreground">{campaign.objective}</p>
      </OverviewSection>
      <OverviewSection title="Audience">
        <p className="text-sm text-pretty text-muted-foreground">{campaign.audience}</p>
      </OverviewSection>
      <OverviewSection title="Key message">
        <p className="text-sm text-pretty font-medium text-foreground">{campaign.keyMessage}</p>
      </OverviewSection>
    </CampaignDetailPanel>
  );
}
