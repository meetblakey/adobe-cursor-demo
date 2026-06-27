import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CampaignDetailLoading } from '@/components/campaigns/detail/campaign-detail-loading';
import { CampaignDetailPageView } from '@/components/campaigns/detail/campaign-detail-page';
import { getAllCampaignSlugs, getCampaignDetail } from '@/lib/campaign-details';

export async function generateStaticParams() {
  return getAllCampaignSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignDetail(slug);
  if (!campaign) return {};
  return { title: `${campaign.name} · Pigment Studio` };
}

async function CampaignDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await getCampaignDetail(slug);
  if (!campaign) notFound();
  return <CampaignDetailPageView campaign={campaign} />;
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <Suspense fallback={<CampaignDetailLoading />}>
        <CampaignDetailContent params={params} />
      </Suspense>
    </main>
  );
}
