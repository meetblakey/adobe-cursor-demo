import Link from 'next/link';
import { AdobeLogo } from '@/components/adobe-logo';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';

export default function CampaignNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-16">
      <AdobeLogo iconSize={24} />
      <Empty className="w-full border">
        <EmptyHeader>
          <EmptyTitle>Campaign not found</EmptyTitle>
          <EmptyDescription>
            This campaign does not exist or may have been archived. Return to the campaigns list to
            browse active launches.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href="/campaigns" />} nativeButton={false} size="sm">
            Back to campaigns
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
