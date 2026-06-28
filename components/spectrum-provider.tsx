'use client';

import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useTheme } from '@/components/theme-provider';

/**
 * Mounts Adobe React Spectrum's single root Provider — but only when the
 * `spectrum-design-system` LaunchDarkly flag is ON. When OFF (the production
 * default), this is a transparent pass-through, so the legacy shadcn/Base UI
 * surface renders exactly as before and the flag is a true no-op in prod.
 *
 * `colorScheme` tracks Pigment's own light/dark toggle (`useTheme`) so the
 * dark-mode demo — and INJURY B's contrast gate — stay authoritative over
 * Spectrum's own scheme detection. One Provider only; the migrated Layer-1
 * components render Spectrum only under this ancestor.
 *
 * ponytail: no SSRProvider / LocalizedStringProvider — React 19 SSR-to-HTML
 * works out of the box; add the i18n string provider only if we ship locales
 * beyond en-US.
 */
/**
 * Single source of truth for the `spectrum-design-system` LaunchDarkly flag
 * (kebab `spectrum-design-system` → camel `spectrumDesignSystem`). Returns
 * `false` when the SDK isn't configured/initialized — so Layer-1 components
 * default to the legacy shadcn/Base UI rendering and the flag stays dark in
 * production until a controlled `/release-flag` rollout.
 */
export function useSpectrumDesignSystem(): boolean {
  const { spectrumDesignSystem } = useFlags();
  return Boolean(spectrumDesignSystem);
}

export function SpectrumProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { spectrumDesignSystem } = useFlags();

  if (!spectrumDesignSystem) return <>{children}</>;

  return (
    <Provider
      theme={defaultTheme}
      colorScheme={theme}
      locale="en-US"
      UNSAFE_className="flex flex-1 flex-col"
    >
      {children}
    </Provider>
  );
}
