# Release a feature flag (post-merge rollout)

Bridge between **merged code** (deployed dark) and **users seeing the feature**. Argument:
optional Jira key (e.g. `PIG-16`) and flag key (e.g. `my-first-flag`).

Prerequisites: PR **merged** to `main`, production deploy complete, flag **OFF** in LaunchDarkly
**production** environment.

1. **Confirm dark ship** — production deploy has the code; LD production flag is OFF. Check
   Vercel production URL and [LaunchDarkly dashboard](https://app.launchdarkly.com/projects/default/flags).

2. **Validate in test** — open the **`launchdarkly-flag-targeting`** skill (`.agents/skills/launchdarkly-flag-targeting/SKILL.md`).
   Toggle the flag **ON** in LaunchDarkly **test** environment only. Verify on the Vercel
   **preview** URL (or local dev with test keys).

3. **Progressive prod rollout** — using LaunchDarkly MCP or dashboard, enable the flag in
   **production** with a controlled rollout (percentage, segment, or full ON). Follow the skill's
   safety checklist. Narrate Enterprise options: guarded rollouts, approval workflows.

4. **Jira comment** — `addCommentToJiraIssue` with flag key, environments toggled, and rollout
   state (e.g. "10% prod", "100% prod").

5. **Hand off** — when prod exposure matches acceptance criteria, run **`/ship-ticket`**. If the
   story is explicitly "dark ship only", document that in the comment and ship without step 3.

6. **After 100% rollout** — schedule **`launchdarkly-flag-cleanup`** (stage 5c) to remove flag
   code in a follow-up PR.

Never toggle production LaunchDarkly flags from preview/local credentials. See
[`docs/ENVIRONMENTS.md`](../../docs/ENVIRONMENTS.md).
