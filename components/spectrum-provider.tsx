'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useTheme } from '@/components/theme-provider';

/**
 * Whether the Spectrum design system is live for the current subtree: the
 * `spectrum-design-system` LaunchDarkly flag is ON *and* we have mounted on the
 * client. Defaults to `false` (legacy shadcn/Base UI) outside the provider and
 * during SSR.
 */
const SpectrumReadyContext = createContext(false);

export function useSpectrumDesignSystem(): boolean {
  return useContext(SpectrumReadyContext);
}

function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Mounts Adobe React Spectrum's single root Provider — but only when the
 * `spectrum-design-system` flag is ON *and* we are on the client. Spectrum is a
 * client library, so it renders client-side only (never during SSR / prerender),
 * keeping the app close to a plain React SPA and giving Spectrum no PPR or
 * hydration surface. When the flag is OFF (production default) this is a
 * transparent pass-through and a true no-op.
 *
 * A single `mounted` flag drives both the Provider mount and the context value,
 * so the migrated Layer-1 components only switch to Spectrum once their Provider
 * ancestor exists — no rules-of-hooks or no-Provider hazard. `colorScheme`
 * tracks Pigment's own light/dark toggle so the dark-mode demo (and INJURY B's
 * contrast story) stay authoritative.
 *
 * ponytail: client-only by design; SSR of the legacy surface is unaffected.
 */
export function SpectrumProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { spectrumDesignSystem } = useFlags();
  const mounted = useIsMounted();
  const ready = Boolean(spectrumDesignSystem) && mounted;

  if (!ready) {
    return <SpectrumReadyContext.Provider value={false}>{children}</SpectrumReadyContext.Provider>;
  }

  return (
    <SpectrumReadyContext.Provider value={true}>
      <Provider
        theme={defaultTheme}
        colorScheme={theme}
        locale="en-US"
        UNSAFE_className="flex flex-1 flex-col"
      >
        {children}
      </Provider>
    </SpectrumReadyContext.Provider>
  );
}
