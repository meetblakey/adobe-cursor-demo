import { STATUS_FILTER_OPTIONS, type CampaignStatus } from '@/components/ui/status-tokens';

/** scheduled-status flag OFF → scheduled campaigns present as draft everywhere. */
export function shownCampaignStatus(
  status: CampaignStatus,
  scheduledStatusEnabled: boolean,
): CampaignStatus {
  return status === 'scheduled' && !scheduledStatusEnabled ? 'draft' : status;
}

/** scheduled-status flag OFF → hide the Scheduled filter entry. */
export function statusFilterOptions(scheduledStatusEnabled: boolean) {
  return scheduledStatusEnabled
    ? STATUS_FILTER_OPTIONS
    : STATUS_FILTER_OPTIONS.filter((o) => o.value !== 'scheduled');
}

/** Reset filter when flag turns off while still on the hidden Scheduled value. */
export function shouldResetScheduledFilter(
  scheduledStatusEnabled: boolean,
  currentFilter: string,
): boolean {
  return !scheduledStatusEnabled && currentFilter === 'scheduled';
}

/** Apply scheduled reset synchronously so filtering/UI never flash empty. */
export function effectiveFilterStatus(
  scheduledStatusEnabled: boolean,
  currentFilter: string,
): string {
  return shouldResetScheduledFilter(scheduledStatusEnabled, currentFilter) ? 'all' : currentFilter;
}
