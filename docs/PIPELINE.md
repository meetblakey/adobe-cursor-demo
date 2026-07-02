# The total pipeline — Cursor across the SDLC (the 201 spine)

The 201 demonstrates the SDLC as a **loop, not a line**: work enters as a Jira ticket, Cursor
touches every stage, and a production signal (Sentry) files the next ticket — closing the
circle. The thesis: *the human is the conductor; Cursor is the agent at every stage; the
platform team's rules/gates make it safe at 100+-engineer scale.*

**The 201 rides ONE ticketed PR — the Scheduled story:**

| Story | Branch/PR | Flag | Gates it exercises |
|---|---|---|---|
| **PIG-206** — Add a `scheduled` campaign status | `PIG-206` (staged by **`/stage-scheduled-pr`**: `.demo/scheduled.patch` + the INJURY A drift) | **`scheduled-status`** (OFF in prod; released via `/release-flag`) | **Bugbot** on the re-introduced drift (checks green) → live fix → **INJURY B** follow-up commit (`replay-b`) → red CI → **`fix-ci`** self-heal → human merge → dark deploy → flag release → Sentry |

(**PIG-204** — the `archived` status — is the *shipped* predecessor story; its trail in
Jira/Confluence and migrations 0004/0005 are the worked example the agent mirrors.)

**Flag-driven shipping:** merge + deploy does **not** mean users see the feature. Code lands on
`main` and deploys **dark**; LaunchDarkly controls exposure per environment. See
[`ENVIRONMENTS.md`](ENVIRONMENTS.md) and [`LAUNCHDARKLY.md`](LAUNCHDARKLY.md).

## The loop

```
        ┌────────────────────────────────────────────────────────────────────────┐
        ▼                                                                        │
1.PLAN  2.CODE    2alt.CLOUD 2b.IDE REV  3.REVIEW  4.CI   5.DEPLOY  5b.RELEASE │ 6.OBSERVE
 Jira→  Cursor→  /cloud-   /review-   PR+      GH     Vercel   LaunchDarkly    Sentry
 ticket  (flag)   ticket    bugbot     Bugbot   Actions preview  rollout         Automation
        └────  Sentry issueCreated → Jira + draft PR (human merge)  ─────────────┘
```

| # | Stage | Tool (demo) | Tool (Adobe, talk-track) | Where Cursor inserts |
|---|---|---|---|---|
| 1 | Plan | **Jira + Confluence** | Jira + Confluence | Atlassian **MCP** pulls the ticket + acceptance criteria; create/link LD flag key in AC for feature work |
| 2 | Code | Cursor editor + **LaunchDarkly SDK** | Cursor editor | Wrap new features behind flags (default **OFF** in LD production); `launchdarkly-flag-create` skill |
| **2alt** | **Code (parallel)** | **Cloud Agent** + **`/cloud-ticket`** | Cloud Agents | VM self-verify (screenshots on `/campaigns`); see [`CLOUD-AGENTS.md`](CLOUD-AGENTS.md) |
| 2b | IDE review | **`/review-bugbot`** (+ **`/review-security`**) | — | Pre-push review — see [`open-pr`](../.cursor/commands/open-pr.md) |
| 3 | Review | GitHub PR | GitHub/Bitbucket PR | **Bugbot** + Security + Approval; validate flag wiring on preview |
| 4 | CI | **GitHub Actions** | Jenkins → Spinnaker | **`cursor-agent`** fixes red pipeline (INJURY B); runs without LD/Supabase secrets |
| 5 | Deploy | **Vercel** | Spinnaker → K8s | Preview per PR; **prod auto-deploy on merge** (dark — flag OFF in production) |
| **5b** | **Release** | **LaunchDarkly MCP** + **`/release-flag`** | LD / similar | Human toggles prod rollout after preview validation in LD **test** env |
| **5c** | **Cleanup** | **`launchdarkly-flag-cleanup`** | — | Remove flag code after 100% rollout |
| 6 | Observe | **Sentry** + **LD kill switch** | Datadog + Sentry | Instant rollback via flag OFF; Seer/MCP → fix → new Jira ticket |
| **6→2** | **Observe → fix** | **Cursor Automation** + **`/sentry-incident`** | Sentry → agent | `issueCreated` → new Jira story + draft PR; human merge — [`SENTRY-AUTOMATION.md`](SENTRY-AUTOMATION.md) |
| →1 | Close loop | **Sentry → Jira** | Sentry/Datadog → Jira | incident files the next ticket |

The full *tool per stage* is in [`TOOLCHAIN.md`](TOOLCHAIN.md). `.cursor/mcp.json` declares:
**supabase**, **atlassian**, **vercel**, **sentry**, **launchdarkly**.

Environment tier mapping (Dev · Preview · Production): [`ENVIRONMENTS.md`](ENVIRONMENTS.md).

At the **Review/Approve** gate, three agents stack as defense-in-depth (full setup in
[`AGENT-OPS.md`](AGENT-OPS.md)): **Bugbot**, **Security Reviewer**, **Approval Agent**.
Cloud Agents author + self-verify; a **human owns the PR merge** and the **LaunchDarkly prod
rollout** — not Vercel promote.

## Slash-command spine

```
/start-ticket → build (behind flag) → /open-pr → merge → /release-flag → /ship-ticket
/cloud-ticket → Cloud Agent PR → /open-pr → merge → /release-flag → /ship-ticket
/sentry-incident (or Sentry Automation) → draft PR → human merge → /ship-ticket
                                                      ↘ launchdarkly-flag-cleanup (after rollout)
```

## The Teamwork work-data layer (twg skills)

| Stage | twg skill | What it adds |
|---|---|---|
| Plan / onboarding | `twg-context-discovery` | catch-up on PIG-206 (and the shipped PIG-204 trail), project-to-repo |
| Review | `twg-engineering-work` | review queue behind Bugbot |
| Release | `launchdarkly-flag-targeting` | rollout patterns, safety checklist |
| Observe | `twg-operational-health` | incident → next ticket |
| Report | `twg-status-rollups` | leadership rollup from PIG epic |

## Where the demo scenarios live

- **INJURY A** (off-brand button) — stage 3 (Bugbot): baked into the staged PIG-206 commit,
  caught on push 1 with checks green. (101: pre-applied uncommitted on `main` via `start-101`.)
- **INJURY B** (a11y contrast) — stage 4 (CI + `cursor-agent`): `replay-b` commits it on top
  of the PIG-206 tip mid-room; `fix-ci` self-heals on the same PR.
- **Release beat** (`scheduled-status` on `/campaigns`) — stage 5b: merge ships dark (OFF in
  production); `/release-flag scheduled-status` = validate in LD test on preview, then the human
  prod toggle reveals the Scheduled chip + filter. (`my-first-flag` stays as the demo card only.)
- **Sentry beat** — stage 6→2; Sentry Automation or **`/sentry-incident`**; kill switch via LD flag OFF.

## Honesty / accuracy notes

- Verify Atlassian, Sentry, LaunchDarkly MCP availability day-of at each vendor's docs.
- Cursor touches stages 1–4, 5b documentation, and 6 directly; **prod flag rollout (5b) is a
  human gate in LaunchDarkly**, not an autonomous agent action.
- For Adobe: same *shape* on GitHub Actions + Vercel + LaunchDarkly + Sentry.
