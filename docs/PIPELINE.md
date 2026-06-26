# The total pipeline — Cursor across the SDLC (the 201 spine)

The 201 demonstrates the SDLC as a **loop, not a line**: work enters as a Jira ticket, Cursor
touches every stage, and a production signal (Sentry) files the next ticket — closing the
circle. The thesis: *the human is the conductor; Cursor is the agent at every stage; the
platform team's rules/gates make it safe at 100+-engineer scale.*

## The loop

```
        ┌──────────────────────────────────────────────────────────────┐
        ▼                                                              │
1. PLAN        2. CODE         3. REVIEW      4. CI            5. DEPLOY │ 6. OBSERVE
   Jira    →   Cursor      →   PR + Bugbot →  GH Actions   →   Vercel  →   Sentry
   ticket      (Plan→Agent)    (rules)        + cursor-agent   (preview     (Seer/MCP)
                                                                → prod)        │
        └───────────────  Sentry → Jira files the next ticket  ───────────────┘
```

| # | Stage | Tool (demo) | Tool (Adobe, talk-track) | Where Cursor inserts |
|---|---|---|---|---|
| 1 | Plan | **Jira + Confluence** | Jira + Confluence | Atlassian **MCP** pulls the ticket + acceptance criteria *and* the linked Confluence design doc into the agent; the agent posts its plan back as a comment. The whole build backlog + design space live here — see [`PLAN.md`](PLAN.md) |
| 2 | Code | Cursor editor | Cursor editor | Plan mode → Agent/Composer/Tab, grounded by Rules + AGENTS.md + Supabase **MCP** |
| 3 | Review | GitHub PR | GitHub/Bitbucket PR | **Bugbot** reviews vs `.cursor/rules` (catches INJURY A) |
| 4 | CI | **GitHub Actions** | Jenkins → Spinnaker | **`cursor-agent`** headless job fixes a red pipeline (catches/fixes INJURY B) |
| 5 | Deploy | **Vercel** (preview → prod) | Spinnaker → K8s | preview URL per PR; Cursor never touches the deploy gate |
| 6 | Observe | **Sentry** (lead) | **Datadog** + Sentry | Sentry **Seer / MCP** pulls the prod issue into Cursor → proposes the fix |
| →1 | Close loop | **Sentry → Jira** | Sentry/Datadog → Jira | the incident auto-files the next ticket → back to step 1 |

The full *tool per stage* (MCP / CLI / skill) — and what's deliberately excluded — is in
[`TOOLCHAIN.md`](TOOLCHAIN.md). `.cursor/mcp.json` declares the four servers the loop touches:
supabase (data), atlassian (plan), vercel (deploy), sentry (observe).

At the **Review/Approve** gate, three agents stack as defense-in-depth (full setup in
[`AGENT-OPS.md`](AGENT-OPS.md)): **Bugbot** (general correctness, grounded in `.cursor/BUGBOT.md`)
and the **Security Reviewer** (security classes; can block, never auto-fixes) review every PR in
parallel; the **Approval Agent** (`APPROVAL_POLICY.md`) then auto-approves low-risk policy-compliant
PRs or routes the rest to humans. A **Vulnerability Scanner** cron feeds the at-rest baseline into
the Sentry→Jira leg. Cloud Agents author + self-verify; nothing in the chain merges or deploys
autonomously — a human owns the merge and the deploy gate.

## The Teamwork work-data layer (twg skills)
On top of the MCP CRUD, the agent can reach the installed **`twg`** Teamwork-Graph skills (in
`~/.claude/skills/`, scanned by Cursor) for *synthesized* work-data at each stage — used **when
needed**, scoped to the PIG/Pigment data, never the critical live path. Full map +
guardrails: [`TEAMWORK-SKILLS.md`](TEAMWORK-SKILLS.md).

| Stage | twg skill | What it adds |
|---|---|---|
| Plan / onboarding | `twg-context-discovery` | "catch me up on PIG-204", project-to-repo, dependency maps (the distributed/India ramp) |
| Review | `twg-engineering-work` | the org's review queue / stale reviews / bottlenecks *behind* Bugbot's per-PR catch |
| Observe | `twg-operational-health` | turns the Sentry prod error into an incident / post-incident review → next ticket |
| Report | `twg-status-rollups` | the leadership rollup from the PIG epic — the baseline→report beat on Adobe's own terms |

## Recommendation on the "observe" end

- **Sentry — lead with it (live or pre-staged).** Tightest fit for Next.js on Vercel
  (first-class SDK, releases, source maps, session replay) and the only option that **closes
  the loop into Cursor**: Sentry's AI agent (Seer) + the Sentry MCP let Cursor pull a
  production error and propose a fix; the Sentry↔Jira integration files the ticket. That makes
  the SDLC a circle, which is the 201's whole point.
- **Datadog — the enterprise complement, in the talk-track, not a live beat.** Datadog is
  APM/traces/logs/SLOs/RUM across a backend estate — Adobe's scaled-services story. It has an
  MCP + Bits AI too. Naming it (not demoing it) keeps "depth over breadth": *"Sentry closes the
  front-end error→fix loop; Datadog is the same pattern at service-SLO scale across your
  backend — both feed Cursor via MCP."*

## Where the two demo scenarios live in the loop
- **INJURY A** (off-brand button) is caught at **stage 3 (Bugbot)** — before it ever ships.
- **INJURY B** (a11y contrast fail) is caught at **stage 4 (CI)** and fixed by **`cursor-agent`**.
- The **Sentry beat** is the optional third act / narration: a prod error → pulled into Cursor
  via Seer/MCP → fix → which re-enters at stage 2. Keep it pre-staged or narrated (live prod
  errors are timing-dependent).

## Honesty / accuracy notes (you're presenting to Cursor's own Head of FE)
- Atlassian (Jira) Remote MCP, the **Sentry MCP + Seer**, and the **Datadog MCP** all exist as
  of writing — but **verify current availability, scopes, and auth model day-of** at each
  vendor's docs. Don't assert a capability you haven't re-checked.
- Cursor touches stages 1–4 and 6 directly; it **does not** replace the deploy gate (5) or the
  human approver. Say that explicitly — it's the governance point, not a limitation.
- For Adobe, map honestly: their pipeline is Jira → Bitbucket/GitHub → Jenkins → Spinnaker →
  K8s, observed by Datadog (+ Sentry on front-ends). The demo runs the *same shape* on
  GitHub Actions + Vercel + Sentry because we own it end-to-end.
