import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CampaignDetailPanel } from '@/components/campaigns/detail/campaign-detail-panel';
import { channelPlanBadgeProps } from '@/lib/campaign-status-badges';
import type { CampaignChannelPlan } from '@/lib/campaigns-types';

const STATUS_LABELS: Record<CampaignChannelPlan['status'], string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  live: 'Live',
  in_review: 'In review',
};

export function CampaignDetailChannels({ channelPlan }: { channelPlan: CampaignChannelPlan[] }) {
  if (channelPlan.length === 0) {
    return (
      <CampaignDetailPanel className="p-6">
        <p className="text-sm text-muted-foreground">No channels configured for this campaign.</p>
      </CampaignDetailPanel>
    );
  }

  return (
    <CampaignDetailPanel>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Channel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channelPlan.map((row) => (
            <TableRow key={row.channel}>
              <TableCell className="font-medium">{row.channel}</TableCell>
              <TableCell>
                <Badge {...channelPlanBadgeProps(row.status)}>
                  {STATUS_LABELS[row.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{row.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CampaignDetailPanel>
  );
}
