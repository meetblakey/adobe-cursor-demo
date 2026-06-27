import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CampaignDetail } from '@/lib/campaign-details';

export function CampaignDetailOverview({ campaign }: { campaign: CampaignDetail }) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Objective</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{campaign.objective}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audience</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{campaign.audience}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key message</CardTitle>
        </CardHeader>
        <CardContent className="text-sm font-medium">{campaign.keyMessage}</CardContent>
      </Card>
    </div>
  );
}
