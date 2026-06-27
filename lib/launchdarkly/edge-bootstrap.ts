import { createClient } from '@vercel/edge-config';
import { connection } from 'next/server';

import { getLaunchDarklyConfig } from '@/lib/launchdarkly/config';

type LdEdgeFlag = {
  on: boolean;
  fallthrough: { variation: number };
  offVariation: number;
  variations: unknown[];
};

type LdEdgePayload = {
  flags: Record<string, LdEdgeFlag>;
};

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

    const bootstrap: Record<string, unknown> = {};
    for (const [key, flag] of Object.entries(data.flags)) {
      const variationIndex = flag.on ? flag.fallthrough.variation : flag.offVariation;
      bootstrap[key] = flag.variations[variationIndex];
    }
    return bootstrap;
  } catch (error) {
    console.warn('LaunchDarkly Edge Config bootstrap unavailable; falling back to SDK streaming.', error);
    return undefined;
  }
}
