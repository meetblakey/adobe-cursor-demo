import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignDetailActivity } from '@/components/campaigns/detail/campaign-detail-activity';
import { CampaignDetailApprovals } from '@/components/campaigns/detail/campaign-detail-approvals';
import { CampaignDetailAssets } from '@/components/campaigns/detail/campaign-detail-assets';
import { CampaignDetailBreadcrumb } from '@/components/campaigns/detail/campaign-detail-breadcrumb';
import { CampaignDetailChannels } from '@/components/campaigns/detail/campaign-detail-channels';
import { CampaignDetailHero } from '@/components/campaigns/detail/campaign-detail-hero';
import { CampaignDetailOverview } from '@/components/campaigns/detail/campaign-detail-overview';
import { CampaignDetailStakeholders } from '@/components/campaigns/detail/campaign-detail-stakeholders';
import { CampaignDetailTabs } from '@/components/campaigns/detail/campaign-detail-tabs';
import { CampaignDetailTimeline } from '@/components/campaigns/detail/campaign-detail-timeline';
import type { CampaignDetail } from '@/lib/campaign-details';

export function CampaignDetailPageView({ campaign }: { campaign: CampaignDetail }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <CampaignDetailBreadcrumb campaignName={campaign.name} />
      <CampaignDetailHero campaign={campaign} />

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] xl:grid-cols-[minmax(0,1fr)_18.75rem]">
        <CampaignDetailTabs
          overview={<CampaignDetailOverview campaign={campaign} />}
          channels={<CampaignDetailChannels channelPlan={campaign.channelPlan} />}
          timeline={<CampaignDetailTimeline milestones={campaign.milestones} />}
          assets={<CampaignDetailAssets assets={campaign.assets} />}
          activity={<CampaignDetailActivity activity={campaign.activity} />}
        />

        <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(3.5rem+1.5rem+env(safe-area-inset-top,0px))] lg:self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Stakeholders</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignDetailStakeholders stakeholders={campaign.stakeholders} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approvals</CardTitle>
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
