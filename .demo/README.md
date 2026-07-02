# Seeded demo patches

Committed unified diffs against **`main` baseline** — apply only on demo branches / the
uncommitted 101 start state, never committed on `main`.

| File | Purpose | Target |
|------|---------|--------|
| `scheduled.patch` | The full Scheduled implementation (tokens + `SPECTRUM_STATUS: 'info'`, seed flip, migrations 0006/0007, `scheduled-status` flag gate) — what the 101 Agent prompt produces, staged as the 201's PIG-206 PR | tokens, seed, badge/filter/view, migrations |
| `injury-a.patch` | A — Bugbot (raw magenta `<button>`) | `components/campaigns/campaign-card.tsx` |
| `injury-b.patch` | B — CI / `cursor-agent` (`review.dark.fg` → `#6A4A1E`) | `components/ui/status-tokens.ts` |

```bash
./.github/scripts/demo-injury.sh start-101       # 101 start state: A on main, uncommitted
./.github/scripts/stage-scheduled-pr.sh          # 201: PIG-206 PR = scheduled + injury A
./.github/scripts/demo-injury.sh replay-b        # 201 mid-room: commit B on top of HEAD
./.github/scripts/demo-injury.sh reset           # restore baseline (scheduled-aware)
```

**Drift gate:** `injury-b.patch` is cut with minimal context (`-U1`) so it applies both on
clean `main` and on top of `scheduled.patch`. CI runs
`demo-injury.sh check-patches` on every push to `main` — if a patch stops applying,
regenerate all three against `main` and re-verify the stack
(`scheduled` → `injury-a` → `injury-b`).

Full guide: [`docs/DEMO-INJURIES.md`](../docs/DEMO-INJURIES.md) · slash commands:
`/stage-scheduled-pr`, `/apply-injury-a`, `/apply-injury-b`, `/reset-injuries`,
`/rehearse-injury-a`, `/rehearse-injury-b`, `/demo-reset`.
