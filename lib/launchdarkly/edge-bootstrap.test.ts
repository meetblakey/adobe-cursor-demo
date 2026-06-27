import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGet = vi.fn();

vi.mock('@vercel/edge-config', () => ({
  createClient: () => ({ get: mockGet }),
}));

vi.mock('next/server', () => ({
  connection: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/launchdarkly/config', () => ({
  getLaunchDarklyConfig: () => ({
    clientSideId: 'abc123def',
  }),
}));

import { getLaunchDarklyBootstrap } from '@/lib/launchdarkly/edge-bootstrap';

describe('getLaunchDarklyBootstrap', () => {
  beforeEach(() => {
    mockGet.mockReset();
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
  });

  it('returns undefined when EDGE_CONFIG is unset', async () => {
    delete process.env.EDGE_CONFIG;
    expect(await getLaunchDarklyBootstrap()).toBeUndefined();
  });

  it('parses on/off flag variations into a bootstrap map', async () => {
    mockGet.mockResolvedValue({
      flags: {
        'my-first-flag': {
          on: true,
          fallthrough: { variation: 0 },
          offVariation: 1,
          variations: [true, false],
        },
        'other-flag': {
          on: false,
          fallthrough: { variation: 0 },
          offVariation: 1,
          variations: ['enabled', 'disabled'],
        },
      },
    });

    expect(await getLaunchDarklyBootstrap()).toEqual({
      'my-first-flag': true,
      'other-flag': 'disabled',
    });
    expect(mockGet).toHaveBeenCalledWith('LD-Env-abc123def');
  });

  it('returns undefined when Edge Config payload has no flags', async () => {
    mockGet.mockResolvedValue({});
    expect(await getLaunchDarklyBootstrap()).toBeUndefined();
  });
});
