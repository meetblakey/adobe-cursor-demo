# Cloud Agents — parallel authoring + VM self-verify

Cloud Agents run in Cursor's cloud VM on their own branch: implement → test → **self-verify in a
browser** → open a merge-ready PR. The same runtime powers headless **`cursor-agent`** in CI
([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)).

Use Cloud Agents as an **optional parallel path** alongside the editor (`/start-ticket`). They
do not replace Bugbot or the CI `fix-ci` job.

## When to use which path

| Use `/start-ticket` (editor) | Use `/cloud-ticket` (Cloud Agent) |
|------------------------------|-----------------------------------|
| Platform / design-system changes (`components/ui`, tokens) | Product UI on `/campaigns` |
| Tight pair-programming with the human | Parallel work while reviewing another PR |
| Small fixes, INJURY demos | PIG-204-style scoped features with visual proof |
| Auth, migrations, CI changes | Flag-gated UI behind LaunchDarkly (test env only) |

## Repo configuration

| File | Purpose |
|------|---------|
| [`.cursor/environment.json`](../.cursor/environment.json) | `install`, `dev` server (port 3000), `verify` gates |
| [`.cursor/prompts/cloud-agent-self-verify.md`](../.cursor/prompts/cloud-agent-self-verify.md) | Required checklist before PR |
| [`.cursor/commands/cloud-ticket.md`](../.cursor/commands/cloud-ticket.md) | Slash command workflow |

## Dashboard setup (one-time)

1. **[cursor.com/agents](https://cursor.com/agents)** — connect the `adobe-cursor-demo` GitHub repo.
2. **VM snapshot** — after first successful `npm install` + `npm run dev`, save a snapshot (fastest
   boot and most reliable self-verify).
3. **Secrets** — match CI: no Supabase or LaunchDarkly **production** keys in the Cloud Agent
   environment. Seed data + LD graceful defaults are enough ([`ENVIRONMENTS.md`](ENVIRONMENTS.md)).
4. **HTTP MCP** (dashboard, proxied server-side): wire **atlassian** (Jira comments on agent PRs),
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
/cloud-ticket → Cloud Agent PR → human review → /open-pr gates → merge → /release-flag → /ship-ticket
```

Governance hooks ([`guard-shell.sh`](../.cursor/hooks/guard-shell.sh)) apply in the VM the same
as in the editor.

See also: [`AGENT-OPS.md`](AGENT-OPS.md) · [`PIPELINE.md`](PIPELINE.md) · [`SENTRY-AUTOMATION.md`](SENTRY-AUTOMATION.md)
