import { init, type LDClient, type LDContext } from '@launchdarkly/node-server-sdk';

import { getLaunchDarklyConfig } from '@/lib/launchdarkly/config';

let client: LDClient | undefined;
let initPromise: Promise<LDClient | null> | undefined;

async function initializeClient(): Promise<LDClient | null> {
  const { sdkKey, deployment } = getLaunchDarklyConfig();
  if (!sdkKey) return null;

  if (!client) {
    client = init(sdkKey, {
      application: {
        id: 'adobe-cursor-demo',
        version: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
      },
    });
  }

  try {
    await client.waitForInitialization({ timeout: 5 });
    return client;
  } catch (error) {
    console.warn(`LaunchDarkly server SDK failed to initialize (${deployment}):`, error);
    return null;
  }
}

export async function getLDClient(): Promise<LDClient | null> {
  if (!initPromise) {
    initPromise = initializeClient();
  }
  return initPromise;
}

export async function getBooleanFlag(
  flagKey: string,
  context: LDContext,
  defaultValue = false,
): Promise<boolean> {
  const ld = await getLDClient();
  if (!ld) return defaultValue;
  return ld.boolVariation(flagKey, context, defaultValue);
}

export { buildLDContext, defaultLDContext } from '@/lib/launchdarkly/context';
