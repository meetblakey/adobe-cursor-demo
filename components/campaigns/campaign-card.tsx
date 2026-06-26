import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Campaign } from '@/lib/campaigns';

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{campaign.name}</CardTitle>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <StatusBadge status={campaign.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{campaign.owner} team</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Open
          </Button>
          <Button variant="ghost" size="sm">
            Duplicate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
