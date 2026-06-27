import { HistoryIcon } from 'lucide-react';
import { CampaignDetailEmpty } from '@/components/campaigns/detail/campaign-detail-empty';
import { CampaignDetailPanel } from '@/components/campaigns/detail/campaign-detail-panel';
import type { CampaignActivity } from '@/lib/campaigns-types';

export function CampaignDetailActivity({ activity }: { activity: CampaignActivity[] }) {
  if (activity.length === 0) {
    return (
      <CampaignDetailEmpty
        icon={HistoryIcon}
        title="No recent activity"
        description="Updates from owners and reviewers will appear here as the campaign moves forward."
      />
    );
  }

  return (
    <CampaignDetailPanel className="divide-y divide-border px-4 sm:px-5">
      <ul>
        {activity.map((event) => (
          <li key={`${event.at}-${event.actor}-${event.action}`}>
            <div className="flex flex-col gap-1 py-4">
              <p className="text-sm text-pretty">
                <span className="font-medium">{event.actor}</span>{' '}
                <span className="text-muted-foreground">{event.action}</span>
              </p>
              <time className="text-xs text-muted-foreground" dateTime={event.at}>
                {event.atLabel}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </CampaignDetailPanel>
  );
}
