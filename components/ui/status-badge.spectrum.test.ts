import { describe, it, expect } from 'vitest';
import {
  SPECTRUM_STATUS,
  STATUS_TOKENS,
  type CampaignStatus,
} from '@/components/ui/status-tokens';

// The Spectrum path (flag ON) of StatusBadge. Status colors come from Spectrum
// SEMANTIC variants, not hand-authored hex — Spectrum pre-validates them AA in
// light + dark, so INJURY B's failure mode (a hand-picked hex below 4.5:1) is
// structurally impossible here. This gate asserts the mapping stays semantic:
// no literal hex / rgb / oklch can sneak back into the Spectrum surface.
const SEMANTIC = new Set([
  'neutral', 'positive', 'negative', 'notice', 'info',
  'celery', 'chartreuse', 'yellow', 'magenta', 'fuchsia', 'purple', 'indigo', 'seafoam',
]);

describe('Spectrum StatusLight mapping', () => {
  const statuses = Object.keys(STATUS_TOKENS) as CampaignStatus[];
  for (const status of statuses) {
    it(`"${status}" maps to a Spectrum semantic variant (no literal color)`, () => {
      const variant = SPECTRUM_STATUS[status];
      expect(variant).not.toMatch(/#|rgb|oklch|hsl/i);
      expect(SEMANTIC.has(variant)).toBe(true);
    });
  }
});
