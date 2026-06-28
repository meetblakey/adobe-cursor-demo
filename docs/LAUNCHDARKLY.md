# LaunchDarkly Setup

This project uses [LaunchDarkly](https://launchdarkly.com) for feature flag management.

## SDK Details

- **Server SDK:** `@launchdarkly/node-server-sdk` — evaluates flags in Server Components, Route Handlers, and server-side code
- **Client SDK:** `launchdarkly-react-client-sdk` — evaluates flags in client components via React hooks
- **Installed via:** `npm install @launchdarkly/node-server-sdk launchdarkly-react-client-sdk`
- **Server initialization:** `lib/launchdarkly/server.ts` (bootstrapped from `instrumentation.ts`)
- **Client initialization:** `components/launchdarkly-provider.tsx` (wrapped in `app/layout.tsx`)
- **Config helpers:** `lib/launchdarkly/config.ts`, `lib/launchdarkly/context.ts`

## Environment matrix (Dev · Preview · Production)

LaunchDarkly has two environments in project **`default`**: **`test`** and **`production`**.  
Vercel has three deployment tiers. Map them like this:

| Where you run | Vercel tier | LaunchDarkly env | Credentials |
|---------------|-------------|------------------|-------------|
| `npm run dev` locally | — (local) | **test** | `.env.local` |
| `vercel dev` | Development | **test** | Vercel **Development** env vars (sync with `vercel env pull .env.development.local`) |
| PR / branch deploy | Preview | **test** | Vercel **Preview** env vars |
| Production URL | Production | **production** | Vercel **Production** env vars |

**Rule:** never point Preview or local dev at the **production** LaunchDarkly environment — flag toggles on previews would affect live users.

### Preview URLs and SSO

Branch preview deploys were behind [Vercel SSO deployment protection](../docs/ENVIRONMENTS.md#preview-deployment-protection-sso--bypass).
For demo day, run `./.github/scripts/disable-preview-sso.sh` so `/campaigns` on preview URLs is
public in any browser. Production alias
[`adobe-cursor-demo.vercel.app`](https://adobe-cursor-demo.vercel.app) uses the **production** LD
environment — prefer **preview** (test keys) or **local** for the `my-first-flag` toggle beat.


| Variable | Type | Environments |
|----------|------|--------------|
| `LAUNCHDARKLY_SDK_KEY` | Server SDK key (secret) | All tiers — **test** key for Dev/Preview/local, **production** key for Production |
| `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID` | Client-side ID (public in browser bundles) | Same mapping as SDK key |

- **Never hardcode** keys or client-side IDs in source code.
- Placeholders for local setup: `.env.example` → copy to `.env.local`.
- Vercel project: [adobe-cursor-demo environment variables](https://vercel.com/meetblakeys-projects/adobe-cursor-demo/settings/environment-variables)

### Sync local env from Vercel

After changing Vercel env vars, refresh your local Development pull:

```bash
vercel env pull .env.development.local
```

Use `.env.local` for `npm run dev` (Test keys) or rely on `.env.development.local` when using `vercel dev`.

## Vercel × LaunchDarkly integration (Edge Config)

The [LaunchDarkly Vercel integration](https://launchdarkly.com/docs/integrations/vercel) syncs flag payloads into **Vercel Edge Config** for zero-latency client bootstrap.

### Connected stores

| Edge Config | LaunchDarkly env | Vercel tiers | Key in store |
|-------------|------------------|--------------|--------------|
| `Initial_Edge_Config` | **production** | Production | `LD-Env-6a3f494d9b49450aaaaa1af9` |
| `pigment-ld-test` | **test** | Preview, Development, local | `LD-Env-6a3f494d9b49450aaaaa1af8` |

The app reads `EDGE_CONFIG` at request time in `lib/launchdarkly/edge-bootstrap.ts` and passes a bootstrap map to the React SDK (no flag flash on first paint when Edge Config is available).

### Environment variable

| Variable | Purpose |
|----------|---------|
| `EDGE_CONFIG` | Connection string to the tier-appropriate Edge Config store (auto-set on Vercel per environment) |

Sync locally after changes:

```bash
vercel env pull .env.development.local
```

### Ongoing sync

Production flags sync automatically via the LaunchDarkly → Vercel integration into `Initial_Edge_Config`. For **Test** flags to stay in sync with `pigment-ld-test`, add a second integration mapping in the [LaunchDarkly dashboard](https://app.launchdarkly.com/settings/integrations) (Integrations → Vercel → connect **Test** environment to `pigment-ld-test`). Until then, the test store was seeded manually and may drift until that link is configured.

## Where to Find Things

| What | Where |
|------|-------|
| Feature flags dashboard | https://app.launchdarkly.com/projects/default/flags |
| First onboarding flag | https://app.launchdarkly.com/projects/default/flags/my-first-flag |
| Spectrum design-system flag | https://app.launchdarkly.com/projects/default/flags/spectrum-design-system |
| Test environment keys | https://app.launchdarkly.com/projects/default/settings/environments/test/keys |
| Production environment keys | https://app.launchdarkly.com/projects/default/settings/environments/production/keys |
| LaunchDarkly docs | https://launchdarkly.com/docs |

## How Feature Flags Work in This Project

1. The **server SDK** initializes once at startup via `instrumentation.ts` and exposes helpers in `lib/launchdarkly/server.ts`.
2. The **client SDK** wraps the app in `LaunchDarklyProvider` so client components can use `useFlags()`.
3. Evaluation contexts include `deployment` and `launchDarklyTier` custom attributes for targeting by environment.
4. Flag changes in the dashboard stream to connected SDKs in near real time.

### Server-side evaluation

```typescript
import { getBooleanFlag, defaultLDContext } from '@/lib/launchdarkly/server';

const showFeature = await getBooleanFlag('my-first-flag', defaultLDContext, false);
```

### Client-side evaluation

```tsx
'use client';
import { useFlags } from 'launchdarkly-react-client-sdk';

function MyComponent() {
  const { myFirstFlag } = useFlags(); // camelCase: my-first-flag → myFirstFlag
  return myFirstFlag ? <p>Feature is ON</p> : <p>Feature is OFF</p>;
}
```

See `components/campaigns/first-flag-demo.tsx` on `/campaigns` for a live demo.

### `spectrum-design-system` — the design-system re-platform flag

The Adobe React Spectrum migration of Layer 1 ships **dark** behind `spectrum-design-system`
(client read; camelCase `spectrumDesignSystem`). OFF (prod default) renders the legacy
shadcn/Base UI components; ON renders `@adobe/react-spectrum`. The flag is read in one place —
`useSpectrumDesignSystem()` in `components/spectrum-provider.tsx` — which both mounts the root
Spectrum `<Provider>` and lets each hot-path component (`Button`, `Badge`, `StatusBadge`) pick
its implementation. With no SDK key the flag is `false`, so the app stays on the legacy system.

To create it: boolean flag, temporary, **production serving `false`**, **test serving `true`**
for preview verification; roll out to prod later via **`/release-flag`**.

## Next Steps

### Feature Flag Best Practices
- Wrap new features in flags so you can release and roll back independently of deployments.
- Mark flags as temporary during creation and archive them when no longer needed.
- Use descriptive kebab-case keys (e.g. `enable-checkout-v2`).

### Advanced Capabilities
- **[Percentage Rollouts](https://launchdarkly.com/docs/home/targeting-flags/rollouts)** — Gradually roll out features to a percentage of users.
- **[Targeting Rules](https://launchdarkly.com/docs/home/targeting-flags/targeting-rules)** — Target specific users, segments, or contexts.
- **[Experimentation](https://launchdarkly.com/docs/home/about-experimentation)** — Run A/B tests and measure the impact of flag variations.
- **[AI Configs](https://launchdarkly.com/docs/home/ai-configs)** — Manage AI model configurations and prompts with feature flags.
- **[Guarded Rollouts](https://launchdarkly.com/docs/home/guarded-rollouts)** — Automatically roll back flag changes based on metric guardrails.
- **[Observability](https://launchdarkly.com/docs/home/observability)** — Monitor flag evaluations and SDK performance.

## Agent Integration (MCP Server)

The LaunchDarkly MCP server is configured in Cursor (hosted OAuth at `https://mcp.launchdarkly.com/mcp/launchdarkly`). With it, agents can create flags, toggle targeting, audit flag health, and manage rollouts directly from the editor.

Companion agent skills installed in `.agents/skills/`:
- `launchdarkly-flag-create`
- `launchdarkly-flag-discovery`
- `launchdarkly-flag-targeting`
- `launchdarkly-flag-cleanup`

See `.cursor/rules/launchdarkly.mdc` for editor-specific guidance.
