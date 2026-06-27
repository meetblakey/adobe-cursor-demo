import { ImageIcon } from 'lucide-react';
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
import { assetBadgeProps } from '@/lib/campaign-status-badges';
import type { CampaignAsset } from '@/lib/campaigns-types';

const STATUS_LABELS: Record<CampaignAsset['status'], string> = {
  draft: 'Draft',
  in_review: 'In review',
  approved: 'Approved',
};

export function CampaignDetailAssets({ assets }: { assets: CampaignAsset[] }) {
  if (assets.length === 0) {
    return (
      <CampaignDetailEmpty
        icon={ImageIcon}
        title="No assets attached"
        description="Upload creative files or link docs when they are ready for review."
      />
    );
  }

  return (
    <CampaignDetailPanel>
      <Table scrollable={false} className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[46%] px-4">Asset</TableHead>
            <TableHead className="w-[24%] px-4">Type</TableHead>
            <TableHead className="w-[30%] px-4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.name}>
              <TableCell className="max-w-0 truncate px-4 font-medium">{asset.name}</TableCell>
              <TableCell className="px-4 text-muted-foreground">{asset.type}</TableCell>
              <TableCell className="px-4 whitespace-normal">
                <Badge {...assetBadgeProps(asset.status)}>{STATUS_LABELS[asset.status]}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CampaignDetailPanel>
  );
}
