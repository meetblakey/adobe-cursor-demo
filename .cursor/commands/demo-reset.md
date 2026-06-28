# Demo reset (between rehearsals)

Clean up after an INJURY A/B demo so **`main` stays the green baseline** and you can rehearse
again. Combines file reset + a checklist for PRs/branches.

Reference: [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md)

## Steps

1. **Restore injury files from main baseline:**
   ```bash
   ./.github/scripts/demo-injury.sh reset
   ./.github/scripts/demo-injury.sh verify baseline
   npm test
   ```

2. **List open demo PRs** (user confirms before closing):
   ```bash
   gh pr list --head demo/injury-a --state open
   gh pr list --head demo/injury-b --state open
   ```

3. **Close without merging** — only after user confirms:
   ```bash
   gh pr close <number> --comment "Demo rehearsal complete — not merging injury."
   ```

4. **Optional branch cleanup** (user confirms):
   ```bash
   git checkout main
   git branch -D demo/injury-a demo/injury-b 2>/dev/null || true
   git push origin --delete demo/injury-a demo/injury-b 2>/dev/null || true
   git tag -d demo/injury-b-broken 2>/dev/null || true
   ```

5. **Confirm production** — `main` unchanged; prod alias still clean. Next run:
   **`/rehearse-injury-a`** or **`/rehearse-injury-b`**.

## Notes

- Resetting files does **not** revert Vercel preview deploys on old PR branches — closing PRs
  is enough; prod only tracks `main`.
- Do **not** use `git reset --hard` on `main`.
