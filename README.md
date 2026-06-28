# Pigment — a design system at 100+-engineer scale

A **visual** demo repo for the Cursor × Adobe Field Engineer sessions. One story an exec and
an engineer both get in a second:

> One platform team owns a design system. 200+ product engineers consume it. Keeping them
> consistent, on-brand, and accessible **at that scale** is the pain. Cursor is how the
> platform team becomes a force multiplier across the whole SDLC.

The app is small but real — a campaigns console (list, grid, and a detail route) built on a
shared component + token system, with a live a11y gate and Supabase wiring. It's scoped to stay
legible in a 30-minute room; the point is **pain ↔ solution made visible** at scale, not lines
of code.

## This repo is a Cursor build-spec package
Documentation-first: open it in Cursor and build/extend the app with Composer + Agent. A
verified reference scaffold is included, but the spec docs are the source of truth.

| File | What it is |
|---|---|
| [`STRATEGY.md`](STRATEGY.md) | the Adobe-first demo strategy (source of record) |
| [`docs/PRD.md`](docs/PRD.md) | product requirements (PM perspective) |
| [`docs/BUILD-PLAN.md`](docs/BUILD-PLAN.md) | how to build it *in Cursor*, phase by phase, with prompts |
| [`docs/PIPELINE.md`](docs/PIPELINE.md) | the total SDLC loop — Jira → Cursor → PR/Bugbot → CI → Vercel → **LaunchDarkly** → Sentry → Jira |
| [`docs/ENVIRONMENTS.md`](docs/ENVIRONMENTS.md) | Dev · Preview · Production tier matrix (Vercel, Supabase, LaunchDarkly) |
| [`docs/LAUNCHDARKLY.md`](docs/LAUNCHDARKLY.md) | LaunchDarkly SDK setup, Edge Config, flag evaluation |
| [`docs/PLAN.md`](docs/PLAN.md) | the build as a live Jira backlog + Confluence space, driven via the Atlassian MCP |
| [`docs/DEMO-RUNBOOK.md`](docs/DEMO-RUNBOOK.md) | 101 + 201 run-of-show + "say this, not that" |
| [`docs/INJURIES.md`](docs/INJURIES.md) | the two **specific** failure→fix scenarios (exact diffs + prompts) |
| [`docs/CURSOR-SETUP.md`](docs/CURSOR-SETUP.md) | why each Cursor primitive is used as it is — verified rule types, hook events, subagent fields |
| [`docs/TEAMWORK-SKILLS.md`](docs/TEAMWORK-SKILLS.md) | the installed `twg` Teamwork-Graph skills mapped to the loop (synthesis layer over the MCP) |
| [`docs/TOOLCHAIN.md`](docs/TOOLCHAIN.md) | one tool per SDLC stage (MCP/CLI/skill) — and what's deliberately excluded |
| [`docs/AGENT-OPS.md`](docs/AGENT-OPS.md) | the governed setup for Cloud Agents · Bugbot · Security Agents · Approval Agents |
| [`docs/CLOUD-AGENTS.md`](docs/CLOUD-AGENTS.md) | Cloud Agent parallel path — `/cloud-ticket`, VM self-verify, dashboard snapshot |
| [`docs/SENTRY-AUTOMATION.md`](docs/SENTRY-AUTOMATION.md) | Sentry Automation — issueCreated → Jira + draft PR; `/sentry-incident` replay |
| [`docs/DASHBOARD-SETUP.md`](docs/DASHBOARD-SETUP.md) | one-time Cursor dashboard checklist (VM snapshot + Automation) |
| `AGENTS.md` · `.cursor/rules/*.mdc` | durable context + rules: `project`/`planning` (Always) + `design-system` (Auto-Attach via globs) |
| `.cursor/skills/*` | skills the agent auto-reaches: impeccable, **add-migration**, **review-bugbot**, **review-security** |
| `.cursor/commands/*` | slash commands: bootstrap-plan, start-ticket, **cloud-ticket**, sync-main, open-pr, **release-flag**, ship-ticket, **sentry-incident** |
| `.cursor/prompts/*` | Cloud Agent self-verify + Sentry incident agent prompt templates |
| `.cursor/hooks.json` · `.cursor/mcp.json` | hooks + Supabase/Atlassian/Vercel/Sentry/**LaunchDarkly** MCP |
| `.cursor/permissions.json` · `environment.json` · `BUGBOT.md` | agent execution perms · cloud-agent env · Bugbot review rules |
| `APPROVAL_POLICY.md` · `.cursor/approval-policies/ROUTING.md` | Approval Agent policy + routing (product→policy) per the docs format |
| `CODEOWNERS` · `supabase/migrations/*` | platform/product ownership + DB schema |

## Stack
Next.js 16 (App Router) · Tailwind v4 · shadcn/ui · Base UI (`@base-ui/react`) · Supabase ·
Vercel. (You own the config — Supabase project, env vars, Vercel.)

## Run it
```
npm install
cp .env.example .env.local      # optional — renders with seed data until Supabase is set
npm run dev                     # http://localhost:3000  → /campaigns
npm test                        # the a11y / contrast gate (real logic, real test)
npm run typecheck && npm run build
```

## Structure (the 100+-team model, in miniature)
| Path | Owner | Role |
|---|---|---|
| `components/ui/*` (shadcn) | **platform team** | shared components, tokens only |
| `components/ui/status-badge.tsx` + `.test.ts` | **platform team** | semantic status tokens + the WCAG AA gate |
| `app/globals.css` | **platform team** | brand/theme tokens |
| `lib/` | **platform team** | data access (Supabase) + contrast math |
| `app/campaigns/` + `components/campaigns/*` | a **product team** | one of 200+ surfaces |
| `.cursor/rules/`, `AGENTS.md`, `CODEOWNERS` | **platform team** | governance pushed to every engineer + agent |

## Supabase
Schema + seed in `supabase/migrations/0001_campaigns.sql`. Tier-scoped env vars per
[`docs/ENVIRONMENTS.md`](docs/ENVIRONMENTS.md). Local/preview fall back to seed data when unset;
production requires live Supabase.

## Demoing
Keep `main` green. Introduce the seeded regressions live — exact diffs, the precise Cursor
prompt, and the expected Bugbot comment are in [`docs/INJURIES.md`](docs/INJURIES.md). Full
run-of-show in [`docs/DEMO-RUNBOOK.md`](docs/DEMO-RUNBOOK.md); strategy in
[`STRATEGY.md`](STRATEGY.md).
