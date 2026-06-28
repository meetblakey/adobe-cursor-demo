# Rehearse INJURY B (CI — fix-ci + cursor-agent loop)

End-to-end rehearsal: branch → apply injury → push → PR → **red `check`** → **`fix-ci`**
→ agent commit + PR comment. **Never merge to `main`.**

Reference: [`docs/INJURIES.md`](../../docs/INJURIES.md) · [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md)

## Steps

1. **Sync / branch** — same as **`/rehearse-injury-a`**, but branch name `demo/injury-b`:
   ```bash
   git fetch origin main
   git checkout main && git pull --ff-only origin main
   git checkout -B demo/injury-b
   ```

2. **Baseline** — `./.github/scripts/demo-injury.sh verify baseline`

3. **Apply** — **`/apply-injury-b`** — confirm `npm test` fails the review/dark a11y test.

4. **Commit & push** (when user confirms):
   ```bash
   git add components/ui/status-tokens.ts
   git commit -m "demo: INJURY B — review badge contrast fail (CI rehearsal)"
   git push -u origin demo/injury-b
   ./.github/scripts/demo-injury.sh tag-broken
   ```

5. **Open PR** — target `main`. `check` must **fail**; then **`fix-ci`** must run (not
   skipped). Requires `CURSOR_API_KEY` repo secret.

6. **Room beat** — Dark mode on preview `/campaigns` → bad “In review” chips; then narrate
   agent fix on the PR.

7. **After demo** — Close PR without merging, or keep branch for replay.

## Replay on same branch (after fix-ci green)

```bash
git checkout demo/injury-b
./.github/scripts/demo-injury.sh reset-branch-b
git push --force-with-lease origin demo/injury-b
```

Re-opens red CI on the existing PR (or push triggers new run).

## Editor-only fallback

If CI timing fails, apply injury locally and run **`/fix-ci`** (same procedure as the agent).
