# Start a ticket (pull → plan → in progress)

Begin work on a Jira story the right way. Argument: a story key (e.g. `PIG-3`); if none given,
pick the top To Do story in epic PIG with `searchJiraIssuesUsingJql`.

0. **Branch + sync with main.** Stay current with team `main` before you build:
   - **New branch** (does not exist locally): fetch latest main, branch from it:
     `git fetch origin main && git checkout main && git pull --ff-only origin main && git checkout -b PIG-N`
   - **Existing branch:** run **`/sync-main`** (or
     `./.github/scripts/sync-main-into-branch.sh PIG-N`) to merge latest `main` into `PIG-N`,
     then continue on `PIG-N`.
   Never commit on `main` — `main` only receives merges via PR (enforced by GitHub ruleset +
   `guard-shell.sh`).

1. `getJiraIssue` the story. Read its acceptance criteria and open the linked Confluence page
   (`getConfluencePage`) for the design context.
2. Enter Plan mode and produce an editable spec for this phase (per `docs/BUILD-PLAN.md`).
3. Post the plan back as a comment with `addCommentToJiraIssue`.
4. `getTransitionsForJiraIssue` → `transitionJiraIssue` to **In Progress**.
5. Summarise: the story, the plan, and the files you're about to touch. Then build.

**Feature work (product stories like PIG-204):** before coding UI, create or link a LaunchDarkly
flag via the **`launchdarkly-flag-create`** skill (`.agents/skills/launchdarkly-flag-create/SKILL.md`).
Acceptance criteria should include the flag key and **default OFF in LD production**. Wrap the
feature behind the flag in code.

When implementation is complete, hand off to **`/open-pr`** — do not push or open a PR without
**`/review-bugbot`** first. After merge, run **`/release-flag`** for flag-gated features before
**`/ship-ticket`**.

Do not write code before the story is pulled and the plan is posted. Stay scoped to PIG.
