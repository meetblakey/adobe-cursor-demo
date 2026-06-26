import type { Metadata } from 'next';
import { getCampaigns } from '@/lib/campaigns';
import { CampaignsView } from '@/components/campaigns/campaigns-view';

export const metadata: Metadata = {
  title: 'Campaigns · Pigment Studio',
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <CampaignsView campaigns={campaigns} />
    </main>
  );
}
