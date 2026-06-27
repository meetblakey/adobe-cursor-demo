import { CalendarRangeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CampaignDetailEmpty } from '@/components/campaigns/detail/campaign-detail-empty';
import { CampaignDetailPanel } from '@/components/campaigns/detail/campaign-detail-panel';
import type { CampaignMilestone } from '@/lib/campaigns-types';

function MilestoneDot({ status }: { status: CampaignMilestone['status'] }) {
  return (
    <span
      className={cn(
        'mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-background',
        status === 'complete' && 'bg-primary',
        status === 'current' && 'bg-primary ring-2 ring-primary/30',
        status === 'upcoming' && 'bg-muted',
      )}
      aria-hidden
    />
  );
}

export function CampaignDetailTimeline({ milestones }: { milestones: CampaignMilestone[] }) {
  if (milestones.length === 0) {
    return (
      <CampaignDetailEmpty
        icon={CalendarRangeIcon}
        title="No milestones scheduled"
        description="Add launch milestones to track progress against this campaign."
      />
    );
  }

  return (
    <CampaignDetailPanel className="px-4 py-4 sm:px-5 sm:py-5">
      <ol className="flex flex-col">
        {milestones.map((milestone, index) => (
          <li key={milestone.label} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <MilestoneDot status={milestone.status} />
              {index < milestones.length - 1 ? (
                <span className="mt-2 w-px flex-1 bg-border" aria-hidden />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  milestone.status === 'upcoming' && 'text-muted-foreground',
                )}
              >
                {milestone.label}
              </span>
              <time className="text-xs text-muted-foreground">{milestone.dateLabel}</time>
            </div>
          </li>
        ))}
      </ol>
    </CampaignDetailPanel>
  );
}
