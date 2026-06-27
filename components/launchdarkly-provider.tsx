'use client';

import { LDProvider } from 'launchdarkly-react-client-sdk';
import type { ReactNode } from 'react';

import { buildClientLDContext } from '@/lib/launchdarkly/context';

export function LaunchDarklyProvider({
  children,
  bootstrap,
}: {
  children: ReactNode;
  bootstrap?: Record<string, unknown>;
}) {
  const clientSideID = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID?.trim();
  if (!clientSideID) return children;

  return (
    <LDProvider
      clientSideID={clientSideID}
      context={buildClientLDContext()}
      timeout={5}
      reactOptions={{ useCamelCaseFlagKeys: true }}
      options={bootstrap ? { bootstrap } : undefined}
    >
      {children}
    </LDProvider>
  );
}
