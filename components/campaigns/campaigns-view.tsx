'use client';

import { useState } from 'react';
import { LayoutGridIcon, TableIcon } from 'lucide-react';
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

type ViewMode = 'table' | 'grid';

function CampaignGrid({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {campaigns.map((c, index) => (
        <CampaignCard key={c.id} campaign={c} priority={index === 0} />
      ))}
    </div>
  );
}

export function CampaignsView({ campaigns }: { campaigns: Campaign[] }) {
  const [status, setStatus] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const filtered = status === 'all' ? campaigns : campaigns.filter((c) => c.status === status);
  const statusLabel = STATUS_LABELS[status] ?? status;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-1.5">
          <h1 className="font-heading text-xl font-semibold text-balance sm:text-2xl">Campaigns</h1>
          <p className="text-sm text-pretty text-muted-foreground">
            Track launch status, owners, and channels across Adobe product lines. Open a campaign
            for assets, timeline, and approvals.
          </p>
        </div>

        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          role="toolbar"
          aria-label="Campaign controls"
        >
          <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            <div
              className="hidden h-9 shrink-0 items-center rounded-lg border bg-background p-0.5 md:inline-flex"
              role="group"
              aria-label="View mode"
            >
              <Button
                type="button"
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                className="size-8"
                aria-pressed={viewMode === 'table'}
                aria-label="Table view"
                onClick={() => setViewMode('table')}
              >
                <TableIcon aria-hidden />
              </Button>
              <Button
                type="button"
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="size-8"
                aria-pressed={viewMode === 'grid'}
                aria-label="Grid view"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGridIcon aria-hidden />
              </Button>
            </div>
            <StatusFilter value={status} onChange={setStatus} />
          </div>
          <Button size="lg" className="h-9 w-full shrink-0 whitespace-nowrap sm:w-auto">
            Create campaign
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <CampaignsEmptyState filtered={campaigns.length > 0} status={statusLabel} />
      ) : (
        <>
          <div className="md:hidden">
            <CampaignGrid campaigns={filtered} />
          </div>
          <div className="hidden md:block">
            {viewMode === 'table' ? (
              <CampaignsTable campaigns={filtered} />
            ) : (
              <CampaignGrid campaigns={filtered} />
            )}
          </div>
        </>
      )}

      <FirstFlagDemo />
    </div>
  );
}
