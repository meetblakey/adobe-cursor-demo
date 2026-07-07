# Environments — Dev · Preview · Production

Pigment maps **Vercel deployment tiers** to **LaunchDarkly** and **Supabase** credentials. Code
deploys on every merge to `main`; **feature exposure** is controlled separately via LaunchDarkly
flags (see [`LAUNCHDARKLY.md`](LAUNCHDARKLY.md) and [`PIPELINE.md`](PIPELINE.md) stage 5b).

## Tier matrix

| Tier | Where | `VERCEL_ENV` | LaunchDarkly | Supabase | Seed fallback |
|------|-------|--------------|--------------|----------|---------------|
| **Development** | `npm run dev`, `vercel dev` | unset / `development` | **test** env | (unset → seed) or the shared project | Yes |
| **Preview** | PR / branch deploy | `preview` | **test** env | the shared project | Yes on error |
| **Production** | Production URL | `production` | **production** env | the shared project | **No** — log error |

**One Supabase project backs every tier in this demo.** The real tier separation is
**LaunchDarkly `test` vs `production`** plus **seed-vs-live** (dev/preview fall back to in-app
seed; production requires the live DB). **Rule:** never point Preview or local dev at
LaunchDarkly **production**. (At Adobe scale you'd split Supabase per tier too — see *Future*
below — but the demo runs one project.)

## Environment variables

Set per tier in the [Vercel project settings](https://vercel.com/meetblakeys-projects/adobe-cursor-demo/settings/environment-variables)
(or `.env.local` for local dev):

| Variable | Development | Preview | Production |
|----------|-------------|---------|------------|
| `LAUNCHDARKLY_SDK_KEY` | test key | test key | production key |
| `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID` | test client ID | test client ID | production client ID |
| `EDGE_CONFIG` | test store (auto on Vercel) | test store | production store |
| `NEXT_PUBLIC_SUPABASE_URL` | shared project (or unset → seed) | shared project | shared project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | shared anon key (or unset → seed) | shared anon key | shared anon key |
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

## Migrations

This demo runs **one Supabase project**, so a migration is applied once, to that project, and
validated on a Vercel preview deploy (which reads the same DB) before you rely on it in
production. The `add-migration` discipline still holds: enum changes are the **two-step** pair
(`0006` add value → `0007` backfill), and at Adobe scale you'd run that **staging-first** across
separate per-tier projects. Never skip the preview validation.

See [`.cursor/skills/add-migration/SKILL.md`](../.cursor/skills/add-migration/SKILL.md).

## Future: per-tier isolation (Supabase Branching)

This demo runs **one Supabase project** across all tiers. At Adobe scale you'd isolate per tier —
either separate dev/staging/prod projects or [Supabase Branching](https://supabase.com/docs/guides/platform/branching),
which attaches a preview DB branch to each PR. That's the upgrade path; the demo keeps one project
for simplicity.

## Deploy policy

**Production deploys automatically on merge to `main`** (Vercel). New features ship **dark** —
code is live, LaunchDarkly flag **OFF** in production until `/release-flag` completes a controlled
rollout.

## Preview deployment protection (SSO + bypass)

This project uses **Vercel SSO deployment protection** scoped to
`all_except_custom_domains`: branch preview URLs (`*.vercel.app`) require team login; the
production alias [`adobe-cursor-demo.vercel.app`](https://adobe-cursor-demo.vercel.app) stays
public.

For **LaunchDarkly preview demos** (test env on PR deploys), pick one access mode:

| Mode | When | Setup |
|------|------|-------|
| **Public previews (demo day)** | Audience opens preview URLs in a browser without Vercel login | `./.github/scripts/disable-preview-sso.sh` |
| **SSO + bypass (day-to-day)** | Keep previews team-gated; CI/agents use header bypass | `./.github/scripts/enable-preview-sso.sh` + `./.github/scripts/enable-preview-protection-bypass.sh` |

**Current demo posture (applied via CLI):** SSO **disabled** on previews; Protection Bypass for Automation **enabled** (for CI when SSO is turned back on).

| Step | Command / action |
|------|------------------|
| Enable bypass (one-time / after re-enabling SSO) | `./.github/scripts/enable-preview-protection-bypass.sh` |
| Public previews for demo | `./.github/scripts/disable-preview-sso.sh` |
| Lock previews after demo | `./.github/scripts/enable-preview-sso.sh` |
| Read bypass secret (local only — never commit) | `vercel project protection adobe-cursor-demo --format json` |
| CLI fetch (SSO on) | `export VERCEL_AUTOMATION_BYPASS_SECRET=…` then `vercel curl /campaigns --deployment <preview-url>` |
| Browser link helper (SSO on) | `./scripts/preview-demo-url.sh <preview-url> /campaigns` — requires logged-in browser or use public-preview mode above |

Header bypass (automation / `vercel curl`):

```http
x-vercel-protection-bypass: <secret>
```

Query-param form (browser cookie; less reliable when not logged into Vercel):

```text
https://<preview>.vercel.app/campaigns?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=<secret>
```

Docs: [Vercel deployment protection bypass](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation)
