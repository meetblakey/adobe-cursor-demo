import type { LDContext } from '@launchdarkly/node-server-sdk';

import { getLaunchDarklyConfig } from '@/lib/launchdarkly/config';

export function buildLDContext(overrides?: Partial<LDContext>): LDContext {
  const { deployment, tier } = getLaunchDarklyConfig();

  return {
    kind: 'user',
    key: 'anonymous',
    anonymous: true,
    ...overrides,
    custom: {
      deployment,
      launchDarklyTier: tier,
      ...(typeof overrides?.custom === 'object' ? overrides.custom : {}),
    },
  };
}

export const defaultLDContext = buildLDContext();
