import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Campaign } from '@/lib/campaigns';

export function CampaignsTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell className="text-muted-foreground">{c.owner}</TableCell>
            <TableCell>
              <StatusBadge status={c.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{c.updatedAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
