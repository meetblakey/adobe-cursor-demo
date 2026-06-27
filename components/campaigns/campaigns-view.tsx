'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FirstFlagDemo } from '@/components/campaigns/first-flag-demo';
import { StatusFilter } from '@/components/campaigns/status-filter';
import { CampaignCard } from '@/components/campaigns/campaign-card';
import { CampaignsTable } from '@/components/campaigns/campaigns-table';
import { CampaignsEmptyState } from '@/components/campaigns/campaigns-empty-state';
import type { Campaign } from '@/lib/campaigns';

const STATUS_LABELS: Record<string, string> = {
  all: 'All statuses',
  draft: 'Draft',
  live: 'Live',
  review: 'In review',
};

export function CampaignsView({ campaigns }: { campaigns: Campaign[] }) {
  const [status, setStatus] = useState('all');
  const filtered = status === 'all' ? campaigns : campaigns.filter((c) => c.status === status);
  const statusLabel = STATUS_LABELS[status] ?? status;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-semibold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Coordinate marketing launches across Adobe product lines: track status, owner, and
            channels in one place. Select a campaign to view launch plan, assets, and approvals.
          </p>
          <p className="text-xs text-muted-foreground">
            Built from the Pigment design system: one of 200+ product surfaces.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'campaign' : 'campaigns'}
          </span>
          <StatusFilter value={status} onChange={setStatus} />
          <Button size="sm">New campaign</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <CampaignsEmptyState filtered={campaigns.length > 0} status={statusLabel} />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border bg-card">
            <CampaignsTable campaigns={filtered} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, index) => (
              <CampaignCard key={c.id} campaign={c} priority={index === 0} />
            ))}
          </div>
        </>
      )}

      <FirstFlagDemo />
    </div>
  );
}
