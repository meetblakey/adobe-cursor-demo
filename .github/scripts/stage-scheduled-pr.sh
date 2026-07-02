#!/usr/bin/env bash
# Stage the 201's ticketed PR: cut PIG-206 from clean origin/main, apply the
# Scheduled implementation (.demo/scheduled.patch) AND the INJURY A drift
# (.demo/injury-a.patch) in one commit — "Priya missed it" — push, open the PR
# ready-for-review so Bugbot runs. Tests stay green on this push (INJURY A is
# a design violation, not a test failure); Bugbot catches the drift.
#
# Run BEFORE the room (or /stage-scheduled-pr). Re-staging requires the previous
# PIG-206 branch/PR to be cleaned up first (/demo-reset).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BRANCH="PIG-206"   # branch = bare story key, the repo convention

die() { echo "stage-scheduled-pr: $*" >&2; exit 1; }

cd "$ROOT"
# untracked files matter too: git add -A below would sweep them into the demo PR
[ -z "$(git status --porcelain)" ] \
  || die "working tree not clean (tracked or untracked changes) — commit/stash/clean first"
git fetch origin main

# fail fast, before any branch is cut: the payload must already be ON origin/main
for p in .demo/scheduled.patch .demo/injury-a.patch; do
  git cat-file -e "origin/main:$p" 2>/dev/null \
    || die "$p is not on origin/main — merge the demo-tooling PR first"
done

git rev-parse --verify "$BRANCH" >/dev/null 2>&1 \
  && die "local branch $BRANCH exists — previous rehearsal not cleaned up (see /demo-reset)"
git ls-remote --exit-code origin "refs/heads/$BRANCH" >/dev/null 2>&1 \
  && die "remote branch $BRANCH exists — previous rehearsal not cleaned up (see /demo-reset)"

git checkout -b "$BRANCH" origin/main

git apply --check .demo/scheduled.patch
git apply .demo/scheduled.patch
git apply --check .demo/injury-a.patch
git apply .demo/injury-a.patch

git add -A
git commit -m "PIG-206: add a scheduled campaign status behind scheduled-status flag

Status derives from STATUS_TOKENS (AA pair both themes) + SPECTRUM_STATUS
'info'; filter entry + chip exposure gated by the scheduled-status flag
(OFF in production). Seed: APJ Expansion -> scheduled. Enum migrations
0006 (add value) + 0007 (backfill) apply staging-first."

echo "→ Verifying tests stay green on push 1 (Bugbot catches the drift, not CI)…"
npx vitest run >/dev/null 2>&1 || die "vitest failed on the staged branch — investigate before pushing"

git push -u origin "$BRANCH"

gh pr create --base main --head "$BRANCH" \
  --title "PIG-206: Add a scheduled campaign status" \
  --body "$(cat <<'EOF'
Adds the `scheduled` campaign status the Pigment way (Jira: PIG-206):

- `STATUS_TOKENS` entry (WCAG AA in light + dark; a11y gate covers it) + `SPECTRUM_STATUS: 'info'` — filter options and labels derive automatically.
- Seed: **APJ Expansion** → `scheduled`; enum migrations `0006` (add value) + `0007` (backfill), staging-first per the add-migration skill.
- Exposure is behind the **`scheduled-status`** LaunchDarkly flag (OFF in production): flag OFF → scheduled campaigns present as before; flag ON → Scheduled chip + filter entry. Release via `/release-flag` after merge.
EOF
)"

echo "→ Staged. Watch for the Bugbot comment on the design-system drift (checks stay green)."
