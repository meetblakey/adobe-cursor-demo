import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { CampaignCoverImage } from '@/components/campaigns/campaign-cover-image';
import { CampaignMetaChips } from '@/components/campaigns/campaign-meta-chips';
import { CampaignOwnerAvatar } from '@/components/campaigns/campaign-owner-avatar';
import type { Campaign } from '@/lib/campaigns';
import { cn } from '@/lib/utils';

export function CampaignsTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Table
      scrollable={false}
      className={cn(
        'table-fixed',
        '[&_th]:pr-4 [&_td]:pr-4',
        '[&_th:first-child]:pl-2 [&_td:first-child]:pl-2',
        '[&_th:last-child]:pr-2 [&_td:last-child]:pr-2',
        '[&_th:not(:first-child)]:pl-4 [&_td:not(:first-child)]:pl-4',
        '[&_th:not(:first-child)]:text-right [&_td:not(:first-child)]:text-right',
        '[&_tbody_td:first-child]:align-top',
      )}
    >
      <TableHeader className="[&_tr]:border-0">
        <TableRow className="border-0 hover:bg-transparent">
          <TableHead className="h-auto w-[46%] pb-3">Campaign</TableHead>
          <TableHead className="h-auto w-[22%] pb-3">Owner</TableHead>
          <TableHead className="h-auto w-[16%] pb-3">Status</TableHead>
          <TableHead className="h-auto w-[16%] pb-3">Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => (
          <TableRow key={c.id} className="border-0 hover:bg-muted/30">
            <TableCell className="max-w-0 py-5 whitespace-normal">
              <div className="flex min-w-0 items-start gap-3">
                <CampaignCoverImage
                  src={c.coverImage}
                  alt={`${c.name} cover`}
                  className="size-10 shrink-0 rounded-lg"
                  sizes="40px"
                />
                <div className="flex min-w-0 flex-col gap-2.5">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <Link
                      href={`/campaigns/${c.slug}`}
                      className="truncate font-medium hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {c.name}
                    </Link>
                    <span className="line-clamp-1 text-sm text-muted-foreground">{c.summary}</span>
                  </div>
                  <CampaignMetaChips campaignType={c.campaignType} channels={c.channels} />
                </div>
              </div>
            </TableCell>
            <TableCell className="max-w-0 py-5 whitespace-normal">
              <div className="flex min-w-0 items-center justify-end gap-2 text-muted-foreground">
                <CampaignOwnerAvatar owner={c.owner} />
                <span className="truncate">{c.owner}</span>
              </div>
            </TableCell>
            <TableCell className="py-5 whitespace-normal">
              <StatusBadge status={c.status} />
            </TableCell>
            <TableCell className="truncate py-5 text-muted-foreground">
              {c.updatedAtLabel}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
