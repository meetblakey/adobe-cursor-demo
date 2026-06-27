# Environments — Dev · Preview · Production

Pigment maps **Vercel deployment tiers** to **LaunchDarkly** and **Supabase** credentials. Code
deploys on every merge to `main`; **feature exposure** is controlled separately via LaunchDarkly
flags (see [`LAUNCHDARKLY.md`](LAUNCHDARKLY.md) and [`PIPELINE.md`](PIPELINE.md) stage 5b).

## Tier matrix

| Tier | Where | `VERCEL_ENV` | LaunchDarkly | Supabase | Seed fallback |
|------|-------|--------------|--------------|----------|---------------|
| **Development** | `npm run dev`, `vercel dev` | unset / `development` | **test** env | Dev project URL + anon key | Yes |
| **Preview** | PR / branch deploy | `preview` | **test** env | Staging project URL + anon key | Yes on error |
| **Production** | Production URL | `production` | **production** env | Prod project URL + anon key | **No** — log error |

**Rule:** never point Preview or local dev at LaunchDarkly **production** or Supabase **production**
credentials.

## Environment variables

Set per tier in the [Vercel project settings](https://vercel.com/meetblakeys-projects/adobe-cursor-demo/settings/environment-variables)
(or `.env.local` for local dev):

| Variable | Development | Preview | Production |
|----------|-------------|---------|------------|
| `LAUNCHDARKLY_SDK_KEY` | test key | test key | production key |
| `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID` | test client ID | test client ID | production client ID |
| `EDGE_CONFIG` | test store (auto on Vercel) | test store | production store |
| `NEXT_PUBLIC_SUPABASE_URL` | dev project | staging project | prod project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | dev anon key | staging anon key | prod anon key |
| `NEXT_PUBLIC_VERCEL_ENV` | `local` (via `next.config.ts`) | `preview` | `production` |

Sync local Development vars from Vercel:

```bash
vercel env pull .env.development.local
```

LaunchDarkly detail: [`LAUNCHDARKLY.md`](LAUNCHDARKLY.md).

## Code helpers

| Module | Purpose |
|--------|---------|
| [`lib/launchdarkly/config.ts`](../lib/launchdarkly/config.ts) | LD tier + deployment mapping |
| [`lib/supabase/env.ts`](../lib/supabase/env.ts) | Supabase deployment + seed fallback policy |
| [`lib/campaigns.ts`](../lib/campaigns.ts) | Data layer — seed in dev/preview; live DB required in prod |

## CI and local defaults

GitHub Actions **does not** set Supabase or LaunchDarkly secrets. CI runs on in-app seed data and
LD graceful defaults — `npm test`, typecheck, and build stay green without `.env*`.

## Migrations across tiers

Apply schema changes **staging first**, then production:

1. Run the new SQL against the **staging** Supabase project (Preview tier).
2. Validate on a Vercel preview deploy.
3. Apply the same migration to **production** before or after merge — never skip staging.

See [`.cursor/skills/add-migration/SKILL.md`](../.cursor/skills/add-migration/SKILL.md).

## Future: Supabase Branching

[Supabase Branching](https://supabase.com/docs/guides/platform/branching) can attach preview DB
branches to PRs. This repo documents the three-project model for clarity in demos; branching is
an optional upgrade path.

## Deploy policy

**Production deploys automatically on merge to `main`** (Vercel). New features ship **dark** —
code is live, LaunchDarkly flag **OFF** in production until `/release-flag` completes a controlled
rollout.
