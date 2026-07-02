'use client';

import { StatusLight } from '@adobe/react-spectrum';
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

  if (spectrum) {
    return <StatusLight variant={SPECTRUM_STATUS[status]}>{STATUS_TOKENS[status].label}</StatusLight>;
  }

  const token = STATUS_TOKENS[status][theme];
  return (
    <span
      style={{ backgroundColor: token.bg, color: token.fg }}
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    >
      {STATUS_TOKENS[status].label}
    </span>
  );
}
