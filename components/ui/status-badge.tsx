'use client';

import { StatusLight } from '@adobe/react-spectrum';
import { useTheme } from '@/components/theme-provider';
import { useSpectrumDesignSystem } from '@/components/spectrum-provider';
import {
  STATUS_TOKENS,
  SPECTRUM_STATUS,
  normalizeCampaignStatus,
  type CampaignStatus,
} from '@/components/ui/status-tokens';

export { STATUS_TOKENS, SPECTRUM_STATUS, type CampaignStatus };

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const { theme } = useTheme();
  const spectrum = useSpectrumDesignSystem();
  const safeStatus = normalizeCampaignStatus(status);

  if (spectrum) {
    return (
      <StatusLight variant={SPECTRUM_STATUS[safeStatus]}>{STATUS_TOKENS[safeStatus].label}</StatusLight>
    );
  }

  const token = STATUS_TOKENS[safeStatus][theme];
  return (
    <span
      style={{ backgroundColor: token.bg, color: token.fg }}
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    >
      {STATUS_TOKENS[safeStatus].label}
    </span>
  );
}
