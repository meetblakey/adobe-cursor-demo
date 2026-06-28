# Seeded demo injury patches

Committed unified diffs against **`main` baseline** — apply only on demo branches, never on
`main`.

| File | Injury | Target |
|------|--------|--------|
| `injury-a.patch` | A — Bugbot | `components/campaigns/campaign-card.tsx` |
| `injury-b.patch` | B — CI / `cursor-agent` | `components/ui/status-badge.tsx` |

```bash
./.github/scripts/demo-injury.sh apply a   # or b
./.github/scripts/demo-injury.sh reset
```

Full guide: [`docs/DEMO-INJURIES.md`](../docs/DEMO-INJURIES.md) · slash commands:
`/apply-injury-a`, `/apply-injury-b`, `/reset-injuries`, `/rehearse-injury-a`,
`/rehearse-injury-b`, `/demo-reset`.
