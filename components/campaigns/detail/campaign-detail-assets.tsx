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
      <CampaignDetailPanel className="p-6">
        <p className="text-sm text-muted-foreground">No creative assets attached yet.</p>
      </CampaignDetailPanel>
    );
  }

  return (
    <CampaignDetailPanel>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.name}>
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell className="text-muted-foreground">{asset.type}</TableCell>
              <TableCell>
                <Badge {...assetBadgeProps(asset.status)}>{STATUS_LABELS[asset.status]}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CampaignDetailPanel>
  );
}
