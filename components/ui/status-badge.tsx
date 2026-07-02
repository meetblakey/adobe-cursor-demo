'use client';

import { StatusLight } from '@adobe/react-spectrum';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useTheme } from '@/components/theme-provider';
import { useSpectrumDesignSystem } from '@/components/spectrum-provider';
import {
  STATUS_TOKENS,
  SPECTRUM_STATUS,
  type CampaignStatus,
} from '@/components/ui/status-tokens';

export { STATUS_TOKENS, SPECTRUM_STATUS, type CampaignStatus };

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const { theme } = useTheme();
  const spectrum = useSpectrumDesignSystem();
  const { scheduledStatus } = useFlags();
  // scheduled-status flag OFF → scheduled campaigns present as the draft they were
  // before the flag, on every surface that renders a StatusBadge.
  const shown: CampaignStatus = status === 'scheduled' && !scheduledStatus ? 'draft' : status;

  if (spectrum) {
    return <StatusLight variant={SPECTRUM_STATUS[shown]}>{STATUS_TOKENS[shown].label}</StatusLight>;
  }

  const token = STATUS_TOKENS[shown][theme];
  return (
    <span
      style={{ backgroundColor: token.bg, color: token.fg }}
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    >
      {STATUS_TOKENS[shown].label}
    </span>
  );
}
