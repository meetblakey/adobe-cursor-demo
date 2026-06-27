import { afterEach, describe, expect, it } from 'vitest';

import {
  getLaunchDarklyConfig,
  getLaunchDarklyDeployment,
  getLaunchDarklyTier,
  isLaunchDarklyConfigured,
} from '@/lib/launchdarkly/config';

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('getLaunchDarklyTier', () => {
  it('returns production only when VERCEL_ENV is production', () => {
    process.env.VERCEL_ENV = 'production';
    expect(getLaunchDarklyTier()).toBe('production');
  });

  it.each(['preview', 'development', undefined])(
    'returns test when VERCEL_ENV is %s',
    (vercelEnv) => {
      if (vercelEnv === undefined) {
        delete process.env.VERCEL_ENV;
      } else {
        process.env.VERCEL_ENV = vercelEnv;
      }
      expect(getLaunchDarklyTier()).toBe('test');
    },
  );
});

describe('getLaunchDarklyDeployment', () => {
  it.each([
    ['production', 'production'],
    ['preview', 'preview'],
    ['development', 'development'],
  ] as const)('maps VERCEL_ENV=%s to deployment %s', (vercelEnv, deployment) => {
    process.env.VERCEL_ENV = vercelEnv;
    expect(getLaunchDarklyDeployment()).toBe(deployment);
  });

  it('returns local when VERCEL_ENV is unset or unrecognized', () => {
    delete process.env.VERCEL_ENV;
    expect(getLaunchDarklyDeployment()).toBe('local');

    process.env.VERCEL_ENV = 'staging';
    expect(getLaunchDarklyDeployment()).toBe('local');
  });
});

describe('getLaunchDarklyConfig', () => {
  it('includes tier and deployment derived from VERCEL_ENV', () => {
    process.env.VERCEL_ENV = 'preview';
    expect(getLaunchDarklyConfig()).toMatchObject({
      tier: 'test',
      deployment: 'preview',
      projectKey: 'default',
    });
  });
});

describe('isLaunchDarklyConfigured', () => {
  it('returns false when both credentials are unset', () => {
    delete process.env.LAUNCHDARKLY_SDK_KEY;
    delete process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID;
    expect(isLaunchDarklyConfigured()).toBe(false);
  });

  it('returns true when either credential is set', () => {
    process.env.LAUNCHDARKLY_SDK_KEY = 'sdk-key';
    delete process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID;
    expect(isLaunchDarklyConfigured()).toBe(true);
  });
});
