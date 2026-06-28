# Apply INJURY A (Bugbot — off-brand Duplicate button)

Apply the seeded **INJURY A** patch on the **current branch** for Bugbot / PR rehearsal.
Never run on `main`.

Reference: [`docs/INJURIES.md`](../../docs/INJURIES.md) · [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md)

## Steps

1. **Guard** — If on `main`, stop and ask the user to create/switch to a demo branch
   (e.g. `demo/injury-a`).

2. **Apply patch:**
   ```bash
   ./.github/scripts/demo-injury.sh apply a
   ```

3. **Verify** — `npm test` should stay **green**. Optionally `npm run dev` → `/campaigns`
   grid view shows magenta Duplicate buttons.

4. **Confirm** — `./.github/scripts/demo-injury.sh verify a`

5. **Do not commit** unless the user asks. For rehearsal end-to-end, use **`/rehearse-injury-a`**
   or commit with message `demo: apply INJURY A` then push + open PR.

## Undo (local)

```bash
./.github/scripts/demo-injury.sh reset
```
