<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Pigment — design system at 100+-engineer scale

> Demo prop for the Cursor 101/201 sessions. Mirrors the `AGENTS.md` Adobe ships in its own
> public AEM docs — proof this convention is already how Adobe works.

**Pigment** is a design system owned by one platform team and consumed by 200+ product
surfaces (the Campaigns Console under `app/campaigns` is one). Stack: Next.js 16 App Router,
Tailwind v4, shadcn/ui, Base UI (`@base-ui/react`), Supabase, Vercel. The repo demonstrates
Cursor across the SDLC: in the editor, on the PR (Bugbot), in CI (`cursor-agent`).

## Conventions the agent MUST follow
- **Tokens & system components, never literals.** Use `@/components/ui/*` and theme tokens
  (`bg-primary`, the `Button` `variant` prop, `StatusBadge`). Never hardcode a Tailwind color
  literal (`bg-pink-500`, raw hex) in `app/` or `components/campaigns/`. See
  `.cursor/rules/design-system.mdc`.
- **Accessibility is a contract.** Keep WCAG AA; `components/ui/status-badge.test.ts` stays green.
- **Reuse before authoring.** Compose existing `@/components/ui` before adding new ones.
- **Respect RSC boundaries.** Server Components fetch data (`lib/`); mark interactive files
  `'use client'`.
- **No secrets / no network from client code.** Never write `.env*`.
- **Flag-first shipping.** Wrap new product features behind LaunchDarkly flags (default **OFF**
  in production). See `.cursor/rules/launchdarkly.mdc`, [`docs/LAUNCHDARKLY.md`](docs/LAUNCHDARKLY.md),
  [`docs/ENVIRONMENTS.md`](docs/ENVIRONMENTS.md).

## Build, test, run
```
npm install
cp .env.example .env.local   # optional; app uses seed data until Supabase is set
npm run dev                  # http://localhost:3000  → /campaigns
npm test                     # the a11y / contrast gate
npm run typecheck && npm run build
```

## How agents should work here
- Smallest change that satisfies the request + its test.
- Fixing a failing CI job: read the vitest output, fix the root cause (e.g. restore a status
  token to a passing value in `components/ui/status-badge.tsx`); do NOT delete the assertion.
- **Branch → PR → main.** Work on a feature branch (e.g. `PIG-8`); never push to `main` directly.
  GitHub ruleset + `guard-shell.sh` enforce merge-only on `main`. **`/sync-main`** (or
  `.github/scripts/sync-main-into-branch.sh`) merges latest `main` into your branch at the
  start of each session — run automatically via **`/start-ticket`** on existing branches.
- The **`beforeShellExecution` hook** (`.cursor/hooks/guard-shell.sh`) is a real allow/deny
  gate: editor chat may `git commit`/`push` on feature branches; CI/headless runs deny all git
  shell (workflow owns git); both deny pushes to `main`, `rm -rf`, `.env*` writes, and outbound
  `curl`/`wget`.
- Before push/PR: run **`/review-bugbot`** (required — syncs with PR Bugbot via patch ID);
  run **`/review-security`** when the diff touches `lib/**`, `supabase/**`, `.cursor/**`,
  `.github/**`, or API/auth paths. Use **`/open-pr`** to push, open the PR, and wait for checks.
  After merge: **`/release-flag`** (flag-gated work) → **`/ship-ticket`**. Use the
  **`add-migration`** skill for any schema change.

## Planning & docs (Atlassian MCP)
The build is plan-first: Jira (project **PIG**) is the backlog and system of record;
Confluence (space **Pigment**) is the living design docs. Drive both through the Atlassian MCP.
- **Pull before you build:** start each phase from its Jira story (`getJiraIssue`), read the
  acceptance criteria + linked Confluence page; post your plan back as a comment and move it to
  In Progress.
- **Write as you go:** log worklogs/decisions on the story; append an ADR to the Confluence
  **Decision Log** for each phase; keep the Design System Spec / SDLC Pipeline pages current.
- **Close honestly:** link the PR to the story and transition to Done; a Sentry-sourced prod
  fix is a NEW story, not a reopen.
- Scope strictly to **PIG** / **Pigment**; never invent keys or page IDs. Full backlog + space
  layout in `docs/PLAN.md`; rule in `.cursor/rules/planning.mdc`; commands `/bootstrap-plan`,
  `/start-ticket`, `/open-pr`, `/release-flag`, `/ship-ticket`.

## Cursor Cloud specific instructions
Dependencies are refreshed automatically on startup (`npm install`). Standard commands live in
**Build, test, run** above — reuse them; don't duplicate. Non-obvious caveats for this VM:
- **Runs with zero config on seed data.** No `.env*` is required. `getCampaigns()` uses in-app
  `SEED` in local/preview when Supabase is unset or errors; production requires live Supabase
  (see `lib/supabase/env.ts`). LaunchDarkly degrades gracefully without keys.
- **`.env.example` is committed** (the only `.env*` file that is — see `.gitignore`'s `!.env.example`).
  It holds variable names only, no secrets. `cp .env.example .env.local` works; filling it is
  optional, since the app runs/tests/builds on seed data with no env vars.
- **`npm run dev` serves `/` → redirects to `/campaigns`** on http://localhost:3000 (Turbopack).
- **`npm run lint` fails (exit 1) on one pre-existing error in `decks/build.js` (a CommonJS build
  script) plus ~136 warnings in `.cursor/skills/impeccable/scripts/**`** — these are tooling/skill
  files, not the app. Product code lints clean: `npx eslint app components lib` (no errors). Don't
  "fix" the skill files.
- **Sentry DSN is hardcoded** in `sentry.*.config.ts` / `instrumentation-client.ts`, so the app
  attempts telemetry by default; this is non-blocking if Sentry is unreachable.
