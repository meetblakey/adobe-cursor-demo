# The build plan as a live Atlassian environment (Jira + Confluence)

Pigment is built **plan-first**: the whole build is a Jira backlog (epic → "plan phase"
stories) and a Confluence space (the living design docs). Cursor creates and drives all of it
through the **Atlassian MCP** — so the SDLC's *Plan* stage is real, not a slide, and by demo
time your Teamwork site shows a genuine history that Cursor itself authored.

> You configure the Atlassian MCP + Teamwork (Jira + Confluence) in Cursor; this doc is the
> spec Cursor reads to set it up and then build against it. Cursor handles the lifecycle end to
> end via the MCP — create, pull, plan, update, document, link, close.

## Atlassian MCP — the tools this uses
Add the server to `.cursor/mcp.json` (see that file) and authenticate in Cursor (OAuth). The
agent uses these real tools:
- **Jira:** `getVisibleJiraProjects`, `getJiraProjectIssueTypesMetadata`, `createJiraIssue`,
  `editJiraIssue`, `getJiraIssue`, `searchJiraIssuesUsingJql`, `getTransitionsForJiraIssue`,
  `transitionJiraIssue`, `addCommentToJiraIssue`, `addWorklogToJiraIssue`, `createIssueLink`.
- **Confluence:** `getConfluenceSpaces`, `createConfluencePage`, `updateConfluencePage`,
  `getConfluencePage`, `getPagesInConfluenceSpace`, `searchConfluenceUsingCql`.

## Step 1 — Bootstrap the environment (complete, MCP handles everything)
Run the `/bootstrap-plan` command (or the prompt in BUILD-PLAN Phase 0). Cursor, via the MCP:
1. Finds/creates the Jira project (suggested key **PIG**) and the Confluence space **Pigment**.
2. Creates the Confluence pages below (seeded from these on-disk docs).
3. Creates the epic + all "plan phase" stories below, each linked to its Confluence page.
4. Leaves everything in **To Do** — the build then walks the backlog.

## The Jira backlog — epic → "plan phase" stories
**Epic: `PIG` — Build Pigment** (the design-system demo app).

| Story | Plan phase | Acceptance criteria (summary) | Confluence link |
|---|---|---|---|
| **PIG-1** | Bootstrap & conventions | Repo + `.cursor` rules/commands/hooks + `AGENTS.md` + `CODEOWNERS` present; MCP authenticated | Architecture & Conventions |
| **PIG-2** | Scaffold | Next.js 16 App Router + Tailwind v4 + shadcn + Base UI + Supabase + Vitest installed; app boots | Architecture & Conventions |
| **PIG-3** | Design system + a11y gate | `--primary` indigo; `StatusBadge` + `STATUS_TOKENS` (light/dark, all AA); `contrast.ts` + `status-badge.test.ts` green | Design System Spec |
| **PIG-4** | Data + Supabase | `campaigns` table + RLS + seed; SSR clients; `getCampaigns()` with seed fallback | Design System Spec |
| **PIG-5** | Campaigns surface | `/campaigns` renders cards + table + Base UI status filter; tokens only | Design System Spec |
| **PIG-6** | SDLC scaffolding | CI (typecheck+test+build) + headless `cursor-agent` job + hooks + `CODEOWNERS` | SDLC Pipeline |
| **PIG-7** | Verify + deploy | `npm test`/`tsc`/`build` green; Vercel preview live; Bugbot enabled | SDLC Pipeline |

**Demo-prep stories (the live gates the 101/201 perform):**
| Story | Purpose |
|---|---|
| **PIG-101** | INJURY A — off-brand `bg-pink-500` Duplicate button in `campaign-card.tsx` (Bugbot catches it on the PR) |
| **PIG-102** | INJURY B — `status-badge.tsx` `review.dark` fails WCAG AA (CI goes red; `cursor-agent` fixes it) |
| **PIG-204** | "Add a `size` prop to Button + an `archived` status" — the real ticket the 201 runs end-to-end |

Each story's **description** carries the acceptance criteria; the agent posts its **plan as a
comment**, logs effort with `addWorklogToJiraIssue`, links the PR with `createIssueLink`, and
moves it To Do → In Progress → Done via `transitionJiraIssue`.

## The Confluence space — living design docs
Space **Pigment**, seeded from the on-disk docs and kept current by the agent:
| Page | Source | Kept current by |
|---|---|---|
| Pigment — Overview & PRD | `docs/PRD.md` | platform team |
| Architecture & Conventions | `.cursor/rules/project.mdc` | agent on PIG-1/2 |
| Design System Spec (tokens, components, a11y contract) | `STATUS_TOKENS` + `.cursor/rules/design-system.mdc` | agent on PIG-3/4/5 |
| SDLC Pipeline | `docs/PIPELINE.md` | agent on PIG-6 |
| Demo Runbook (101 + 201) | `docs/DEMO-RUNBOOK.md` | platform team |
| **Decision Log (ADRs)** | (empty at bootstrap) | **agent appends one entry per story** as it builds |

The **Decision Log** is the key "write-back": as Cursor builds each phase, it appends a short
ADR (what it chose + why) via `updateConfluencePage` — so Confluence reflects the real build,
authored by the agent.

### Decision Log — ADR format + seed entries
At bootstrap, seed the page with this format and the first two ADRs below. Thereafter the agent
**appends one ADR per story** as it closes it (newest at the top). Keep each to four lines.

```
ADR-NNNN — <short title>            <YYYY-MM-DD> · <PIG-key> · Accepted
Context:      <the forces — why a decision was needed>
Decision:     <what we chose>
Consequences: <trade-offs + what it enables/constrains downstream>
```

> Dates: the agent reads the current date from the Jira story/worklog timestamp — it should not
> invent one. Number ADRs sequentially; never renumber an existing entry.

**ADR-0002 — Status tokens live in the component, gated by a contrast test** · PIG-3 · Accepted
- Context: 200+ surfaces must stay on-brand *and* WCAG-AA in light and dark; a product team
  must not be able to ship an unreadable chip.
- Decision: define `STATUS_TOKENS` (light/dark) in `components/ui/status-badge.tsx` as the
  single source, and enforce AA in CI via `components/ui/status-badge.test.ts`.
- Consequences: a11y is a build gate, not a review nicety; the `cursor-agent`-fixes-CI demo
  (INJURY B) targets exactly this file; new statuses must add a passing token + test.

**ADR-0001 — Stack: Next.js 16 App Router + shadcn (on Base UI) + Supabase on Vercel** · PIG-2 · Accepted
- Context: the demo must read as a modern enterprise front-end stack (Adobe's world), deploy
  cleanly, and let Bugbot / CI / Vercel previews shine.
- Decision: Next.js 16 + Tailwind v4 + shadcn/ui (whose current registry is built on Base UI)
  + Base UI (`@base-ui/react`) directly for the status filter + Supabase (`@supabase/ssr`).
- Consequences: one coherent primitive layer (no competing Radix-only lib); `@base-ui/react` is
  the current package (the `@base-ui-components/react` name was the beta); seed-data fallback
  keeps the app rendering before Supabase is configured.

## Step 2 — Build the backlog (the agent conducts from Jira)
For each story in order, the agent (per `.cursor/rules/planning.mdc`):
1. **Pull** the story (`getJiraIssue`) → read acceptance criteria + the linked Confluence page.
2. **Plan** in Plan mode → post the plan back as a comment (`addCommentToJiraIssue`); move to
   In Progress (`transitionJiraIssue`).
3. **Build** the phase (per `docs/BUILD-PLAN.md`).
4. **Document** → append an ADR to the Decision Log (`updateConfluencePage`); update the Design
   System Spec / Pipeline page if the phase changed it.
5. **Close** → `addWorklogToJiraIssue`, link the PR (`createIssueLink`), transition to Done.

That makes the whole build a real Plan→Code→Review→…→Observe loop with Jira and Confluence as
the system of record — exactly what the 201 then demonstrates on a single ticket (PIG-204).

## Guardrails
- The agent **reads/writes the candidate's own Teamwork site** — scope it to the **PIG**
  project and **Pigment** space only; never touch other projects/spaces.
- Never invent issue keys — always create/look up via the MCP and use the returned key.
- Verify the current Atlassian MCP endpoint, scopes, and tool names at the Atlassian MCP docs
  day-of; OAuth scopes must allow write to Jira + Confluence.
