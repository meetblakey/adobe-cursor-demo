export type LaunchDarklyTier = 'test' | 'production';

export type LaunchDarklyDeployment = 'development' | 'preview' | 'production' | 'local';

/** Maps the running deployment to the LaunchDarkly environment tier. */
export function getLaunchDarklyTier(): LaunchDarklyTier {
  if (process.env.VERCEL_ENV === 'production') return 'production';
  return 'test';
}

export function getLaunchDarklyDeployment(): LaunchDarklyDeployment {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === 'production' || vercelEnv === 'preview' || vercelEnv === 'development') {
    return vercelEnv;
  }
  return 'local';
}

export function getLaunchDarklyConfig() {
  return {
    sdkKey: process.env.LAUNCHDARKLY_SDK_KEY?.trim() ?? '',
    clientSideId: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID?.trim() ?? '',
    tier: getLaunchDarklyTier(),
    deployment: getLaunchDarklyDeployment(),
    projectKey: 'default',
  } as const;
}

export function isLaunchDarklyConfigured(): boolean {
  const { sdkKey, clientSideId } = getLaunchDarklyConfig();
  return Boolean(sdkKey || clientSideId);
}
