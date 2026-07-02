import { STATUS_FILTER_OPTIONS, type CampaignStatus } from '@/components/ui/status-tokens';

/** scheduled-status flag OFF → scheduled campaigns present as draft on every surface. */
export function shownCampaignStatus(
  status: CampaignStatus,
  scheduledStatusFlag: boolean,
): CampaignStatus {
  return status === 'scheduled' && !scheduledStatusFlag ? 'draft' : status;
}

/** scheduled-status flag OFF → no Scheduled filter entry. */
export function getStatusFilterOptions(scheduledStatusFlag: boolean) {
  return scheduledStatusFlag
    ? STATUS_FILTER_OPTIONS
    : STATUS_FILTER_OPTIONS.filter((o) => o.value !== 'scheduled');
}

/** scheduled-status flag OFF while filter is Scheduled → reset to all. */
export function shouldResetScheduledFilter(
  scheduledStatusFlag: boolean,
  currentStatus: string,
): boolean {
  return !scheduledStatusFlag && currentStatus === 'scheduled';
}
