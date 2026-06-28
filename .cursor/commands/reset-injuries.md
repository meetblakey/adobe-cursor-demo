# Reset demo injuries (restore main baseline)

Restore **`components/campaigns/campaign-card.tsx`** and **`components/ui/status-tokens.ts`**
to the clean **`main`** baseline. Safe on any branch.

Does **not** close PRs or delete remote branches — use **`/demo-reset`** for full cleanup.

## Steps

1. Run:
   ```bash
   ./.github/scripts/demo-injury.sh reset
   ```

2. Verify:
   ```bash
   ./.github/scripts/demo-injury.sh verify baseline
   npm test
   ```

3. If the user had uncommitted demo work they want to keep, stop and ask before resetting.

Reference: [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md)
