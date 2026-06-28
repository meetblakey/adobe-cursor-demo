# Sentry incident (manual replay — observe → Jira → draft PR)

Run the same flow as the Sentry Automation when the Automation is disabled, for rehearsal, or
when triaging a specific issue manually.

Argument: Sentry issue URL or issue ID (e.g. `https://…sentry.io/issues/…` or `PROJECT-123`).

## Steps

1. Fetch the issue via **Sentry MCP** (`get_issue_details`). Confirm with the user if multiple
   issues match.

2. Follow the full procedure in
   [`.cursor/prompts/sentry-incident-agent.md`](../prompts/sentry-incident-agent.md):
   - Create **new** Jira story in PIG (never reopen Done tickets)
   - Branch `PIG-{newKey}` from latest `main`
   - Minimal fix + `npm run typecheck && npm test && npm run build`
   - Self-verify per [`cloud-agent-self-verify.md`](../prompts/cloud-agent-self-verify.md) if UI changed
   - Open PR targeting `main` (links Sentry + Jira) — **do not merge**

3. `addCommentToJiraIssue` with PR URL on the new story.

4. Hand off: human merge → **`/ship-ticket`**. No LaunchDarkly prod toggle from this flow.

## Demo trigger

To fire a test issue for rehearsal or the 201 LIVE beat:

- Production/preview: visit `/sentry-example-page` and trigger the example error, or
- Call `/api/sentry-example-api?demo=1` (intentional demo throw)

Automation spec: [`docs/SENTRY-AUTOMATION.md`](../../docs/SENTRY-AUTOMATION.md).

Stay scoped to PIG / Pigment.
