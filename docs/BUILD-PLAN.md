# Build plan — building Pigment *in Cursor*

How to build (or rebuild) this app with Cursor, optimised for Agent/Composer + Bugbot + CI.
A verified reference scaffold is already in the repo; use this plan to build from scratch, to
extend it, or to rehearse the build itself as part of the demo. Spec = [`PRD.md`](PRD.md).

## 0. One-time setup (you do this in Cursor)
- Open the repo in Cursor. Confirm `AGENTS.md` and `.cursor/rules/*` are picked up (Settings →
  Rules shows them).
- **Bugbot:** enable on the GitHub repo (Cursor dashboard → Bugbot). Point it at `main`.
- **MCP:** copy `.cursor/mcp.json`, fill the Supabase token, and authenticate the **Atlassian**
  server (Jira + Confluence) via OAuth in Cursor.
- **Plan (Jira + Confluence):** run **`/bootstrap-plan`** once — Cursor creates the **PIG** epic
  + "plan phase" stories and the **Pigment** Confluence space via the MCP. This is Phase 0; the
  build then walks the backlog. Full layout: [`PLAN.md`](PLAN.md).
- **Hooks:** review `.cursor/hooks.json` (runs the a11y gate after edits). Adjust to taste.
- **CI secret:** add a **team service-account** `CURSOR_API_KEY` (not a personal key) for the
  headless **`cursor-agent -p`** CI job, so PRs/usage are governed and attributable. Cloud-agent
  env (`.cursor/environment.json`) + Bugbot / Security Agents / Approval Agents config:
  [`AGENT-OPS.md`](AGENT-OPS.md).
- **Supabase + Vercel + LaunchDarkly:** create Supabase projects (dev/staging/prod per
  [`ENVIRONMENTS.md`](ENVIRONMENTS.md)), run `supabase/migrations/0001_campaigns.sql`, set tier-scoped
  env vars on Vercel, authenticate **LaunchDarkly MCP** (OAuth). See [`LAUNCHDARKLY.md`](LAUNCHDARKLY.md).

## 1. Build phases (each is a Jira "plan phase" story)
Each phase below maps to a story in epic **PIG** (PIG-2…PIG-7), created by `/bootstrap-plan`.
Run every phase plan-first: **`/start-ticket PIG-N`** (sync with latest `main`, pull the story,
post the plan back, move to In Progress) → build (wrap features behind LD flags) → **`/open-pr`**
(review-bugbot, push, PR, preview flag validation, merge) → **`/release-flag`** (prod rollout via
LaunchDarkly) → **`/ship-ticket PIG-N`** (ADR, link PR, Done). Between sessions, run **`/sync-main`**
daily. **PIG-16** adds the flag-driven SDLC spine.

**Phase 0 — bootstrap the plan (PIG-1).** `/bootstrap-plan` — create the epic, the plan-phase
stories, and the Confluence space via the Atlassian MCP (see Setup + `PLAN.md`).

**Phase 1 — scaffold (PIG-2).**
> "Scaffold a Next.js 16 App Router app (TypeScript, Tailwind v4), init shadcn/ui, and add
> `button card table`. Install `@base-ui/react`, `@supabase/supabase-js`, `@supabase/ssr`, and
> `vitest`. Don't write feature code yet."

**Phase 2 — design system + a11y gate.**
> "Per `PRD.md` §5 and `.cursor/rules/design-system`, set `--primary` to an indigo brand in
> `app/globals.css` (light + dark). Create `components/ui/status-badge.tsx` exporting a
> `STATUS_TOKENS` map (draft/live/review, light + dark, each WCAG-AA) and a `StatusBadge`.
> Add `lib/contrast.ts` (WCAG math) and `components/ui/status-badge.test.ts` asserting every
> status×theme pair ≥ 4.5:1. Add a `test` script. Keep it green."

**Phase 3 — data + Supabase.**
> "Add `lib/supabase/server.ts` and `client.ts` (`@supabase/ssr`, async `cookies()`), a
> `lib/campaigns.ts` with a `Campaign` type, seed data, and `getCampaigns()` that reads
> Supabase when env is set and falls back to seed otherwise. Add
> `supabase/migrations/0001_campaigns.sql` (table + enum + RLS anon-read + seed) and
> `.env.example`."

**Phase 4 — the Campaigns surface.**
> "Build `/campaigns` per `PRD.md`: a server `page.tsx` that fetches campaigns and renders a
> client `CampaignsView` (status filter using a Base UI `Select`, a grid of `CampaignCard`,
> and a `CampaignsTable`). Wire a `ThemeProvider` + theme toggle in the layout. Use system
> components and tokens only — no hardcoded colors."

**Phase 5 — SDLC scaffolding.**
> "Add `CODEOWNERS` (platform owns `components/ui`, `lib`, `globals.css`, `.cursor`; product
> owns `app/campaigns`, `components/campaigns`). Add the CI workflow: typecheck + test + build,
> plus a `cursor-agent` job that runs on PRs to fix a failing pipeline (bounded by allow/deny
> permission rules; deny `Shell(git)` and `Write(.env*)`)." *(You finalise the exact
> `cursor-agent` Action invocation against current Cursor docs.)*

**Phase 6 — verify.** `npm test && npm run typecheck && npm run build`, then **`/open-pr`**
( `/review-bugbot` → push → PR → merge) and confirm the Vercel preview + Bugbot on the PR.

## 2. The Cursor surfaces this demonstrates (201 spine)
> Why each primitive is used the way it is (rule types, hook events, subagent fields), verified
> against cursor.com/docs: [`CURSOR-SETUP.md`](CURSOR-SETUP.md).

| Surface | File(s) here | What it proves |
|---|---|---|
| **Rules** | `.cursor/rules/*.mdc` | conventions by apply-mode: `project`/`planning` Always, `design-system` Auto-Attach on `.tsx` edits |
| **Skills** | `.cursor/skills/*` | procedures the agent auto-reaches (`impeccable`, `add-migration`, **`review-bugbot`**, **`review-security`**) — run in the CLI too |
| **Review (IDE + PR)** | `.cursor/BUGBOT.md` + Bugbot dashboard | **`/review-bugbot`** pre-push (syncs with PR Bugbot); PR Bugbot + Security + Approval on merge gate |
| **AGENTS.md** | `AGENTS.md` | durable project memory the agent reads |
| **Slash commands** | `.cursor/commands/*.md` | plan-first sequence: **`/start-ticket`** → build → **`/open-pr`** → merge → **`/ship-ticket`** |
| **Hooks** | `.cursor/hooks.json` | deterministic gates: a11y (`afterFileEdit`) + governance allow/deny (`beforeShellExecution`) — fire in CI/cloud agents too |
| **MCP** | `.cursor/mcp.json` | Agent grounded in live Supabase schema + Jira/Confluence |
| **Bugbot** | (configured in Cursor) | semantic PR review at 100+-dev scale |
| **`cursor-agent` in CI** | CI workflow (Phase 5) | the pipeline self-heals a red build |

## 3. Wiring the two demo scenarios
Build the app clean (green `main`). The scenarios are *performed*, not committed — exact
diffs, verbatim prompts, and the expected Bugbot comment are in [`INJURIES.md`](INJURIES.md).
Rehearse until: INJURY A reliably draws a Bugbot comment citing the tokens-never-literals
standard (Bugbot reviews from `.cursor/BUGBOT.md`, root + nested, plus dashboard/learned
rules — it does not read `.cursor/rules`),
and INJURY B reliably turns CI red and the `cursor-agent` job fixes it. Keep a pre-baked
fallback PR + a recording (see `DEMO-RUNBOOK.md`).
