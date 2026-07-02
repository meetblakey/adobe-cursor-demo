# Stage the Scheduled PR (201 pre-room setup)

Stage the 201's one ticketed PR: branch **`PIG-206`** cut from clean `main`, carrying the
**Scheduled implementation** (`.demo/scheduled.patch`) **plus the INJURY A drift**
(`.demo/injury-a.patch`) in a single commit — "Priya missed it". Push, open the PR
**ready for review** so Bugbot runs. Tests stay **green** on this push; Bugbot catches the
drift, the presenter fixes it live, then **`replay-b`** lands INJURY B as a follow-up commit.

Reference: [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md) ·
[`docs/DEMO-RUNBOOK.md`](../../docs/DEMO-RUNBOOK.md) (201 section)

## Steps

1. **Preconditions** — clean working tree; no leftover `PIG-206` branch/PR from a previous
   rehearsal (run **`/demo-reset`** first if there is); Jira story **PIG-206** exists with the
   plan comment; LaunchDarkly flag **`scheduled-status`** exists and is **OFF in production**.

2. **Run the script** (it guards all of the above except Jira/LD):
   ```bash
   ./.github/scripts/stage-scheduled-pr.sh
   ```

3. **Verify the staged state:**
   - PR open, base `main`, ready for review (not draft).
   - `check` goes **green** (INJURY A is a design violation, not a test failure).
   - **Bugbot comments** on the raw `bg-pink-500` button (cite `.cursor/BUGBOT.md`'s
     tokens-never-literals standard). If Bugbot hasn't commented in ~5 min, re-check the
     Bugbot install on the repo.

4. **Jira** — move PIG-206 to **In Progress** (`transitionJiraIssue`) and link the PR on the
   story if not already done.

5. **Stop.** The room takes it from here: Bugbot beat → live fix → `replay-b` → red CI →
   `fix-ci` self-heal → human merge → `/release-flag scheduled-status`.

## Notes

- Branch = bare story key (`PIG-206`), the repo convention.
- Re-staging: `/demo-reset` (close PR, delete branch) then re-run — the script refuses to
  stage over leftovers.
- `main` must be Scheduled-free when staging; post-201 revert notes live in
  [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md#post-201-reset).
