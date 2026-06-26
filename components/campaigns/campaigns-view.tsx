'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusFilter } from '@/components/campaigns/status-filter';
import { CampaignCard } from '@/components/campaigns/campaign-card';
import { CampaignsTable } from '@/components/campaigns/campaigns-table';
import type { Campaign } from '@/lib/campaigns';

export function CampaignsView({ campaigns }: { campaigns: Campaign[] }) {
  const [status, setStatus] = useState('all');
  const filtered = status === 'all' ? campaigns : campaigns.filter((c) => c.status === status);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-semibold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Built from the Pigment design system — one of 200+ product surfaces.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusFilter value={status} onChange={setStatus} />
          <Button size="sm">New campaign</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      <div className="rounded-xl border">
        <CampaignsTable campaigns={filtered} />
      </div>
    </div>
  );
}
