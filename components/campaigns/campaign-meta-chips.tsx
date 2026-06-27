import { Badge } from '@/components/ui/badge';
import type { Campaign } from '@/lib/campaigns';

export function CampaignMetaChips({
  campaignType,
  channels,
  showType = true,
  showChannels = true,
}: Pick<Campaign, 'campaignType' | 'channels'> & {
  showType?: boolean;
  showChannels?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {showType && campaignType ? (
        <Badge variant="outline" className="text-muted-foreground">
          {campaignType}
        </Badge>
      ) : null}
      {showChannels
        ? channels.map((channel) => (
            <Badge key={channel} variant="outline" className="text-muted-foreground">
              {channel}
            </Badge>
          ))
        : null}
    </div>
  );
}
