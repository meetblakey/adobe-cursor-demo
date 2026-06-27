import type { LDContext } from '@launchdarkly/node-server-sdk';

import {
  getClientLaunchDarklyDeployment,
  getLaunchDarklyConfig,
} from '@/lib/launchdarkly/config';

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

export function buildClientLDContext() {
  const deployment = getClientLaunchDarklyDeployment();
  const tier = deployment === 'production' ? 'production' : 'test';

  return {
    kind: 'user' as const,
    key: 'anonymous',
    anonymous: true,
    custom: {
      deployment,
      launchDarklyTier: tier,
    },
  };
}

export const defaultLDContext = buildLDContext();
