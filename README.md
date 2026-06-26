# Pigment — a design system at 100+-engineer scale

A **visual** demo repo for the Cursor × Adobe Field Engineer sessions. One story an exec and
an engineer both get in a second:

> One platform team owns a design system. 200+ product engineers consume it. Keeping them
> consistent, on-brand, and accessible **at that scale** is the pain. Cursor is how the
> platform team becomes a force multiplier across the whole SDLC.

The code is deliberately simple — a few components + a token file. The point is **pain ↔
solution made visible**, not code complexity.

## This repo is a Cursor build-spec package
Documentation-first: open it in Cursor and build/extend the app with Composer + Agent. A
verified reference scaffold is included, but the spec docs are the source of truth.

| File | What it is |
|---|---|
| [`STRATEGY.md`](STRATEGY.md) | the Adobe-first demo strategy (source of record) |
| [`docs/PRD.md`](docs/PRD.md) | product requirements (PM perspective) |
| [`docs/BUILD-PLAN.md`](docs/BUILD-PLAN.md) | how to build it *in Cursor*, phase by phase, with prompts |
| [`docs/PIPELINE.md`](docs/PIPELINE.md) | the total SDLC loop — Jira → Cursor → PR/Bugbot → CI → Vercel → Sentry → Jira |
| [`docs/PLAN.md`](docs/PLAN.md) | the build as a live Jira backlog + Confluence space, driven via the Atlassian MCP |
| [`docs/DEMO-RUNBOOK.md`](docs/DEMO-RUNBOOK.md) | 101 + 201 run-of-show + "say this, not that" |
| [`docs/INJURIES.md`](docs/INJURIES.md) | the two **specific** failure→fix scenarios (exact diffs + prompts) |
| [`docs/CURSOR-SETUP.md`](docs/CURSOR-SETUP.md) | why each Cursor primitive is used as it is — verified rule types, hook events, subagent fields |
| [`docs/TEAMWORK-SKILLS.md`](docs/TEAMWORK-SKILLS.md) | the installed `twg` Teamwork-Graph skills mapped to the loop (synthesis layer over the MCP) |
| [`docs/TOOLCHAIN.md`](docs/TOOLCHAIN.md) | one tool per SDLC stage (MCP/CLI/skill) — and what's deliberately excluded |
| [`docs/AGENT-OPS.md`](docs/AGENT-OPS.md) | the governed setup for Cloud Agents · Bugbot · Security Agents · Approval Agents |
| `AGENTS.md` · `.cursor/rules/*.mdc` | durable context + rules: `project`/`planning` (Always) + `design-system` (Auto-Attach via globs) |
| `.cursor/skills/*` · `.cursor/agents/*` | skills (impeccable, **add-migration**) the agent auto-reaches; the readonly **`/reviewer`** subagent |
| `.cursor/commands/*` | slash commands: new-component, a11y-audit, fix-ci, bootstrap-plan, start-ticket, ship-ticket |
| `.cursor/hooks.json` · `.cursor/mcp.json` | hooks: a11y-gate (afterFileEdit) + **governance gate (beforeShellExecution)** + impeccable (preToolUse); Supabase/Atlassian/Vercel/Sentry MCP |
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
Schema + seed in `supabase/migrations/0001_campaigns.sql`. The app reads from Supabase when
`NEXT_PUBLIC_SUPABASE_URL` is set, otherwise falls back to seed data so it always renders.

## Demoing
Keep `main` green. Introduce the seeded regressions live — exact diffs, the precise Cursor
prompt, and the expected Bugbot comment are in [`docs/INJURIES.md`](docs/INJURIES.md). Full
run-of-show in [`docs/DEMO-RUNBOOK.md`](docs/DEMO-RUNBOOK.md); strategy in
[`STRATEGY.md`](STRATEGY.md).
