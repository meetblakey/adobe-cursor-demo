import Link from 'next/link';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { CampaignCoverImage } from '@/components/campaigns/campaign-cover-image';
import { CampaignMetaChips } from '@/components/campaigns/campaign-meta-chips';
import { CampaignOwnerAvatar } from '@/components/campaigns/campaign-owner-avatar';
import type { Campaign } from '@/lib/campaigns';

export function CampaignCard({
  campaign,
  priority = false,
}: {
  campaign: Campaign;
  priority?: boolean;
}) {
  return (
    <Card className="overflow-hidden pt-0">
      <CampaignCoverImage
        src={campaign.coverImage}
        alt={`${campaign.name} cover`}
        className="aspect-2/1 w-full"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
      />
      <CardHeader>
        <CardTitle>{campaign.name}</CardTitle>
        <CardDescription className="line-clamp-2">{campaign.summary}</CardDescription>
        <CardAction>
          <StatusBadge status={campaign.status} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CampaignOwnerAvatar owner={campaign.owner} />
          <span>{campaign.owner} team</span>
        </div>
        <CampaignMetaChips campaignType={campaign.campaignType} channels={campaign.channels} />
      </CardContent>
      <CardFooter className="gap-2 border-t-0 bg-transparent">
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/campaigns/${campaign.slug}`} />}
          nativeButton={false}
        >
          Open
        </Button>
        <Button variant="ghost" size="sm">
          Duplicate
        </Button>
      </CardFooter>
    </Card>
  );
}
