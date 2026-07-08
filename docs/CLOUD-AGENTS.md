# Cloud Agents — the primary 201 build path (trigger-first + VM self-verify)

Cloud Agents run in Cursor's cloud VM on their own branch: implement → test → **self-verify in a
browser** → open a merge-ready PR. In the 201 they are the **primary build path** — a Jira ticket
dispatches the agent, and the PR it opens carries the whole outer loop. The same runtime powers
headless **`cursor-agent`** in CI ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)).

> Beta note: the Cloud Agents API is **public beta**; the Cursor-in-Jira app is **GA**; Approval
> / Security agents are **Teams/Enterprise beta**. Verify the exact execution boundary day-of.

## Trigger-first: the ticket dispatches the agent

1. **PIG-206** sits in Jira **To Do** with acceptance criteria + a linked Confluence design page.
2. Move it **To Do → In Progress**. A no-code **Jira Automation** rule (via the **Cursor-in-Jira**
   app) assigns it to **@Cursor**.
3. The Cloud Agent picks up the story, builds it per its brief
   ([`.cursor/prompts/pig-206-cloud-agent-brief.md`](../.cursor/prompts/pig-206-cloud-agent-brief.md)),
   self-verifies, and opens the PR against `main` — it **never merges** (human owns merge +
   release; Vercel auto-deploys on merge, dark).

`/cloud-ticket` generalizes the same path to any PIG story from the IDE/dashboard.
`stage-scheduled-pr.sh` **fabricates** PIG-206's clean PR as the timing fallback when a live
dispatch isn't ready (build + autofix take ~10–15 min each).

## The two governance loops ride the agent's PR

- **Loop 1 — Bugbot Autofix (review).** A design-system violation rides onto the PR
  (`demo-injury.sh land-a` — the raw `bg-pink-500` Duplicate button, standing in for the drift
  that ships at scale, **not** authored by the agent). With **Autofix ON**, Bugbot reviews against
  [`.cursor/BUGBOT.md`](../.cursor/BUGBOT.md) and **commits the fix** (`<Button variant="ghost">`).
- **Loop 2 — headless `fix-ci` (CI).** *After* Loop 1 lands, `demo-injury.sh replay-b` commits an
  a11y contrast regression (`review.dark.fg` → `#6A4A1E`); CI goes red and the **`fix-ci`** job
  (`cursor-agent -p --force`) self-heals on the same PR (restores baseline `#E0A24E`). Bugbot is
  **scoped off** `components/ui/status-tokens.ts` so CI, not review, owns this fix — the two
  fixers stay distinct.

Cloud Agents do not replace these gates; their PRs pass through them like any other. That is the
governance point: **every PR, including an agent's, clears the same gate.**

## When to use which path

| Cloud Agent — `/cloud-ticket` (primary for ticketed features) | Editor — `/start-ticket` |
|---|---|
| **PIG-206-style scoped features** with visual proof | Tight pair-programming with the human |
| Product UI on `/campaigns` | Platform / design-system internals (`components/ui`, tokens) |
| Parallel work while reviewing another PR | Auth, migrations, CI changes, small INJURY demos |
| Flag-gated UI behind LaunchDarkly (test env only) | 101 live-build cold open |

## Repo configuration

| File | Purpose |
|------|---------|
| [`.cursor/environment.json`](../.cursor/environment.json) | `install`, `dev` server (port 3000), `verify` gates |
| [`.cursor/prompts/cloud-agent-self-verify.md`](../.cursor/prompts/cloud-agent-self-verify.md) | Required checklist before PR |
| [`.cursor/prompts/pig-206-cloud-agent-brief.md`](../.cursor/prompts/pig-206-cloud-agent-brief.md) | The exact brief @Cursor gets for PIG-206 |
| [`.cursor/commands/cloud-ticket.md`](../.cursor/commands/cloud-ticket.md) | Slash command workflow |

## Dashboard setup (one-time)

1. **Cursor Teams/Enterprise org** connected to GitHub (Cloud Agents + PR creation) and to the
   `adobe-cursor-demo` repo at **[cursor.com/agents](https://cursor.com/agents)**.
2. **Cursor-in-Jira app** installed on the Jira site; **@Cursor** assignee created; a no-code
   **Jira Automation** rule — *when a PIG issue → In Progress, assign @Cursor*. Pre-authenticate
   the agent's Atlassian so it doesn't stall on `needsAuth`.
3. **Bugbot Autofix ON** (Cursor dashboard), **path-excluding** (or mention-only)
   `components/ui/status-tokens.ts` so Loop 2 stays with CI. See [`DASHBOARD-SETUP.md`](DASHBOARD-SETUP.md).
4. **VM snapshot** — after first successful `npm install` + `npm run dev`, save a snapshot.
5. **Secrets** — match CI: no Supabase or LaunchDarkly **production** keys in the Cloud Agent
   environment. Seed data + LD graceful defaults are enough ([`ENVIRONMENTS.md`](ENVIRONMENTS.md)).
6. **HTTP MCP** (dashboard, proxied server-side): wire **atlassian** (Jira comments on agent PRs),
   **sentry**, **vercel** as needed. Local stdio entries in [`.cursor/mcp.json`](../.cursor/mcp.json)
   apply to the editor only; Cloud Agents use dashboard MCP config.

## Self-verify contract

Before opening a PR, the agent must:

1. Pass `npm run typecheck && npm test && npm run build`
2. Open `http://localhost:3000/campaigns` and capture screenshot(s) when UI changed
3. Attach screenshots to the PR description
4. Open PR targeting `main` — **never merge**

Full checklist: [`.cursor/prompts/cloud-agent-self-verify.md`](../.cursor/prompts/cloud-agent-self-verify.md).

## Handoff to the rest of the loop

```
Jira To Do → In Progress (assign @Cursor) → Cloud Agent PR
  → Loop 1 Bugbot Autofix → Loop 2 fix-ci → human review → merge → /release-flag → /ship-ticket
```

Governance hooks ([`guard-shell.sh`](../.cursor/hooks/guard-shell.sh)) apply in the VM the same
as in the editor.

See also: [`AGENT-OPS.md`](AGENT-OPS.md) · [`PIPELINE.md`](PIPELINE.md) · [`SENTRY-AUTOMATION.md`](SENTRY-AUTOMATION.md)
