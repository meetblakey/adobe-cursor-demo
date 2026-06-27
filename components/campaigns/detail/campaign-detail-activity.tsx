import { Separator } from '@/components/ui/separator';
import { CampaignDetailPanel } from '@/components/campaigns/detail/campaign-detail-panel';
import type { CampaignActivity } from '@/lib/campaigns-types';

export function CampaignDetailActivity({ activity }: { activity: CampaignActivity[] }) {
  if (activity.length === 0) {
    return (
      <CampaignDetailPanel className="p-6">
        <p className="text-sm text-muted-foreground">No recent activity.</p>
      </CampaignDetailPanel>
    );
  }

  return (
    <CampaignDetailPanel className="px-4">
      <ul className="flex flex-col">
      {activity.map((event, index) => (
        <li key={`${event.at}-${event.actor}`}>
          <div className="flex flex-col gap-0.5 py-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
              <span className="font-medium">{event.actor}</span>
              <span className="text-muted-foreground">{event.action}</span>
            </div>
            <span className="text-xs text-muted-foreground">{event.atLabel}</span>
          </div>
          {index < activity.length - 1 ? <Separator /> : null}
        </li>
      ))}
      </ul>
    </CampaignDetailPanel>
  );
}
