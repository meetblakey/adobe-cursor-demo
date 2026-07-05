import { describe, expect, it } from 'vitest';

import {
  shownCampaignStatus,
  shouldResetScheduledFilter,
  statusFilterOptions,
} from '@/lib/campaign-status';
import { STATUS_FILTER_OPTIONS } from '@/components/ui/status-tokens';

describe('shownCampaignStatus', () => {
  it('shows scheduled when the scheduled-status flag is on', () => {
    expect(shownCampaignStatus('scheduled', true)).toBe('scheduled');
  });

  it('presents scheduled as draft when the scheduled-status flag is off', () => {
    expect(shownCampaignStatus('scheduled', false)).toBe('draft');
  });

  it('leaves non-scheduled statuses unchanged regardless of flag', () => {
    for (const status of ['draft', 'live', 'review', 'archived'] as const) {
      expect(shownCampaignStatus(status, true)).toBe(status);
      expect(shownCampaignStatus(status, false)).toBe(status);
    }
  });
});

describe('statusFilterOptions', () => {
  it('includes Scheduled when the scheduled-status flag is on', () => {
    const options = statusFilterOptions(true);
    expect(options).toEqual(STATUS_FILTER_OPTIONS);
    expect(options.some((o) => o.value === 'scheduled')).toBe(true);
  });

  it('omits Scheduled when the scheduled-status flag is off', () => {
    const options = statusFilterOptions(false);
    expect(options.some((o) => o.value === 'scheduled')).toBe(false);
    expect(options).toEqual(STATUS_FILTER_OPTIONS.filter((o) => o.value !== 'scheduled'));
  });
});

describe('shouldResetScheduledFilter', () => {
  it('resets when flag is off and filter is stuck on scheduled', () => {
    expect(shouldResetScheduledFilter(false, 'scheduled')).toBe(true);
  });

  it('does not reset when flag is on', () => {
    expect(shouldResetScheduledFilter(true, 'scheduled')).toBe(false);
  });

  it('does not reset other filter values when flag is off', () => {
    expect(shouldResetScheduledFilter(false, 'all')).toBe(false);
    expect(shouldResetScheduledFilter(false, 'draft')).toBe(false);
  });
});

describe('scheduled-status filter matching', () => {
  const campaigns = [
    { id: '1', status: 'scheduled' as const },
    { id: '2', status: 'draft' as const },
  ];

  function filterByStatus(
    items: typeof campaigns,
    filter: string,
    scheduledStatusEnabled: boolean,
  ) {
    const shown = (c: (typeof campaigns)[number]) =>
      shownCampaignStatus(c.status, scheduledStatusEnabled);
    return filter === 'all' ? items : items.filter((c) => shown(c) === filter);
  }

  it('matches scheduled rows as draft when flag is off', () => {
    expect(filterByStatus(campaigns, 'draft', false)).toEqual([campaigns[0], campaigns[1]]);
    expect(filterByStatus(campaigns, 'scheduled', false)).toEqual([]);
  });

  it('matches scheduled rows normally when flag is on', () => {
    expect(filterByStatus(campaigns, 'draft', true)).toEqual([campaigns[1]]);
    expect(filterByStatus(campaigns, 'scheduled', true)).toEqual([campaigns[0]]);
  });
});
