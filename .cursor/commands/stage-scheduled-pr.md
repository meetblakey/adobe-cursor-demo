# Stage the Scheduled PR — Cloud Agent fallback (201 pre-room setup)

**Fallback** for the 201 Cloud-Agent spine. The **primary** path is a native @Cursor Cloud Agent
building PIG-206 (Jira To Do → In Progress → assign @Cursor → PR). Use this only when a live
dispatch isn't ready: it **fabricates the Cloud Agent's clean PR** — branch **`PIG-206`** cut from
clean `main` carrying the **Scheduled implementation** (`.demo/scheduled.patch`) in one commit,
review token left at baseline `#E0A24E`. Push, open the PR **ready for review**. The INJURY A
drift is **not** baked here — it rides the PR next via **`land-a`** (Loop 1).

Reference: [`docs/CLOUD-AGENTS.md`](../../docs/CLOUD-AGENTS.md) ·
[`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md) ·
[`docs/DEMO-RUNBOOK.md`](../../docs/DEMO-RUNBOOK.md) (201 section)

## Steps

1. **Preconditions** — clean working tree; no leftover `PIG-206` branch/PR from a previous
   rehearsal (run **`/demo-reset`** first if there is); Jira story **PIG-206** exists with the
   plan comment; LaunchDarkly flag **`scheduled-status`** exists and is **OFF in production**.

2. **Run the script** (fabricates the clean PR; guards all of the above except Jira/LD):
   ```bash
   ./.github/scripts/stage-scheduled-pr.sh
   ```

3. **Land the Loop 1 drift on the PR:**
   ```bash
   git checkout PIG-206 && ./.github/scripts/demo-injury.sh land-a && git push
   ```
   - `check` stays **green** (INJURY A is a design violation, not a test failure).
   - **Bugbot Autofix** commits the `<Button variant="ghost">` fix on the raw `bg-pink-500`
     button (cite `.cursor/BUGBOT.md`). If nothing lands in ~10–15 min, re-check the Bugbot
     install + **Autofix** setting on the repo.

4. **Jira** — PIG-206 stays in **To Do** for the live trigger beat (moving it → In Progress is the
   demo action that would dispatch the real agent); link the PR on the story.

5. **Stop.** The room takes it from here: Loop 1 (Bugbot Autofix) → `replay-b` → red CI →
   `fix-ci` self-heal (Loop 2) → human merge → `/release-flag scheduled-status`.

## Notes

- Branch = bare story key (`PIG-206`), the repo convention.
- Re-staging: `/demo-reset` (close PR, delete branch) then re-run — the script refuses to
  stage over leftovers.
- `main` must be Scheduled-free when staging; post-201 revert notes live in
  [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md#post-201-reset).
