'use client';

import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { useEffect, useState, type ComponentType, type ReactNode } from 'react';

function getClientContext() {
  const deployment =
    process.env.NEXT_PUBLIC_VERCEL_ENV?.trim() ||
    (process.env.NODE_ENV === 'production' ? 'production' : 'local');

  return {
    kind: 'user' as const,
    key: 'anonymous',
    anonymous: true,
    custom: {
      deployment,
      launchDarklyTier: deployment === 'production' ? 'production' : 'test',
    },
  };
}

export function LaunchDarklyProvider({
  children,
  bootstrap,
}: {
  children: ReactNode;
  bootstrap?: Record<string, unknown>;
}) {
  const [LDProvider, setLDProvider] = useState<ComponentType<{ children: ReactNode }> | null>(
    null,
  );

  useEffect(() => {
    const clientSideID = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID?.trim();
    if (!clientSideID) return;

    void (async () => {
      const Provider = await asyncWithLDProvider({
        clientSideID,
        context: getClientContext(),
        timeout: 5,
        reactOptions: { useCamelCaseFlagKeys: true },
        ...(bootstrap ? { bootstrap } : {}),
      });
      setLDProvider(() => Provider);
    })();
  }, [bootstrap]);

  if (!LDProvider) return children;
  return <LDProvider>{children}</LDProvider>;
}
