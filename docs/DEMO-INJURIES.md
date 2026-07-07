# Demo injuries — stage, rehearse, reset

Repeatable demo state for the 101 (opens broken, heals in-editor) and the 201 (a Cloud Agent's
ticketed PR runs the outer loop: **Bugbot Autofix** (Loop 1) → **`fix-ci`** (Loop 2) → merge →
flag release) without ever leaving `main` or production dirty. Full scenario copy + prompts:
[`INJURIES.md`](INJURIES.md).

## Golden rules

1. **Never *commit* injuries on `main`.** The 101 start state applies INJURY A to the working
   tree on `main` **uncommitted** (`start-101`) — that's the only sanctioned injury on `main`,
   and `reset` removes it. Production only updates when `main` merges.
2. **The PIG-206 PR is the one injury-carrying branch that merges** — in-room, after both
   injuries have been fixed *on the branch* by the gates. Revert the merge on `main` afterwards
   ([post-201 reset](#post-201-reset)). Standalone `demo/injury-*` rehearsal PRs are **closed,
   never merged**.
3. **Mid-room, the branch tip NEVER moves backwards.** After Bugbot's Loop 1 autofix commit
   lands, a `reset-branch-b` + force-push would wipe it from the PR — and merging would ship the
   magenta button to production. Mid-room you only add state forward: **`land-a`** then
   **`replay-b`** commit on top of HEAD. `tag-broken` / `reset-branch-b` are for
   **between-rehearsal** resets only.
4. **Patches live in [`.demo/`](../.demo/)** — committed as files; `main` must stay
   Scheduled-free (`check-patches` enforces that they always apply on `main`).

## Quick reference

| Goal | Command | Script |
|------|---------|--------|
| 101 start state (A on `main`, uncommitted) | — | `./.github/scripts/demo-injury.sh start-101` |
| Fabricate the Cloud Agent's clean PIG-206 PR (fallback) | **`/stage-scheduled-pr`** | `./.github/scripts/stage-scheduled-pr.sh` |
| Loop 1: land INJURY A on the PIG-206 PR | — | `./.github/scripts/demo-injury.sh land-a` |
| Loop 2: land INJURY B on top of HEAD | — | `./.github/scripts/demo-injury.sh replay-b` |
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
Jira PIG-206 To Do → In Progress → assign @Cursor
  → Cloud Agent builds Scheduled + self-verifies → opens PR PIG-206 (review token @ #E0A24E)
     (fallback: /stage-scheduled-pr fabricates the same clean PR)
  → demo-injury.sh land-a → push → check GREEN → Bugbot Autofix commits the fix (Loop 1)
  → [room] demo-injury.sh replay-b → push → check RED
  → fix-ci runs cursor-agent → commits fix to the SAME PR + comments → green (Loop 2)
  → [room] human merges → prod deploys DARK (scheduled-status OFF)
  → /release-flag scheduled-status → chip + filter appear
  → [after] post-201 reset (below)
```

- The `land-a` push must stay **green** — INJURY A is a design violation, not a test failure;
  Bugbot Autofix is the gate that fires.
- `land-a` / `replay-b` refuse to run if the working tree is dirty or the patch no longer applies
  (e.g. Bugbot already autofixed the button, or `fix-ci` already rewrote the token, on this branch).
- `land-a` / `replay-b` **fetch + fast-forward the remote branch first** (`sync_remote_ff`) so
  Bugbot's Loop 1 autofix commit is ingested — the follow-up `git push` stays a fast-forward,
  never a force-push.
- **Bugbot AUTOFIX must be ON** (Cursor dashboard) — it is now the **Loop 1** beat: Bugbot commits
  the button fix to the PR ~10–15 min after `land-a`. **Scope it OFF `components/ui/status-tokens.ts`**
  (path-exclude or mention-only) so it does NOT also autofix INJURY B — **Loop 2 is `fix-ci`'s**.
  Sequence matters: let Loop 1 land *before* `replay-b`. See [`.cursor/BUGBOT.md`](../.cursor/BUGBOT.md).
- After `fix-ci` pushes its commit: the workflow re-dispatches the required `check` (green
  ~1 min); if GitHub shows a **"workflow awaiting approval"** run on that commit, hit
  **Re-run** on it (`gh run rerun <id>`) — then the PR is mergeable.

### INJURY A — standalone Bugbot rehearsal (optional, outside the 201)

```
main (clean) → branch demo/injury-a → apply a → push → PR (ready, not draft)
→ Bugbot Autofix commits the fix (or comments, if scoped off) → discuss → close PR (do not merge)
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
4. **Supabase (the one project):** revert the backfill only —
   `update public.campaigns set status = 'draft' where name = 'APJ Expansion';`
   Postgres **cannot drop enum values**, so `'scheduled'` stays in the enum between rehearsals —
   that's acceptable and additive (invisible until a row uses it). The project only gets the
   `scheduled` migrations when you deliberately run them for the flag-reveal beat; skip that
   during rehearsals that don't need the live DB.
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
