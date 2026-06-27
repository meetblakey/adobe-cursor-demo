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
        className="aspect-[16/10] w-full rounded-xl sm:aspect-21/9"
        sizes="(max-width: 1024px) 100vw, 960px"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-xl font-semibold text-balance">{campaign.name}</h1>
            <StatusBadge status={campaign.status} />
          </div>
          <p className="max-w-2xl text-sm text-pretty text-muted-foreground">{campaign.summary}</p>
          <CampaignMetaChips campaignType={campaign.campaignType} channels={campaign.channels} />
        </div>
        <dl className="flex shrink-0 flex-col gap-2 text-sm sm:items-end sm:text-right">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CampaignOwnerAvatar owner={campaign.owner} />
            <div>
              <dt className="sr-only">Owner</dt>
              <dd>{campaign.owner} team</dd>
            </div>
          </div>
          <div>
            <dt className="sr-only">Schedule</dt>
            <dd className="text-muted-foreground">
              {formatCampaignDateRange(campaign.startDate, campaign.endDate)}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Last updated</dt>
            <dd className="text-xs text-muted-foreground">Updated {campaign.updatedAtLabel}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
