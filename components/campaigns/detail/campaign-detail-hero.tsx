import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { CampaignCoverImage } from '@/components/campaigns/campaign-cover-image';
import { CampaignMetaChips } from '@/components/campaigns/campaign-meta-chips';
import { CampaignOwnerAvatar } from '@/components/campaigns/campaign-owner-avatar';
import { formatCampaignDateRange } from '@/lib/campaigns-format';
import type { CampaignDetail } from '@/lib/campaign-details';

export function CampaignDetailHero({ campaign }: { campaign: CampaignDetail }) {
  return (
    <div className="flex flex-col gap-4">
      <CampaignCoverImage
        src={campaign.coverImage}
        alt={`${campaign.name} cover`}
        priority
        className="aspect-21/9 w-full rounded-xl"
        sizes="(max-width: 1024px) 100vw, 960px"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-xl font-semibold">{campaign.name}</h1>
            <StatusBadge status={campaign.status} />
          </div>
          <p className="text-sm text-muted-foreground">{campaign.summary}</p>
          <CampaignMetaChips
            campaignType={campaign.campaignType}
            channels={campaign.channels}
          />
        </div>
        <div className="flex shrink-0 flex-col gap-1 text-sm text-muted-foreground sm:items-end sm:text-right">
          <div className="flex items-center gap-2">
            <CampaignOwnerAvatar owner={campaign.owner} />
            <span>{campaign.owner} team</span>
          </div>
          <span>{formatCampaignDateRange(campaign.startDate, campaign.endDate)}</span>
          <span>Updated {campaign.updatedAtLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function CampaignDetailContext() {
  return (
    <Card>
      <CardContent className="text-sm text-muted-foreground">
        <strong className="font-medium text-foreground">Pigment Studio Campaigns</strong> helps Adobe
        internal GTM teams plan multi-surface launches across Creative Cloud, Document Cloud, and
        Experience Cloud: channels, assets, and approvals before anything ships to customers.
      </CardContent>
    </Card>
  );
}
