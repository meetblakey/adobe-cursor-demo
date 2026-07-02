# Demo injuries — stage, rehearse, reset

Repeatable demo state for the 101 (opens broken, heals in-editor) and the 201 (one ticketed
PR runs the outer loop: **Bugbot** → **`fix-ci`** → merge → flag release) without ever leaving
`main` or production dirty. Full scenario copy + prompts: [`INJURIES.md`](INJURIES.md).

## Golden rules

1. **Never *commit* injuries on `main`.** The 101 start state applies INJURY A to the working
   tree on `main` **uncommitted** (`start-101`) — that's the only sanctioned injury on `main`,
   and `reset` removes it. Production only updates when `main` merges.
2. **The PIG-206 PR is the one injury-carrying branch that merges** — in-room, after both
   injuries have been fixed *on the branch* by the gates. Revert the merge on `main` afterwards
   ([post-201 reset](#post-201-reset)). Standalone `demo/injury-*` rehearsal PRs are **closed,
   never merged**.
3. **Mid-room, the branch tip NEVER moves backwards.** After the live INJURY A fix is pushed,
   a `reset-branch-b` + force-push would wipe that fix from the PR — and merging would ship
   the magenta button to production. Mid-room you only add state forward: **`replay-b`**
   commits INJURY B on top of HEAD. `tag-broken` / `reset-branch-b` are for **between-rehearsal**
   resets only.
4. **Patches live in [`.demo/`](../.demo/)** — committed as files; `main` must stay
   Scheduled-free (`check-patches` enforces that they always apply on `main`).

## Quick reference

| Goal | Command | Script |
|------|---------|--------|
| 101 start state (A on `main`, uncommitted) | — | `./.github/scripts/demo-injury.sh start-101` |
| Stage the 201 PR (PIG-206 = scheduled + A) | **`/stage-scheduled-pr`** | `./.github/scripts/stage-scheduled-pr.sh` |
| Mid-room INJURY B (commit on top of HEAD) | — | `./.github/scripts/demo-injury.sh replay-b` |
| Apply Bugbot injury (branch only) | **`/apply-injury-a`** | `demo-injury.sh apply a` |
| Apply CI injury (branch only) | **`/apply-injury-b`** | `demo-injury.sh apply b` |
| Restore clean files (scheduled-aware) | **`/reset-injuries`** | `demo-injury.sh reset` |
| Patch drift gate (run on clean `main`) | — | `demo-injury.sh check-patches` |
| Standalone rehearsal A / B | **`/rehearse-injury-a`** / **`-b`** | — |
| Cleanup between demos | **`/demo-reset`** | — |

## How it works

### Patches (`.demo/scheduled.patch`, `.demo/injury-a.patch`, `.demo/injury-b.patch`)

Unified diffs against the **clean baseline** on `main`:

- **scheduled** — the full Scheduled implementation: `STATUS_TOKENS` entry + `SPECTRUM_STATUS:
  'info'`, seed flip (APJ Expansion → scheduled), migrations 0006/0007, and the
  `scheduled-status` flag gate (badge presentation + filter entry). This is the diff the 101
  Agent prompt produces — rehearsal == live.
- **A** — `campaign-card.tsx`: `Button` → raw `<button className="bg-pink-500 …">` (abandons the
  Spectrum component — see [`INJURIES.md`](INJURIES.md))
- **B** — `status-tokens.ts`: `review.dark.fg` `#E0A24E` → `#6A4A1E` (fails the WCAG gate in CI;
  the rendered Spectrum chip stays fine — the drift is CI-visible, not room-visible). Cut with
  minimal context (`-U1`) so it applies on clean `main` **and** on top of `scheduled.patch`.

Apply with `git apply` (via script or agent). Reverse-check with `demo-injury.sh verify a|b`.
**Drift gate:** CI runs `demo-injury.sh check-patches` on every push to `main`; if a patch
stops applying, regenerate all three against `main` and re-verify the stack
(`scheduled` → `injury-a` → `injury-b`).

### The 201 loop (the staged PIG-206 PR)

```
main (clean, Scheduled-free)
  → /stage-scheduled-pr: branch PIG-206 = scheduled.patch + injury-a.patch, one commit
  → push → PR (ready, not draft) → check GREEN → Bugbot comments on the drift
  → [room] live fix (Cmd-K) → commit + push → still green
  → [room] demo-injury.sh replay-b → push → check RED
  → fix-ci runs cursor-agent → commits fix to the SAME PR + comments → green
  → [room] human merges → prod deploys DARK (scheduled-status OFF)
  → /release-flag scheduled-status → chip + filter appear
  → [after] post-201 reset (below)
```

- Push 1 must stay **green** — INJURY A is a design violation, not a test failure; Bugbot is
  the gate that fires.
- `replay-b` refuses to run if the working tree is dirty or the patch no longer applies (e.g.
  `fix-ci` already rewrote the token on this branch).

### INJURY A — standalone Bugbot rehearsal (optional, outside the 201)

```
main (clean) → branch demo/injury-a → apply a → push → PR (ready, not draft)
→ Bugbot comments → discuss fix → close PR (do not merge)
```

- Preview deploy shows magenta Duplicate buttons on `/campaigns`; `npm test` stays green.
- **Repeat:** new branch from `main`, or `/reset-injuries` + re-apply on the same branch.

### INJURY B — standalone CI rehearsal (optional, outside the 201)

```
main (clean) → branch demo/injury-b → apply b → push → PR
→ check fails → fix-ci runs → cursor-agent commits fix → PR green
```

**Repeat on the same branch (BETWEEN rehearsals only):**

1. After the injury commit is pushed: `./.github/scripts/demo-injury.sh tag-broken`
   (tags `demo/injury-b-broken`).
2. After the agent fixes CI, before the next rehearsal:
   ```bash
   ./.github/scripts/demo-injury.sh reset-branch-b   # moves the tip BACKWARDS — never mid-room
   git push --force-with-lease origin demo/injury-b
   ```
Or delete `demo/injury-b` and run **`/rehearse-injury-b`** fresh from `main`.

### Reset local files (scheduled-aware)

```bash
./.github/scripts/demo-injury.sh reset
```

Restores `campaign-card.tsx`, `status-tokens.ts`, `campaigns-seed.ts`, and the
badge/filter/view flag gate from `main` (or `origin/main`), and deletes migrations
`0006`/`0007` from the working tree. (`lib/campaigns-types.ts` is untouched by every demo
patch.) Does **not** close PRs or delete branches — use **`/demo-reset`** for the checklist.

### Verify state

```bash
./.github/scripts/demo-injury.sh verify baseline   # matches main + 'scheduled' absent — safe
./.github/scripts/demo-injury.sh verify a          # INJURY A applied
./.github/scripts/demo-injury.sh verify b          # INJURY B applied
./.github/scripts/demo-injury.sh check-patches     # all .demo patches apply (clean main only)
```

## Post-201 reset

The 201 merge is real — `main` briefly carries the Scheduled feature. Undo it honestly:

1. **Before** the session/rehearsal: `git tag pre-201 origin/main` (a bookmark, not a reset
   target).
2. **Revert the merge** on `main` with a revert commit — via a small PR, or
   `git revert -m 1 <merge-sha>` pushed through the normal flow. **Never `git reset --hard`
   on `main`** — prod tracks it and history must stay append-only.
3. **LaunchDarkly:** `scheduled-status` OFF in **both** envs (test + production).
4. **Staging Supabase:** revert the backfill only —
   `update public.campaigns set status = 'draft' where name = 'APJ Expansion';`
   Postgres **cannot drop enum values**, so `'scheduled'` stays in the staging enum between
   rehearsals — that's acceptable and additive (invisible until a row uses it). Production
   Supabase only ever gets the migrations when you deliberately run them post-merge; skip that
   during rehearsals.
5. Confirm: `demo-injury.sh verify baseline` on `main` + `check-patches` green + the
   `pre-201` tag deleted (`git tag -d pre-201`) once verified.

## Branch names

| Work | Branch | PR title |
|------|--------|----------|
| The 201 ticketed PR | `PIG-206` (bare story key — repo convention) | `PIG-206: Add a scheduled campaign status` |
| Standalone A | `demo/injury-a` | `demo: INJURY A — off-brand Duplicate button` |
| Standalone B | `demo/injury-b` | `demo: INJURY B — review badge contrast` |

## Multiple demos in one day

| Surface | Fastest reset |
|---------|----------------|
| **201 loop** | [post-201 reset](#post-201-reset) if merged; else close PR → `/demo-reset` → `/stage-scheduled-pr` fresh |
| **101** | `demo-injury.sh reset` → `start-101` again |
| **A (standalone)** | Close PR → `/reset-injuries` → re-apply A → push (or new branch) |
| **B (standalone)** | `reset-branch-b` + force-push (between rehearsals), or new branch from `main` |

## Related

- [`INJURIES.md`](INJURIES.md) — diffs, room script, exact prompts
- [`DEMO-RUNBOOK.md`](DEMO-RUNBOOK.md) — 101/201 show flow
- [`.cursor/commands/`](../.cursor/commands/) — slash commands above
- [`/fix-ci`](../.cursor/commands/fix-ci.md) — editor replay of the INJURY B fix
