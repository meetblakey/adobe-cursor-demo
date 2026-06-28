# Dashboard setup — Cloud Agents + Sentry Automation

One-time Cursor dashboard configuration for **`/cloud-ticket`** and the Sentry Automation loop.
Repo artifacts are on disk; these steps run in the Cursor UI.

## Prerequisites

- [ ] GitHub repo connected to Cursor
- [ ] **Atlassian MCP** authenticated (Jira **PIG** write)
- [ ] **Sentry MCP** authenticated (project `adobe-cursor-demo` / `sentry-cerulean-flask`)
- [ ] `CURSOR_API_KEY` in GitHub repo secrets (CI `fix-ci` job — separate from Cloud Agents)

## 1. Cloud Agent VM

1. Open [cursor.com/agents](https://cursor.com/agents) → connect **adobe-cursor-demo**.
2. Confirm [`.cursor/environment.json`](../.cursor/environment.json) is picked up:
   - `install`: `npm install`
   - `dev`: `npm run dev`
   - `verify`: `npm run typecheck && npm test && npm run build`
3. Run once manually: wait for install + dev server on port 3000.
4. **Save VM snapshot** (Settings → snapshot after successful boot).
5. **Secrets:** do not add Supabase or LaunchDarkly **production** keys (seed + graceful defaults).
6. **HTTP MCP** (Agents environment settings): enable **atlassian**, **sentry**, **vercel** as needed.

## 2. Sentry Automation

Create in Cursor **Automations** (use `/automate` skill or Automations UI).

| Setting | Value |
|---------|-------|
| Name | `Pigment — Sentry incident → Jira + PR` |
| Trigger | Sentry → **Issue created** |
| Project | `adobe-cursor-demo` |
| Filter (demo) | `error.type:SentryExampleAPIError` |
| Tools | Git, PR comment, MCP: atlassian, MCP: sentry |
| Instructions | Follow [`.cursor/prompts/sentry-incident-agent.md`](../.cursor/prompts/sentry-incident-agent.md) |

**Before saving:** authenticate Atlassian + Sentry MCP in dashboard (not in-editor OAuth).

Full spec: [`SENTRY-AUTOMATION.md`](SENTRY-AUTOMATION.md)

## 3. Rehearsal checklist

- [ ] **`/cloud-ticket PIG-204`** (or similar): agent opens PR with `/campaigns` screenshot
- [ ] Trigger demo error: `/sentry-example-page` or `GET /api/sentry-example-api?demo=1`
- [ ] Automation creates **new** PIG story + draft PR (no merge)
- [ ] Manual replay: **`/sentry-incident`** with Sentry issue URL
- [ ] Record **fallback video** for 201 step 5
- [ ] Confirm INJURY A/B demos still work ([`INJURIES.md`](INJURIES.md))

## Automated validation (repo)

Last run after PIG-205 implementation:

- `npm run typecheck` — pass
- `npm test` — 43 tests pass (including a11y gate)
- `npm run build` — pass
- INJURY files (`campaign-card.tsx`, `status-badge.tsx`) — unchanged on `main` baseline

Manual (you): Cloud Agent rehearsal, Sentry Automation fire, fallback video recording.

## 4. Demo day

- LIVE: Sentry Automation during 201 step 5 (~2–3 min); narrate human merge gate
- Fallback: pre-recorded video if Automation is slow or fails
- Optional: narrate **`/cloud-ticket`** in step 5b

See [`DEMO-RUNBOOK.md`](DEMO-RUNBOOK.md) · [`CLOUD-AGENTS.md`](CLOUD-AGENTS.md) · [`AGENT-OPS.md`](AGENT-OPS.md)
