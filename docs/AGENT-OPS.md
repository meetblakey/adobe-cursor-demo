# Agent ops — Cloud Agents · Bugbot · Security Agents · Approval Agents

Treat these as **one governed defense-in-depth pipeline around the pull request**, not four
products bolted on. A human owns the merge and the deploy gate throughout. Researched against
cursor.com/docs — names and gating move fast, so **re-verify day-of** (you're presenting to the
team that ships these).

**Live-demo vs configure-and-narrate (depth over breadth):**
- **LIVE (must-work):** Bugbot on the PR (catches INJURY A) + the headless `cursor-agent` fixing CI (INJURY B).
- **LIVE (optional — pre-staged + fallback recording):** Cloud Agents via **`/cloud-ticket`**; Sentry
  Automation via **`/sentry-incident`** replay or dashboard trigger (see [`SENTRY-AUTOMATION.md`](SENTRY-AUTOMATION.md)).
- **Configure-and-narrate:** Security Agents, Approval Agents at org scale.

**Plan reality — you're on the Individual plan.** What you can actually *run*: **Bugbot** (PR
reviews + `.cursor/BUGBOT.md` rules + effort level), **Cloud Agents / `cursor-agent` CLI**, the
**hooks**, and **`permissions.json`**. What's **Teams/Enterprise → narrate as the Adobe-scale
story, don't claim you run it**: Team Rules, the Bugbot analytics dashboard, and **Security Agents**
(plus the Approval Agent's *Use Security Review Context* toggle). The **Approval Agent itself has no
stated plan restriction** — verify it in your dashboard; either way its repo policy files
(`APPROVAL_POLICY.md`, `.cursor/approval-policies/ROUTING.md`) are on disk and free to author. That's
honest and on-message: *"here's what I run solo; here's what Adobe gets at org scale."*

## 1. Cloud Agents (formerly *Background Agents* — same product, renamed)
Agents that run in Cursor's cloud VM on their own branch: write → test → **self-verify in the VM**
(it has a desktop, so it can run the dev server, drive a browser, attach screenshots/logs) → open
a merge-ready PR. The **same** agent runs headless as the **`cursor-agent`** CLI in CI.

**Repo:** [`/cloud-ticket`](.cursor/commands/cloud-ticket.md) · [`.cursor/prompts/cloud-agent-self-verify.md`](.cursor/prompts/cloud-agent-self-verify.md) · [`docs/CLOUD-AGENTS.md`](CLOUD-AGENTS.md)

- **Configure:** `.cursor/environment.json` — `install`, `dev` terminal (`npm run dev`), `verify`
  terminal (`typecheck` + `test` + `build`). Save a **VM snapshot** after first successful boot
  (*the top lever on cloud-agent quality*).
- **Dashboard checklist** ([cursor.com/agents](https://cursor.com/agents)):
  1. Connect the GitHub repo.
  2. Save VM snapshot (post-`npm install` + dev server up).
  3. Scope secrets: **no** Supabase/LD production keys (seed + LD defaults, same as CI).
  4. Wire **HTTP MCP** (proxied): **atlassian**, **sentry**, **vercel** as needed — stdio
     [`.cursor/mcp.json`](.cursor/mcp.json) is editor-only.
  5. Launch from IDE Cloud dropdown, dashboard, or Automations trigger.
- **CI:** invoke `cursor-agent -p "…"` with **`CURSOR_API_KEY`** (service account on Teams).
- **Loop:** stage 2→3 (author → PR) and stage 4 (CI self-heal). **Sentry Automation** (stage 6→2)
  also runs on Cloud Agents — see [`SENTRY-AUTOMATION.md`](SENTRY-AUTOMATION.md).

## 2. Bugbot — AI PR review *(LIVE for the demo — but kept OFF during the build; see the cost note)*
On the **Individual plan** the *only* rules layer is the in-repo **`.cursor/BUGBOT.md`** (plain
markdown, no frontmatter, root + optional nested files — already on disk, grounded in the same
tokens/a11y/RSC/test standard as the editor agent and **`/review-bugbot`**). No Team Rules, no learned/manual
dashboard rules, no analytics (Teams-only).
- **Settings (in `cursor.com/dashboard/bugbot`, when you enable it):** install the GitHub App at
  **org/repo** scope (enterprise-account scope means PR webhooks never fire). Effort = **Default**
  (cheaper than High), **Incremental Review** ON, **"Run only once per PR"** ON. Triggers are the PR
  comments **`cursor review`** / **`bugbot run`** (distinct from the in-editor `/review`). Autofix OFF.
- **Loop:** stage 3 — reviews the diff before the human + CI; cites `.cursor/BUGBOT.md` on INJURY A.

> **💸 Cost-safe during the build (the lean setup you asked for).** Bugbot bills *only when it
> actually reviews* (included usage first, then on-demand), and enable/disable + run-trigger are
> **dashboard/personal settings — there is NO repo file that turns it on/off.** So:
> 1. **During the whole pre-app build: leave Bugbot DISABLED on the repo.** It runs nothing, costs
>    **$0**. The `.cursor/BUGBOT.md` rules sit ready on disk. *(If you'd rather have it
>    enabled-but-dormant, set the personal setting **"Run only when mentioned"** — that disables
>    automatic reviews, so it never fires until you comment `bugbot run`.)*
> 2. **When the pre-app build is done: enable Bugbot** (one toggle in the installations list),
>    Default effort + Incremental + once-per-PR. Now the demo gets its live PR review on INJURY A,
>    and the only spend is the handful of demo PRs.
>
> Net: the most lenient/lowest-cost posture — no automatic reviews, cheapest effort, smallest
> scope, and zero spend until you flip it on after the build.

## 3. Security Agents / Security Review — *a distinct product, beta (2026-04-30, Teams/Enterprise)* *(narrate)*
Separate from Bugbot. Two Cursor-managed agents on the Automations platform (run on Cloud Agents):
- **Security Reviewer** — gates PRs for classes Bugbot doesn't specialize in (auth regressions,
  privacy/data-handling, prompt injection, agent tool auto-approvals). It **reports and can BLOCK,
  but does NOT auto-push fixes** — a human decides.
- **Vulnerability Scanner** — cron scan of the codebase *at rest*; findings file new Jira tickets.
- **Configure:** `cursor.com/dashboard/security-agents` — each agent needs ≥1 tool/MCP to run
  (wire to Slack/Jira to route findings). Locally, `/review-security` (Cursor 3.7+). Enterprise:
  run on a **self-hosted Cloud Agent pool** so reviews execute in the customer's VPC — the
  in-VPC answer to Adobe's data-residency concern.
- **The single custom instruction to paste** (dashboard → the Security Agent's custom-instructions
  field — it's **dashboard-only, no repo file**): *"Review this PR for security regressions in a
  Next.js + Supabase app: Supabase RLS and the server client's cookie handling; no secrets, tokens,
  or PII in client components, logs, or error messages; unsafe input reaching the database or a
  shell; prompt-injection or tool-auto-approval risks in any agent/MCP code; and missing
  authorization on new routes or server actions. Report each finding with a severity and a concrete
  fix, block on high severity, and do not auto-fix. Treat `.env*` and Supabase service keys as
  never-commit."* (Each agent also needs ≥1 tool/MCP wired to run.)
- **Honesty:** present as **beta**, report/block not auto-fix, Team/Enterprise-gated. It is **not**
  the `.cursor/hooks.json` runtime hooks and **not** Bugbot — three different mechanisms.

## 4. Approval Agents + the execution-permission model — *two different layers; never blur them* *(narrate)*
- **Layer 1 — execution permissions (what an agent may DO):** Run Mode = **Auto-review** (3.6+:
  allowlist fast-path + sandbox + classifier), `.cursor/permissions.json` (now on disk —
  `terminalAllowlist` prefix/case-sensitive, `mcpAllowlist` `server:tool`/case-insensitive,
  `autoRun.block_instructions`), and the **`beforeShellExecution`** hook (`guard-shell.sh`, now
  wired) as the deterministic floor. The **denylist is deprecated** — use the allowlist + classifier;
  these are **best-effort guardrails, not a hard boundary** (public allowlist-bypass CVEs), so the
  hard stops also live in CI/branch protection. Hooks **fail open** (only `deny`/exit-2 blocks).
- **Layer 2 — the Approval Agents product (PR gate):** `cursor.com/dashboard/approval-agents`,
  configured by **two repo files, both on disk**: **`APPROVAL_POLICY.md`** (free-form policy prose,
  matched in a file's directory + each ancestor) and **`.cursor/approval-policies/ROUTING.md`** (a
  YAML list of `product` / `boundary` / `policies` entries — routes the platform vs. campaigns
  surfaces to their policies). Dashboard toggles (exact names): **Use Risk Score**, **Maximum Risk
  for Approval**, **Use Bugbot Review Context**, **Use Security Review Context**. It auto-approves a
  low-risk, policy-compliant PR or assigns human reviewers; it **never merges and never replaces
  review**, acts as the `cursor` GitHub identity, and **a PR can't relax its own policy** (the agent
  uses the base-branch version of any changed policy/routing file).
  - **The additional approval criteria to paste** (dashboard → the Approval Agent's Custom Prompt
    field): *"Auto-approve ONLY product-surface PRs (app/campaigns or components/campaigns) that are
    within the risk threshold, have a clean Bugbot review with no open findings, keep `npm test`
    green, and touch no platform path. Route to a human (per CODEOWNERS) any PR that touches
    components/ui, lib, app/globals.css, .cursor, supabase/migrations, .github, or
    package.json/lockfile; any PR with an unresolved Bugbot or Security finding; or any PR that adds
    a dependency. Safe to approve: a copy tweak or a new campaign-card variant using existing
    tokens. Needs human review: a new design-system component, a token change, an RLS/migration
    change, a CI change."*
  - **Plan:** the docs state **no plan restriction for Approval Agents themselves** (verify in your
    dashboard — you're on Individual), but **Use Security Review Context requires Teams/Enterprise**,
    so leave that toggle OFF on Individual (keep Bugbot Review Context on). The two repo policy files
    cost nothing and are ready on disk regardless of plan.
- **Enforce org-wide** via the team-admin dashboard (overrides local `permissions.json` + IDE UI) —
  the keystone for 100+ engineers.

## How they compose (concentric, around the PR)
1. **Before code:** Run Mode + `permissions.json` + `beforeShellExecution` fence what *any* agent
   (local, cloud, or headless CI) may execute.
2. **Author:** Agent/Cloud Agent writes on a feature branch (`/start-ticket` editor or
   `/cloud-ticket` VM); local gates (`npm test`, etc.).
3. **IDE review (pre-push):** **`/review-bugbot`** on `branch changes` vs `main` (patch ID syncs
   with PR Bugbot); **`/review-security`** when touching platform/auth/supabase paths. See
   **`/open-pr`** command.
4. **PR review (parallel):** Bugbot (correctness, `.cursor/BUGBOT.md`) + Security Reviewer
   (security classes, can block). Vulnerability Scanner cron = continuous at-rest baseline.
5. **Approve/route:** Approval Agent waits on Bugbot/Security context when enabled; auto-clears
   low-risk policy-compliant PRs, escalates the rest per `APPROVAL_POLICY.md`.
6. **Human merge** — then **`/ship-ticket`** closes Jira/Confluence.
**Who approves what:** the permission layer auto-clears safe shell/MCP actions; Bugbot/Security
auto-flag defects + risk; the Approval Agent auto-approves only low-risk PRs with no open findings;
everything risky escalates to a human — who alone merges and alone promotes to prod. **Nothing in
the chain merges or deploys autonomously.**

## The narrative for Adobe
**Centralized governance, distributed velocity, a human owns the gate.** Policy is set once (Bugbot
Team Rules + per-repo enablement, the admin permission dashboard that overrides every local config,
Security Agents routing to Slack/Jira, Approval Agents + `APPROVAL_POLICY.md`) and 200 product teams
inherit it. Every team gets author→review→verify without a central review team reading every PR.
Cursor touches stages 1–4 and 6 but **never the deploy gate (5) and never the final merge**.

## Accuracy notes (state carefully / verify day-of)
- **Cloud = Background Agents** (renamed) — one product. Headless binary is **`cursor-agent`** (use
  `cursor-agent -p`); `agent` is only an alias.
- **`.cursor/BUGBOT.md`** (with the `.cursor/` prefix), not a repo-root `BUGBOT.md`. IDE:
  **`/review-bugbot`** / **`/review-security`**. PR: automatic review or `cursor review` /
  `bugbot run` comments — distinct from the in-editor `/review` skill.
- Don't quote the unverified Bugbot stats ("~90s", "Composer 2.5", "10% more bugs") — not in docs.
  Autofix needs usage pricing + storage (blocked in Legacy Privacy Mode).
- **Security Review is beta**, report/block (no auto-fix), each agent needs ≥1 MCP, Team/Enterprise.
- **Approval Agents ≠ permissions/Run Modes ≠ runtime hooks** — three mechanisms. Approval Agents
  never merge. Denylist deprecated; Run Modes best-effort (CVEs); hooks fail open.
- Cloud-agent machine size is Enterprise-via-support today (no self-serve knob). PR-embedded
  artifacts use public unguessable URLs — flag for a security audience.
