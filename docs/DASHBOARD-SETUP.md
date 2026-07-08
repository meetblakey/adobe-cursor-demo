# Dashboard setup — Cloud Agents + Sentry Automation

One-time Cursor dashboard configuration for **`/cloud-ticket`** and the Sentry Automation loop.
Repo artifacts are on disk; these steps run in the Cursor UI.

## Prerequisites

- [ ] **Cursor Teams/Enterprise org** connected to GitHub (Cloud Agents + PR creation)
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

## 1a. Jira → Cloud Agent trigger (native, trigger-first)

1. Install the **Cursor-in-Jira** app on the Jira site (GA); it creates the **@Cursor** assignee.
2. Add a no-code **Jira Automation** rule: *when an issue in project **PIG** transitions to
   **In Progress** → assign to **@Cursor***.
3. **Pre-authenticate** the spawned agent's Atlassian access (dashboard MCP) so it doesn't stall
   on `needsAuth`.
4. Rehearse: move **PIG-206** To Do → In Progress → @Cursor is assigned → the Cloud Agent builds
   per [`.cursor/prompts/pig-206-cloud-agent-brief.md`](../.cursor/prompts/pig-206-cloud-agent-brief.md).

## 1b. Bugbot Autofix (Loop 1) — ON, scoped so CI keeps Loop 2

1. Enable **Bugbot** on the repo; set **Autofix Mode ON** — it commits the design-system fix
   (INJURY A: the raw `bg-pink-500` Duplicate button → `<Button variant="ghost">`) directly to
   the PR branch.
2. **Path-exclude** (or set mention-only) `components/ui/status-tokens.ts` so Bugbot does **not**
   autofix the a11y regression (INJURY B) — the CI `fix-ci` job owns **Loop 2**. Sequencing +
   intent are recorded in [`.cursor/BUGBOT.md`](../.cursor/BUGBOT.md).

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

- [ ] **PIG-206 trigger:** move To Do → In Progress → @Cursor builds → PR with light/dark/filtered
      `/campaigns` screenshots (fallback: `./.github/scripts/stage-scheduled-pr.sh`)
- [ ] **Loop 1:** `demo-injury.sh land-a && git push` → **Bugbot Autofix** commits the button fix
      (checks stay green)
- [ ] **Loop 2:** `demo-injury.sh replay-b` → CI red → **`fix-ci`** self-heals on the same PR
- [ ] **`/cloud-ticket <other PIG story>`**: agent opens PR with `/campaigns` screenshot
- [ ] Trigger demo error: `/sentry-example-page` or `GET /api/sentry-example-api?demo=1`
- [ ] Automation creates **new** PIG story + draft PR (no merge)
- [ ] Manual replay: **`/sentry-incident`** with Sentry issue URL
- [ ] Record **fallback video** for 201 step 5
- [ ] Confirm INJURY A/B demos still work ([`INJURIES.md`](INJURIES.md))

## Automated validation (repo)

Last run after PIG-205 implementation:

- `npm run typecheck` — pass
- `npm test` — all tests pass (including a11y gate; 52 on the PIG-206 branch)
- `npm run build` — pass
- INJURY files (`campaign-card.tsx`, `status-tokens.ts`) — unchanged on `main` baseline

Manual (you): Cloud Agent rehearsal, Sentry Automation fire, fallback video recording.

## 4. Demo day

- LIVE: Sentry Automation during 201 step 5 (~2–3 min); narrate human merge gate
- Fallback: pre-recorded video if Automation is slow or fails
- Optional: narrate **`/cloud-ticket`** in step 5b

See [`DEMO-RUNBOOK.md`](DEMO-RUNBOOK.md) · [`CLOUD-AGENTS.md`](CLOUD-AGENTS.md) · [`AGENT-OPS.md`](AGENT-OPS.md)
