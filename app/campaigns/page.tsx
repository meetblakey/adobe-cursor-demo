import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCampaigns } from '@/lib/campaigns';
import { CampaignsView } from '@/components/campaigns/campaigns-view';
import { CampaignsLoading } from '@/components/campaigns/campaigns-loading';

export const metadata: Metadata = {
  title: 'Campaigns · Pigment Studio',
};

async function CampaignsPageContent() {
  const campaigns = await getCampaigns();
  return <CampaignsView campaigns={campaigns} />;
}

export default function CampaignsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <Suspense fallback={<CampaignsLoading />}>
        <CampaignsPageContent />
      </Suspense>
    </main>
  );
}
