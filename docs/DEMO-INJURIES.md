# Demo injuries — apply, rehearse, reset

Repeatable **INJURY A** (Bugbot) and **INJURY B** (`cursor-agent` in CI) without ever
breaking `main` or production. Full scenario copy + prompts: [`INJURIES.md`](INJURIES.md).

## Golden rules

1. **Never apply injuries on `main`.** Production only updates when `main` merges.
2. **Never merge injury PRs.** Close after the demo; reset the branch for the next run.
3. **Patches live in [`.demo/`](../.demo/)** — committed as files, applied only on demo branches.

## Quick reference

| Goal | Command | Script |
|------|---------|--------|
| Apply Bugbot injury | **`/apply-injury-a`** | `./.github/scripts/demo-injury.sh apply a` |
| Apply CI injury | **`/apply-injury-b`** | `./.github/scripts/demo-injury.sh apply b` |
| Restore clean files | **`/reset-injuries`** | `./.github/scripts/demo-injury.sh reset` |
| Full rehearsal A | **`/rehearse-injury-a`** | — |
| Full rehearsal B | **`/rehearse-injury-b`** | — |
| Cleanup between demos | **`/demo-reset`** | — |

## How it works

### Patches (`.demo/injury-a.patch`, `.demo/injury-b.patch`)

Unified diffs against the **clean baseline** on `main`:

- **A** — `campaign-card.tsx`: `Button` → raw `<button className="bg-pink-500 …">` (abandons the
  Spectrum component — see [`INJURIES.md`](INJURIES.md))
- **B** — `status-tokens.ts`: `review.dark.fg` `#E0A24E` → `#6A4A1E` (fails WCAG test on the
  legacy flag-OFF path; Spectrum semantic variants make it structurally impossible)

Apply with `git apply` (via script or agent). Reverse-check with
`demo-injury.sh verify a|b`.

### INJURY A — Bugbot loop

```
main (clean) → branch demo/injury-a → apply A → push → PR (ready, not draft)
→ Bugbot comments → discuss fix → close PR (do not merge)
```

- Preview deploy shows magenta Duplicate buttons on `/campaigns`.
- `npm test` stays **green** (visual/design violation only).
- **Repeat:** new branch from `main`, or `/reset-injuries` + re-apply on same branch.

**Fallback:** keep one open PR with Bugbot comment already posted (see runbook).

### INJURY B — CI + `fix-ci` loop

```
main (clean) → branch demo/injury-b → apply B → push → PR
→ check fails → fix-ci runs → cursor-agent commits fix → PR green
```

- Dark mode on `/campaigns` shows unreadable “In review” chips before the fix.
- After `fix-ci`, the **PR branch contains the fix** — not the injury.

**Repeat INJURY B** on the same branch:

1. After first successful apply + push, run:
   ```bash
   ./.github/scripts/demo-injury.sh tag-broken
   ```
   (tags `demo/injury-b-broken` at the injury commit)

2. After the agent fixes CI, before the next demo:
   ```bash
   ./.github/scripts/demo-injury.sh reset-branch-b
   git push --force-with-lease origin demo/injury-b
   ```
   CI goes red again; `fix-ci` can run again.

Or delete `demo/injury-b` and run **`/rehearse-injury-b`** fresh from `main`.

### Reset injuries (local files only)

```bash
./.github/scripts/demo-injury.sh reset
# or
git checkout main -- components/campaigns/campaign-card.tsx components/ui/status-tokens.ts
```

Restores both files from `main` (or `origin/main`). Does **not** close PRs or delete branches —
use **`/demo-reset`** for the full cleanup checklist.

### Verify state

```bash
./.github/scripts/demo-injury.sh verify baseline   # matches main — safe
./.github/scripts/demo-injury.sh verify a          # INJURY A applied
./.github/scripts/demo-injury.sh verify b          # INJURY B applied
```

## Suggested branch names

| Injury | Branch | PR title hint |
|--------|--------|----------------|
| A | `demo/injury-a` | `demo: INJURY A — off-brand Duplicate button` |
| B | `demo/injury-b` | `demo: INJURY B — review badge contrast` |

## Multiple demos in one day

| Surface | Fastest reset |
|---------|----------------|
| **A** | Close PR → `/reset-injuries` → re-apply A → push (or new branch) |
| **B** | `reset-branch-b` + force-push, or new branch from `main` |
| **Both** | `/demo-reset` checklist → `/rehearse-injury-a` or `-b` |

## Related

- [`INJURIES.md`](INJURIES.md) — diffs, room script, exact prompts
- [`DEMO-RUNBOOK.md`](DEMO-RUNBOOK.md) — 101/201 show flow
- [`.cursor/commands/`](../.cursor/commands/) — slash commands below
- [`/fix-ci`](../.cursor/commands/fix-ci.md) — editor replay of INJURY B fix
