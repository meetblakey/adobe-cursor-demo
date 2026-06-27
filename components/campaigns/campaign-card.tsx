import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Campaign } from '@/lib/campaigns';

export function CampaignCard({
  campaign,
  priority = false,
}: {
  campaign: Campaign;
  priority?: boolean;
}) {
  return (
    <Card className="gap-0 py-0">
      <div className="relative aspect-4/3 overflow-hidden rounded-t-xl bg-muted">
        <Image
          src={campaign.image.src}
          alt={campaign.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          priority={priority}
          className="object-cover"
        />
      </div>
      <CardHeader className="pt-4">
        <CardTitle>{campaign.name}</CardTitle>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <StatusBadge status={campaign.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pb-4">
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
