'use client';

import { LDProvider } from 'launchdarkly-react-client-sdk';
import type { ReactNode } from 'react';

import { buildClientLDContext } from '@/lib/launchdarkly/context';

export function LaunchDarklyProvider({
  children,
  bootstrap,
  offlineVerify,
}: {
  children: ReactNode;
  bootstrap?: Record<string, unknown>;
  /** Cloud Agent self-verify: mount LD with bootstrap when no client-side ID is set. */
  offlineVerify?: boolean;
}) {
  const clientSideID =
    process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID?.trim() ||
    (offlineVerify ? 'cloud-agent-verify' : '');
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
