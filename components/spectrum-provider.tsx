'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { useTheme } from '@/components/theme-provider';

/**
 * Whether Adobe React Spectrum is live for the current subtree. Spectrum is the
 * default Pigment design system (no flag) but renders **client-only** — it is
 * `false` during SSR / the first client render and flips to `true` after
 * hydration. This keeps the app close to a plain React SPA so Spectrum has no
 * Next-specific (PPR / SSR / hydration) rendering surface to fight.
 */
const SpectrumReadyContext = createContext(false);

export function useSpectrumDesignSystem(): boolean {
  return useContext(SpectrumReadyContext);
}

const subscribe = () => () => {};

// false during SSR (and the hydrating render), true on the client thereafter —
// the idiomatic "are we hydrated" check, with no setState-in-effect.
function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * Mounts Spectrum's single root Provider on the client. A single client flag
 * drives both the Provider mount and the context value, so the migrated Layer-1
 * components only switch to Spectrum once their Provider ancestor exists — no
 * no-Provider hazard, no hydration mismatch. `colorScheme` tracks Pigment's own
 * light/dark toggle so the dark-mode story stays authoritative.
 *
 * ponytail: client-only by design; the legacy components render during SSR as
 * the pre-hydration fallback and are unaffected.
 */
export function SpectrumProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
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
