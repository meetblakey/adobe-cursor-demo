import { afterEach, describe, expect, it } from 'vitest';

import {
  getClientLaunchDarklyDeployment,
  getLaunchDarklyDeployment,
  getLaunchDarklyTier,
} from '@/lib/launchdarkly/config';
import { buildClientLDContext, buildLDContext } from '@/lib/launchdarkly/context';
import { mapEdgeFlagsToBootstrap, type LdEdgeFlag } from '@/lib/launchdarkly/edge-bootstrap';

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('LaunchDarkly deployment mapping', () => {
  it('maps production Vercel env to production tier', () => {
    process.env.VERCEL_ENV = 'production';
    expect(getLaunchDarklyTier()).toBe('production');
    expect(getLaunchDarklyDeployment()).toBe('production');
  });

  it('maps preview and development Vercel envs to test tier', () => {
    process.env.VERCEL_ENV = 'preview';
    expect(getLaunchDarklyTier()).toBe('test');
    expect(getLaunchDarklyDeployment()).toBe('preview');

    process.env.VERCEL_ENV = 'development';
    expect(getLaunchDarklyTier()).toBe('test');
    expect(getLaunchDarklyDeployment()).toBe('development');
  });

  it('defaults server deployment to local when VERCEL_ENV is unset', () => {
    delete process.env.VERCEL_ENV;
    expect(getLaunchDarklyDeployment()).toBe('local');
    expect(getLaunchDarklyTier()).toBe('test');
  });
});

describe('LaunchDarkly client deployment mapping', () => {
  it('mirrors NEXT_PUBLIC_VERCEL_ENV when set', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
    expect(getClientLaunchDarklyDeployment()).toBe('preview');
  });

  it('defaults client deployment to local when NEXT_PUBLIC_VERCEL_ENV is unset', () => {
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    expect(getClientLaunchDarklyDeployment()).toBe('local');
  });
});

describe('LaunchDarkly context alignment', () => {
  it('keeps server and client deployment aligned for local npm run dev', () => {
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;

    const server = buildLDContext();
    const client = buildClientLDContext();

    expect(server.custom?.deployment).toBe('local');
    expect(client.custom?.deployment).toBe('local');
    expect(server.custom?.launchDarklyTier).toBe('test');
    expect(client.custom?.launchDarklyTier).toBe('test');
  });
});

describe('mapEdgeFlagsToBootstrap', () => {
  const booleanFlag = (on: boolean, fallthroughVariation = 0): LdEdgeFlag => ({
    on,
    fallthrough: { variation: fallthroughVariation },
    offVariation: 1,
    variations: [true, false],
  });

  it('maps on flags with fixed fallthrough variations', () => {
    const bootstrap = mapEdgeFlagsToBootstrap({
      'my-first-flag': booleanFlag(true),
    });

    expect(bootstrap['my-first-flag']).toBe(true);
  });

  it('maps off flags to the off variation', () => {
    const bootstrap = mapEdgeFlagsToBootstrap({
      'my-first-flag': booleanFlag(false),
    });

    expect(bootstrap['my-first-flag']).toBe(false);
  });

  it('skips on flags whose fallthrough is a rollout', () => {
    const bootstrap = mapEdgeFlagsToBootstrap({
      'rollout-flag': {
        on: true,
        fallthrough: {
          rollout: {
            variations: [
              { variation: 0, weight: 50000 },
              { variation: 1, weight: 50000 },
            ],
          },
        },
        offVariation: 1,
        variations: [true, false],
      },
      'fixed-flag': booleanFlag(true),
    });

    expect(bootstrap).not.toHaveProperty('rollout-flag');
    expect(bootstrap['fixed-flag']).toBe(true);
  });
});
