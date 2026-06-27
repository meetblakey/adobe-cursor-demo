import type { ComponentType } from 'react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { CampaignDetailPanel } from '@/components/campaigns/detail/campaign-detail-panel';

export function CampaignDetailEmpty({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <CampaignDetailPanel>
      <Empty className="border-0 py-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </CampaignDetailPanel>
  );
}
