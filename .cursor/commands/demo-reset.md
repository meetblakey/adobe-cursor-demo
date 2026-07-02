# Demo reset (between rehearsals)

Clean up after a 101 or 201 run so **`main` stays the green, Scheduled-free baseline** and you
can rehearse again. Combines file reset + a checklist for the PIG-206 PR/branch + flags.
For undoing an in-room **merge** of the Scheduled PR, see **Post-201 reset** in
[`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md#post-201-reset) (revert commit — never
`reset --hard` on `main`).

## Steps

1. **Restore demo files from main baseline** (injuries + Scheduled diff + migrations 0006/0007):
   ```bash
   ./.github/scripts/demo-injury.sh reset
   ./.github/scripts/demo-injury.sh verify baseline
   npm test
   ```

2. **List open demo PRs** (user confirms before closing):
   ```bash
   gh pr list --head PIG-206 --state open
   gh pr list --head demo/injury-a --state open
   gh pr list --head demo/injury-b --state open
   ```

3. **Close without merging** — only after user confirms (an unmerged rehearsal PR is
   disposable; the in-room PIG-206 PR is the one that merges):
   ```bash
   gh pr close <number> --comment "Demo rehearsal complete — re-staging fresh before the room."
   ```

4. **Branch + tag cleanup** (user confirms):
   ```bash
   git checkout main
   git branch -D PIG-206 demo/injury-a demo/injury-b 2>/dev/null || true
   git push origin --delete PIG-206 demo/injury-a demo/injury-b 2>/dev/null || true
   git tag -d demo/injury-b-broken pre-201 2>/dev/null || true
   ```

5. **LaunchDarkly** — confirm `scheduled-status` is **OFF in production** (and back OFF in
   **test** if a rehearsal toggled it): [flag dashboard](https://app.launchdarkly.com/projects/default/flags/scheduled-status).

6. **Confirm production** — `main` unchanged; prod alias still clean;
   `./.github/scripts/demo-injury.sh check-patches` passes on `main`. Next run:
   **`/stage-scheduled-pr`** (201) or `demo-injury.sh start-101` (101).

## Notes

- Resetting files does **not** revert Vercel preview deploys on old PR branches — closing PRs
  is enough; prod only tracks `main`.
- Do **not** use `git reset --hard` on `main`.
- Staging Supabase keeps the `'scheduled'` enum value between rehearsals — Postgres cannot
  drop enum values. That's fine: it's additive and invisible until a row uses it. Only revert
  the 0007 **backfill** (`update public.campaigns set status = 'draft' where name = 'APJ
  Expansion';`) if a rehearsal applied it.
