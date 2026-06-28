# Cloud ticket (parallel VM authoring + self-verify)

Launch a **Cloud Agent** on a Jira story instead of building in the local editor. Use for
UI-heavy, well-scoped product work when you want parallel authoring and browser self-verify
with screenshots in the PR.

Argument: a story key (e.g. `PIG-204`); if none given, pick the top To Do story in epic PIG.

For local editor work, use **`/start-ticket`** instead.

## Steps

0. **Branch + sync with main** — same rules as [`start-ticket`](start-ticket.md):
   `/sync-main` on an existing branch, or branch from latest `main` as `PIG-N`.

1. `getJiraIssue` the story. Read acceptance criteria and the linked Confluence page
   (`getConfluencePage`).

2. Enter Plan mode and produce an editable spec (per `docs/BUILD-PLAN.md`).

3. Post the plan as a Jira comment (`addCommentToJiraIssue`); transition to **In Progress**
   (`getTransitionsForJiraIssue` → `transitionJiraIssue`).

4. **Feature flags:** for product UI stories, create/link a LaunchDarkly flag via
   **`launchdarkly-flag-create`** (default **OFF** in LD production) before the agent codes UI.

5. **Launch Cloud Agent** — IDE Cloud dropdown or [cursor.com/agents](https://cursor.com/agents).
   Paste the story key, plan summary, and instruct the agent to follow:
   [`.cursor/prompts/cloud-agent-self-verify.md`](../prompts/cloud-agent-self-verify.md).

   Dashboard prerequisites: repo connected, VM snapshot saved, HTTP MCP (atlassian) if the
   agent must update Jira — see [`docs/CLOUD-AGENTS.md`](../../docs/CLOUD-AGENTS.md).

6. When the agent opens a PR, **human review** the diff and screenshots. Run **`/open-pr`**
   gates if you need to fix or push follow-ups (`/review-bugbot` before push).

7. After merge: **`/release-flag`** (flag-gated work) → **`/ship-ticket`**.

Stay scoped to PIG / Pigment. Do not launch the Cloud Agent before the plan is posted to Jira.
