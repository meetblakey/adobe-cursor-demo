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

export function CampaignsTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Channels</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <CampaignCoverImage
                  src={c.coverImage}
                  alt={`${c.name} cover`}
                  className="size-10 shrink-0 rounded-lg"
                  sizes="40px"
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <Link
                    href={`/campaigns/${c.slug}`}
                    className="truncate font-medium hover:underline"
                  >
                    {c.name}
                  </Link>
                  <span className="truncate text-sm text-muted-foreground">{c.summary}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CampaignOwnerAvatar owner={c.owner} />
                <span>{c.owner}</span>
              </div>
            </TableCell>
            <TableCell>
              <CampaignMetaChips
                campaignType={c.campaignType}
                channels={c.channels}
                showChannels={false}
              />
            </TableCell>
            <TableCell>
              <CampaignMetaChips
                campaignType={c.campaignType}
                channels={c.channels}
                showType={false}
              />
            </TableCell>
            <TableCell>
              <StatusBadge status={c.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{c.updatedAtLabel}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
