# Demo reset — full-stack, back to pre-demo (repo · Jira · LaunchDarkly · Supabase · Vercel)

Returns **every** system the demo mutates to its pre-demo baseline, **idempotently**, and ends with
a **machine-checkable PASS/FAIL matrix**. Safe to re-run and to resume after a partial failure —
**every mutating step is check-first** (read current state → skip if already at target). Confirm
before each outward-facing step. For the file-only reset use **`/reset-injuries`**.

Deterministic repo/git helpers live in [`.github/scripts/demo-reset.sh`](../../.github/scripts/demo-reset.sh);
Jira / LaunchDarkly / Supabase / Vercel are driven here via MCP + scripts. If an MCP isn't connected,
mark that system **SKIPPED (do manually)** — never report it PASS unverified.

## 0 · Preconditions (always first)
```bash
./.github/scripts/demo-reset.sh preflight   # checkout main + fetch + ff-pull + clean-tree warn
```
If it WARNs about uncommitted changes, **stop and commit/stash unrelated work** — step 3 overwrites
the demo files. Every `origin/main` check below assumes this fetch has run.

## 0.5 · Probe — already at baseline? (fast-path, no mutations)
Read all systems; if all already baseline, report clean and **STOP**:
`./.github/scripts/demo-reset.sh verify` **and** Jira PIG-206 == {To Do, unassigned} + no demo
In-Progress + no open `sentry-automation` stories, LD `scheduled-status` OFF + rules-empty in both
envs, Supabase `count(*) where status='scheduled'` == 0. All PASS → *"already pre-demo, nothing to
do."* Otherwise continue; each step self-skips if its target is already met.

## 1 · Kill-switches FIRST (independent of git — de-risk production immediately)
These don't depend on the repo revert, so run them **before** the slow git steps; they must complete
even if a later step stalls.
- **LaunchDarkly** (LD MCP; confirm the production toggle). For `scheduled-status` in project
  `default`, in **both** `test` and `production`: read current value → if already **OFF with no
  rules**, skip; else set the default rule to serve **false/OFF** **and clear targeting** (individual
  targets, %/segment rollout, and any guarded rollout that `/release-flag` created), then **read
  back** and assert OFF + rules empty. Pin **`my-first-flag`** to its baseline (OFF in production)
  and verify. Touch no other flag.
- **Supabase** (Supabase MCP; **DB-backed runs only** — skip entirely if the reveal was seed-backed):
  ```sql
  select id, name, status from public.campaigns where status = 'scheduled';   -- review first
  update public.campaigns set status = 'draft' where status = 'scheduled';     -- idempotent; catches EVERY stray row, not just APJ
  select count(*) from public.campaigns where status = 'scheduled';            -- assert 0
  ```
  The `'scheduled'` **enum value stays** (Postgres can't drop it — additive/harmless). Do **not**
  touch migrations 0006/0007; note the applied migration history intentionally diverges from the
  reverted files.

## 2 · Revert the in-room merge — ONLY if `scheduled` reached `origin/main`
```bash
./.github/scripts/demo-reset.sh scheduled-on-main   # exit 0 = present (revert needed); exit 1 = clean (skip step)
```
If present:
1. **Don't double-revert.** Check first: `gh pr list --state open --search "Revert PIG-206"`. If one's
   open, wait for it — do **not** open a second (two reverts re-apply Scheduled).
2. Find the ship commit (merge-method-agnostic — the ruleset allows merge/squash/rebase) + revert via PR:
   ```bash
   git fetch origin main
   SHA=$(gh pr list --state merged --search 'PIG-206 in:title' --json mergeCommit,mergedAt --jq 'sort_by(.mergedAt)|last|.mergeCommit.oid')
   [ -n "$SHA" ] || SHA=$(git log origin/main --grep='PIG-206' -1 --format=%H)
   if [ "$(git rev-list --parents -n1 "$SHA" | wc -w)" -ge 3 ]; then REV="-m 1 $SHA"; else REV="$SHA"; fi
   git checkout -b revert/PIG-206 origin/main && git revert --no-edit $REV
   git push -u origin revert/PIG-206
   gh pr create --base main --head revert/PIG-206 --title "Revert PIG-206 (post-demo reset)" \
     --body "Undo the in-room Scheduled merge; main back to Scheduled-free."
   ```
3. **WAIT** for the revert PR's `check` to pass → `gh pr merge revert/PIG-206 --merge --delete-branch`
   → `git checkout main && git pull --ff-only origin main`.
4. **Gate:** do **not** run step 3 until `./.github/scripts/demo-reset.sh scheduled-on-main` reports
   **clean**. (`demo-injury.sh reset` restores files from `origin/main`; if scheduled is still there
   it re-installs the feature and `verify baseline` fails.)

## 3 · Repo files (gated on `origin/main` being Scheduled-free)
```bash
if ./.github/scripts/demo-reset.sh scheduled-on-main; then
  echo "STOP: scheduled is still on origin/main — finish the step-2 revert first."
else
  ./.github/scripts/demo-injury.sh reset
  ./.github/scripts/demo-injury.sh verify baseline
  npm test
fi
```

## 4 · Jira → pre-demo (Atlassian MCP; check-first, demo-scoped)
- **PIG-206:** `getJiraIssue PIG-206`. If `status == "To Do"`, **skip** the transition; else
  `getTransitionsForJiraIssue` and pick the transition whose **target** status is *To Do* (not one
  merely named "To Do"); if none is offered, it's already there. If `assignee != null`,
  `editJiraIssue { "assignee": null }` (the @Cursor account is `712020:5fe99cf1-644d-4187-824a-ccf80b69bbf1`).
- **In-Progress — demo-scoped only** (never blanket-wipe the shared board):
  `searchJiraIssuesUsingJql` `project = PIG AND status = "In Progress" AND (key = PIG-206 OR labels in (demo-201, sentry-automation))`
  → transition each to To Do (target-status; skip if none offered).
- **Sentry-spawned stories** (net-new each run) — select by the real label, **list + confirm**, and
  **close (don't delete — preserve history)**:
  `project = PIG AND labels = "sentry-automation" AND statusCategory != Done ORDER BY created DESC`.
- Leave PIG-206's acceptance criteria, plan comment, and Confluence design page intact.

## 5 · Branch + PR cleanup (allow-list, confirm-by-URL, hook-safe, split merged/open)
```bash
gh pr list --state open --json number,title,headRefName,url \
  --jq '.[]|select(.headRefName|test("^(demo/injury-a|demo/injury-b|test/201-e2e|PIG-206)$"))'
```
- Close **only** head branches in that allow-list, one at a time, after confirming the URL:
  `gh pr close <n> --delete-branch --comment "Rehearsal complete — re-staging fresh."` Skip any that
  are already CLOSED/MERGED (a merged PIG-206 **cannot** be closed).
- **Delete leftover remote branches** (incl. a merged PIG-206's) the hook-safe way:
  ```bash
  ./.github/scripts/demo-reset.sh cleanup-branches
  ```
  (`git push origin --delete` is allowed; `git branch -D` is denied, so local refs are only listed —
  delete those via the GitHub UI / a fresh clone.)
- **Sentry-spawned draft PRs** (unknown branch names): `gh pr list --state open --search "[Sentry]"`
  → list + confirm → close.

## 6 · Vercel — re-lock previews (confirm)
The demo ran `disable-preview-sso.sh` (public previews); restore the day-to-day posture:
```bash
./.github/scripts/enable-preview-sso.sh                 # re-lock *.vercel.app behind team SSO
./.github/scripts/enable-preview-protection-bypass.sh   # keep the CI/automation bypass
```
Closed injury-branch preview **deployments** may still serve the magenta button / unreleased Scheduled
feature by URL until they expire — delete them in the Vercel dashboard if they must not be public.

## 7 · Verify — PASS/FAIL matrix, then delete the recovery bookmark
Assert each system with a read-back and print one PASS/FAIL row per system:
- **Repo:** `./.github/scripts/demo-reset.sh verify` → `REPO: PASS`.
- **Jira:** `getJiraIssue PIG-206` == {status: To Do, assignee: null}; demo In-Progress count == 0; no
  open `sentry-automation` stories.
- **LaunchDarkly:** `scheduled-status` OFF **and rules empty** in both envs; `my-first-flag` at baseline.
- **Supabase (DB-backed):** `select count(*) from public.campaigns where status = 'scheduled'` == 0.
- **Vercel:** `vercel project protection` shows SSO enabled.

**Only if every row is PASS**, delete the recovery bookmark last (kept until now so a failed revert
can still be located):
```bash
git tag -d demo/injury-b-broken pre-201 2>/dev/null || true
```
If any row is FAIL, fix it and **re-run** — every step is check-first, so re-running converges.

**Next run:** dispatch the **@Cursor Cloud Agent** on PIG-206 (To Do → In Progress) — or
**`/stage-scheduled-pr`** to fabricate the clean PR as fallback — or `demo-injury.sh start-101` (101).
