import { describe, it, expect } from 'vitest';
import { STATUS_TOKENS, type CampaignStatus } from '@/components/ui/status-tokens';
import { contrastRatio } from '@/lib/contrast';

// The a11y contract every product surface inherits. If a status token regresses below
// AA in either theme, this goes red in CI before it can ship to 200+ consumers.
const statuses = Object.keys(STATUS_TOKENS) as CampaignStatus[];

for (const status of statuses) {
  for (const theme of ['light', 'dark'] as const) {
    it(`StatusBadge "${status}" meets WCAG AA in ${theme} mode`, () => {
      const { bg, fg } = STATUS_TOKENS[status][theme];
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
    });
  }
}

describe('contrast math', () => {
  it('computes a known ratio (black on white = 21:1)', () => {
    expect(Math.round(contrastRatio('#000000', '#FFFFFF'))).toBe(21);
  });
});
