# Apply INJURY B (CI — review badge contrast fail)

Apply the seeded **INJURY B** patch on the **current branch** so `npm test` fails the WCAG
gate and CI + `fix-ci` can rehearse. Never run on `main`.

Reference: [`docs/INJURIES.md`](../../docs/INJURIES.md) · [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md)

## Steps

1. **Guard** — If on `main`, stop and ask the user to create/switch to a demo branch
   (e.g. `demo/injury-b`).

2. **Apply patch:**
   ```bash
   ./.github/scripts/demo-injury.sh apply b
   ```

3. **Verify failure** — `npm test` must fail:
   `StatusBadge "review" meets WCAG AA in dark mode`

4. **Confirm patch** — `./.github/scripts/demo-injury.sh verify b`

5. **Do not commit** unless the user asks. For full CI loop, use **`/rehearse-injury-b`**.

## After `fix-ci` fixes the branch (repeat demos)

Tag the injury commit once:
```bash
./.github/scripts/demo-injury.sh tag-broken
```

Before the next run:
```bash
./.github/scripts/demo-injury.sh reset-branch-b
git push --force-with-lease origin demo/injury-b
```

## Undo (local, back to baseline)

```bash
./.github/scripts/demo-injury.sh reset
```
