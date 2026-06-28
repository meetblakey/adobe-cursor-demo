# Rehearse INJURY A (Bugbot — full PR loop)

End-to-end rehearsal: branch → apply injury → push → **draft PR** → Bugbot on PR.
**Never merge to `main`.**

Reference: [`docs/INJURIES.md`](../../docs/INJURIES.md) · [`docs/DEMO-INJURIES.md`](../../docs/DEMO-INJURIES.md)

## Steps

1. **Sync** — `./.github/scripts/sync-main-into-branch.sh` if already on a long-lived demo
   branch; otherwise checkout latest `main` and create:
   ```bash
   git fetch origin main
   git checkout main && git pull --ff-only origin main
   git checkout -B demo/injury-a
   ```

2. **Baseline** — `./.github/scripts/demo-injury.sh verify baseline`

3. **Apply** — **`/apply-injury-a`** (or `demo-injury.sh apply a`)

4. **Commit & push** (only when user confirms ship/rehearse):
   ```bash
   git add components/campaigns/campaign-card.tsx
   git commit -m "demo: INJURY A — off-brand Duplicate button (Bugbot rehearsal)"
   git push -u origin demo/injury-a
   ```

5. **Open PR** — target `main`, title e.g. `demo: INJURY A — off-brand Duplicate button`.
   Mark **Ready for review** (not draft) so Bugbot runs. Use **`/open-pr`** flow; skip
   `/review-bugbot` pre-check if intentionally demoing remote Bugbot only.

6. **Wait** — `check` green, **Cursor Bugbot** review comments citing design-system /
   `bg-pink-500`.

7. **After demo** — **Close PR without merging.** Optional: `/reset-injuries` locally.

## Repeat

New branch from `main` or reset file + force-push on `demo/injury-a`.

## Fallback

Keep one open PR with Bugbot comment already posted for timing failures (see runbook).
