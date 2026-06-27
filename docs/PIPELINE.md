# The total pipeline — Cursor across the SDLC (the 201 spine)

The 201 demonstrates the SDLC as a **loop, not a line**: work enters as a Jira ticket, Cursor
touches every stage, and a production signal (Sentry) files the next ticket — closing the
circle. The thesis: *the human is the conductor; Cursor is the agent at every stage; the
platform team's rules/gates make it safe at 100+-engineer scale.*

**Flag-driven shipping:** merge + deploy does **not** mean users see the feature. Code lands on
`main` and deploys **dark**; LaunchDarkly controls exposure per environment. See
[`ENVIRONMENTS.md`](ENVIRONMENTS.md) and [`LAUNCHDARKLY.md`](LAUNCHDARKLY.md).

## The loop

```
        ┌────────────────────────────────────────────────────────────────────────┐
        ▼                                                                        │
1.PLAN  2.CODE    2b.IDE REV  3.REVIEW  4.CI   5.DEPLOY  5b.RELEASE  5c.CLEANUP │ 6.OBSERVE
 Jira→  Cursor→  /review-   PR+      GH     Vercel   LaunchDarkly  flag        Sentry
 ticket  (flag)   bugbot     Bugbot   Actions preview  rollout    removal      (kill switch)
        └──────────────  Sentry → Jira files the next ticket  ──────────────────┘
```

| # | Stage | Tool (demo) | Tool (Adobe, talk-track) | Where Cursor inserts |
|---|---|---|---|---|
| 1 | Plan | **Jira + Confluence** | Jira + Confluence | Atlassian **MCP** pulls the ticket + acceptance criteria; create/link LD flag key in AC for feature work |
| 2 | Code | Cursor editor + **LaunchDarkly SDK** | Cursor editor | Wrap new features behind flags (default **OFF** in LD production); `launchdarkly-flag-create` skill |
| 2b | IDE review | **`/review-bugbot`** (+ **`/review-security`**) | — | Pre-push review — see [`open-pr`](.cursor/commands/open-pr.md) |
| 3 | Review | GitHub PR | GitHub/Bitbucket PR | **Bugbot** + Security + Approval; validate flag wiring on preview |
| 4 | CI | **GitHub Actions** | Jenkins → Spinnaker | **`cursor-agent`** fixes red pipeline (INJURY B); runs without LD/Supabase secrets |
| 5 | Deploy | **Vercel** | Spinnaker → K8s | Preview per PR; **prod auto-deploy on merge** (dark — flag OFF in production) |
| **5b** | **Release** | **LaunchDarkly MCP** + **`/release-flag`** | LD / similar | Human toggles prod rollout after preview validation in LD **test** env |
| **5c** | **Cleanup** | **`launchdarkly-flag-cleanup`** | — | Remove flag code after 100% rollout |
| 6 | Observe | **Sentry** + **LD kill switch** | Datadog + Sentry | Instant rollback via flag OFF; Seer/MCP → fix → new Jira ticket |
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
                                                      ↘ launchdarkly-flag-cleanup (after rollout)
```

## The Teamwork work-data layer (twg skills)

| Stage | twg skill | What it adds |
|---|---|---|
| Plan / onboarding | `twg-context-discovery` | catch-up on PIG-204, project-to-repo |
| Review | `twg-engineering-work` | review queue behind Bugbot |
| Release | `launchdarkly-flag-targeting` | rollout patterns, safety checklist |
| Observe | `twg-operational-health` | incident → next ticket |
| Report | `twg-status-rollups` | leadership rollup from PIG epic |

## Where the demo scenarios live

- **INJURY A** (off-brand button) — stage 2b or 3 (Bugbot).
- **INJURY B** (a11y contrast) — stage 4 (CI + `cursor-agent`).
- **Flag demo** (`my-first-flag` on `/campaigns`) — stage 5b: ON in LD test on preview, OFF in production until `/release-flag`.
- **Sentry beat** — stage 6; kill switch via LD flag OFF.

## Honesty / accuracy notes

- Verify Atlassian, Sentry, LaunchDarkly MCP availability day-of at each vendor's docs.
- Cursor touches stages 1–4, 5b documentation, and 6 directly; **prod flag rollout (5b) is a
  human gate in LaunchDarkly**, not an autonomous agent action.
- For Adobe: same *shape* on GitHub Actions + Vercel + LaunchDarkly + Sentry.
