import { RadioIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CampaignDetailEmpty } from '@/components/campaigns/detail/campaign-detail-empty';
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
      <CampaignDetailEmpty
        icon={RadioIcon}
        title="No channels configured"
        description="Add channels to this campaign to track surface status and launch notes."
      />
    );
  }

  return (
    <CampaignDetailPanel>
      <Table scrollable={false} className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[22%] px-4">Channel</TableHead>
            <TableHead className="w-[18%] px-4">Status</TableHead>
            <TableHead className="w-[60%] px-4">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channelPlan.map((row) => (
            <TableRow key={row.channel}>
              <TableCell className="px-4 font-medium">{row.channel}</TableCell>
              <TableCell className="px-4 whitespace-normal">
                <Badge {...channelPlanBadgeProps(row.status)}>{STATUS_LABELS[row.status]}</Badge>
              </TableCell>
              <TableCell className="max-w-0 px-4 whitespace-normal text-muted-foreground">
                {row.note}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CampaignDetailPanel>
  );
}
