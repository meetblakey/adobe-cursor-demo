import { createClient } from '@vercel/edge-config';
import { connection } from 'next/server';

import { getLaunchDarklyConfig } from '@/lib/launchdarkly/config';

type LdEdgeFallthrough = {
  variation?: number;
  rollout?: {
    variations: Array<{ variation: number; weight: number }>;
  };
};

export type LdEdgeFlag = {
  on: boolean;
  fallthrough: LdEdgeFallthrough;
  offVariation: number;
  variations: unknown[];
};

type LdEdgePayload = {
  flags: Record<string, LdEdgeFlag>;
};

/** Maps Edge Config flag payloads to React SDK bootstrap values. */
export function mapEdgeFlagsToBootstrap(
  flags: Record<string, LdEdgeFlag>,
): Record<string, unknown> {
  const bootstrap: Record<string, unknown> = {};

  for (const [key, flag] of Object.entries(flags)) {
    let variationIndex: number | undefined;

    if (flag.on) {
      if (typeof flag.fallthrough.variation !== 'number') {
        continue;
      }
      variationIndex = flag.fallthrough.variation;
    } else {
      variationIndex = flag.offVariation;
    }

    bootstrap[key] = flag.variations[variationIndex];
  }

  return bootstrap;
}

/** Reads LaunchDarkly flag payloads synced into Vercel Edge Config by the LD integration. */
export async function getLaunchDarklyBootstrap(): Promise<Record<string, unknown> | undefined> {
  await connection();

  const edgeConfigConnection = process.env.EDGE_CONFIG?.trim();
  const { clientSideId } = getLaunchDarklyConfig();
  if (!edgeConfigConnection || !clientSideId) return undefined;

  try {
    const client = createClient(edgeConfigConnection);
    const data = await client.get<LdEdgePayload>(`LD-Env-${clientSideId}`);
    if (!data?.flags) return undefined;

    return mapEdgeFlagsToBootstrap(data.flags);
  } catch (error) {
    console.warn('LaunchDarkly Edge Config bootstrap unavailable; falling back to SDK streaming.', error);
    return undefined;
  }
}
