import { describe, expect, it } from 'vitest';
import {
  getStatusFilterOptions,
  shouldResetScheduledFilter,
  shownCampaignStatus,
} from '@/lib/scheduled-status';

describe('scheduled-status flag gating', () => {
  describe('shownCampaignStatus', () => {
    it('presents scheduled as draft when flag is OFF', () => {
      expect(shownCampaignStatus('scheduled', false)).toBe('draft');
    });

    it('presents scheduled as Scheduled when flag is ON', () => {
      expect(shownCampaignStatus('scheduled', true)).toBe('scheduled');
    });

    it('leaves non-scheduled statuses unchanged', () => {
      expect(shownCampaignStatus('live', false)).toBe('live');
      expect(shownCampaignStatus('live', true)).toBe('live');
    });
  });

  describe('getStatusFilterOptions', () => {
    it('excludes Scheduled filter entry when flag is OFF', () => {
      const options = getStatusFilterOptions(false);
      expect(options.some((o) => o.value === 'scheduled')).toBe(false);
      expect(options.some((o) => o.value === 'draft')).toBe(true);
    });

    it('includes Scheduled filter entry when flag is ON', () => {
      const options = getStatusFilterOptions(true);
      expect(options.find((o) => o.value === 'scheduled')).toEqual({
        value: 'scheduled',
        label: 'Scheduled',
      });
    });
  });

  describe('shouldResetScheduledFilter', () => {
    it('resets when flag is OFF and filter is scheduled', () => {
      expect(shouldResetScheduledFilter(false, 'scheduled')).toBe(true);
    });

    it('does not reset when flag is ON', () => {
      expect(shouldResetScheduledFilter(true, 'scheduled')).toBe(false);
    });

    it('does not reset for other filter values', () => {
      expect(shouldResetScheduledFilter(false, 'draft')).toBe(false);
      expect(shouldResetScheduledFilter(false, 'all')).toBe(false);
    });
  });
});
