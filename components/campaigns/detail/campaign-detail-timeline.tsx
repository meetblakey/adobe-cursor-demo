import { cn } from '@/lib/utils';
import { CampaignDetailPanel } from '@/components/campaigns/detail/campaign-detail-panel';
import type { CampaignMilestone } from '@/lib/campaigns-types';

export function CampaignDetailTimeline({ milestones }: { milestones: CampaignMilestone[] }) {
  if (milestones.length === 0) {
    return (
      <CampaignDetailPanel className="p-6">
        <p className="text-sm text-muted-foreground">No milestones scheduled.</p>
      </CampaignDetailPanel>
    );
  }

  return (
    <CampaignDetailPanel className="p-6">
      <ol className="relative flex flex-col gap-0 border-l border-border pl-6">
      {milestones.map((milestone) => (
        <li key={milestone.label} className="relative pb-6 last:pb-0">
          <span
            className={cn(
              'absolute -left-[calc(0.75rem+1px)] top-1 size-2.5 rounded-full border-2 border-background',
              milestone.status === 'complete' && 'bg-primary',
              milestone.status === 'current' && 'bg-primary ring-2 ring-primary/30',
              milestone.status === 'upcoming' && 'bg-muted',
            )}
            aria-hidden
          />
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                'text-sm font-medium',
                milestone.status === 'upcoming' && 'text-muted-foreground',
              )}
            >
              {milestone.label}
            </span>
            <span className="text-xs text-muted-foreground">{milestone.dateLabel}</span>
          </div>
        </li>
      ))}
      </ol>
    </CampaignDetailPanel>
  );
}
