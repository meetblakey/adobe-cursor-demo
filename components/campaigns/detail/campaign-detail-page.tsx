import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignDetailActivity } from '@/components/campaigns/detail/campaign-detail-activity';
import { CampaignDetailApprovals } from '@/components/campaigns/detail/campaign-detail-approvals';
import { CampaignDetailAssets } from '@/components/campaigns/detail/campaign-detail-assets';
import { CampaignDetailBreadcrumb } from '@/components/campaigns/detail/campaign-detail-breadcrumb';
import { CampaignDetailChannels } from '@/components/campaigns/detail/campaign-detail-channels';
import {
  CampaignDetailContext,
  CampaignDetailHero,
} from '@/components/campaigns/detail/campaign-detail-hero';
import { CampaignDetailOverview } from '@/components/campaigns/detail/campaign-detail-overview';
import { CampaignDetailStakeholders } from '@/components/campaigns/detail/campaign-detail-stakeholders';
import { CampaignDetailTabs } from '@/components/campaigns/detail/campaign-detail-tabs';
import { CampaignDetailTimeline } from '@/components/campaigns/detail/campaign-detail-timeline';
import type { CampaignDetail } from '@/lib/campaign-details';

export function CampaignDetailPageView({ campaign }: { campaign: CampaignDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <CampaignDetailBreadcrumb campaignName={campaign.name} />
      <CampaignDetailHero campaign={campaign} />
      <CampaignDetailContext />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <CampaignDetailTabs
          overview={<CampaignDetailOverview campaign={campaign} />}
          channels={<CampaignDetailChannels channelPlan={campaign.channelPlan} />}
          timeline={<CampaignDetailTimeline milestones={campaign.milestones} />}
          assets={<CampaignDetailAssets assets={campaign.assets} />}
          activity={<CampaignDetailActivity activity={campaign.activity} />}
        />

        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stakeholders</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignDetailStakeholders stakeholders={campaign.stakeholders} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignDetailApprovals approvals={campaign.approvals} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
