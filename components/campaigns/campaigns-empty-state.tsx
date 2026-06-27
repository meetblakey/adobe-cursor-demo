import { MegaphoneIcon } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function CampaignsEmptyState({
  filtered,
  status,
}: {
  filtered: boolean;
  status: string;
}) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MegaphoneIcon />
        </EmptyMedia>
        <EmptyTitle>{filtered ? 'No matching campaigns' : 'No campaigns yet'}</EmptyTitle>
        <EmptyDescription>
          {filtered
            ? `Nothing matches the "${status}" filter. Try another status or create a new campaign.`
            : 'Create your first campaign to coordinate launches across product lines.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent />
    </Empty>
  );
}
