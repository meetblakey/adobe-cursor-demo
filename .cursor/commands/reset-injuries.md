# Reset demo injuries (restore main baseline)

Restore the demo-touched files to the clean **`main`** baseline. Safe on any branch.
Scheduled-aware: also restores **`lib/campaigns-seed.ts`** + the badge/filter/view flag gate,
and deletes migrations **0006/0007** from the working tree if the Scheduled diff was applied.
(`lib/campaigns-types.ts` is not touched by any demo patch.)

Does **not** close PRs or delete remote branches — use **`/demo-reset`** for full cleanup.

## Steps

1. Run:
   ```bash
   ./.github/scripts/demo-injury.sh reset
   ```

2. Verify (also checks `'scheduled'` is absent from tokens/seed/migrations):
   ```bash
   ./.github/scripts/demo-injury.sh verify baseline
   npm test
   ```

3. If the user had uncommitted demo work they want to keep, stop and ask before resetting.

Reference: [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md)
