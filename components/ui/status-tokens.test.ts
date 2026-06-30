import { describe, expect, it } from 'vitest';
import {
  isCampaignStatus,
  normalizeCampaignStatus,
  STATUS_TOKENS,
  type CampaignStatus,
} from '@/components/ui/status-tokens';

describe('campaign status normalization', () => {
  it('recognizes known statuses', () => {
    for (const status of Object.keys(STATUS_TOKENS) as CampaignStatus[]) {
      expect(isCampaignStatus(status)).toBe(true);
      expect(normalizeCampaignStatus(status)).toBe(status);
    }
  });

  it('falls back unknown statuses to draft', () => {
    expect(isCampaignStatus('archived')).toBe(true);
    expect(isCampaignStatus('paused')).toBe(false);
    expect(normalizeCampaignStatus('paused')).toBe('draft');
    expect(normalizeCampaignStatus('')).toBe('draft');
  });
});
