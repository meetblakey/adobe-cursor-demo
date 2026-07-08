# Cloud ticket — the primary path for ticketed features (trigger-first + self-verify)

Launch a **Cloud Agent** on a Jira story: it builds in a VM, self-verifies in a browser with
screenshots in the PR, and opens the PR against `main` — **it never merges**. This is the
**primary** build path for scoped product features (e.g. PIG-206); use the editor
(**`/start-ticket`**) for pair-programming, platform/design-system internals, migrations, or small
INJURY demos.

Argument: a story key (e.g. `PIG-206`); if none given, pick the top To Do story in epic PIG.

## Trigger-first (the native path)

Moving a PIG story **To Do → In Progress** in Jira fires a no-code **Automation** rule (via the
**Cursor-in-Jira** app) that assigns it to **@Cursor** and dispatches the Cloud Agent — no slash
command needed. `/cloud-ticket` is the IDE/dashboard equivalent when you want to launch it by hand.

## Steps

0. **Branch + sync with main** — same rules as [`start-ticket`](start-ticket.md):
   `/sync-main` on an existing branch, or branch from latest `main` as `PIG-N`.

1. `getJiraIssue` the story. Read acceptance criteria and the linked Confluence page
   (`getConfluencePage`).

2. Post/confirm the build plan as a Jira comment (`addCommentToJiraIssue`); the story moves to
   **In Progress** (the trigger). For PIG-206 the brief is
   [`.cursor/prompts/pig-206-cloud-agent-brief.md`](../prompts/pig-206-cloud-agent-brief.md).

3. **Feature flags:** for product UI stories, create/link a LaunchDarkly flag via
   **`launchdarkly-flag-create`** (default **OFF** in LD production) before the agent codes UI.

4. **Cloud Agent runs** — dispatched by the Jira trigger, or launched from the IDE Cloud dropdown /
   [cursor.com/agents](https://cursor.com/agents). It follows
   [`.cursor/prompts/cloud-agent-self-verify.md`](../prompts/cloud-agent-self-verify.md).

   Dashboard prerequisites: Teams/Enterprise org, repo connected, VM snapshot saved, Cursor-in-Jira
   app + Automation rule, HTTP MCP (atlassian) — see [`docs/CLOUD-AGENTS.md`](../../docs/CLOUD-AGENTS.md)
   and [`docs/DASHBOARD-SETUP.md`](../../docs/DASHBOARD-SETUP.md).

5. When the agent opens a PR, **human review** the diff and screenshots. The governance loops run
   on it: **Bugbot Autofix** (Loop 1) and **`fix-ci`** (Loop 2). Run **`/open-pr`** gates if you
   push follow-ups (`/review-bugbot` before push).

6. After merge: **`/release-flag`** (flag-gated work) → **`/ship-ticket`**.

Stay scoped to PIG / Pigment. **No agent merges or deploys** — human owns merge + release.
