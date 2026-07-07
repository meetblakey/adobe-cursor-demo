#!/usr/bin/env bash
# FALLBACK for the 201 Cloud-Agent spine. The PRIMARY path is a native @Cursor
# Cloud Agent building PIG-206 and opening the PR (Jira To Do -> In Progress ->
# Automation assigns @Cursor -> agent self-verifies -> PR). Use THIS script only
# when a live dispatch isn't ready: it fabricates the same artifact — cut PIG-206
# from clean origin/main, apply the Scheduled implementation (.demo/scheduled.patch)
# ONLY, one commit, push, open the PR ready-for-review. This stands in for the
# Cloud Agent's clean build (review token left at baseline #E0A24E).
#
# The INJURY A drift is NOT baked here anymore — it rides the PR as its own commit
# via `demo-injury.sh land-a` (Loop 1: Bugbot Autofix repairs it), exactly as it
# would on the live agent's PR. Tests stay green on this push (Scheduled is
# AA-clean); the drift + Bugbot's autofix come next.
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
git cat-file -e "origin/main:.demo/scheduled.patch" 2>/dev/null \
  || die ".demo/scheduled.patch is not on origin/main — merge the demo-tooling PR first"

git rev-parse --verify "$BRANCH" >/dev/null 2>&1 \
  && die "local branch $BRANCH exists — previous rehearsal not cleaned up (see /demo-reset)"
git ls-remote --exit-code origin "refs/heads/$BRANCH" >/dev/null 2>&1 \
  && die "remote branch $BRANCH exists — previous rehearsal not cleaned up (see /demo-reset)"

git checkout -b "$BRANCH" origin/main

git apply --check .demo/scheduled.patch
git apply .demo/scheduled.patch

git add -A
git commit -m "PIG-206: add a scheduled campaign status behind scheduled-status flag

Status derives from STATUS_TOKENS (AA pair both themes) + SPECTRUM_STATUS
'info'; filter entry + chip exposure gated by the scheduled-status flag
(OFF in production). Seed: APJ Expansion -> scheduled. Enum migrations
0006 (add value) + 0007 (backfill) apply staging-first."

echo "→ Verifying typecheck, tests, and build stay green (the Cloud Agent's clean build; drift comes via land-a)…"
npm run typecheck >/dev/null 2>&1 || die "typecheck failed on the staged branch — investigate before pushing"
npm test >/dev/null 2>&1 || die "tests failed on the staged branch — investigate before pushing"
npm run build >/dev/null 2>&1 || die "build failed on the staged branch — investigate before pushing"

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

echo "→ Staged the Cloud Agent's clean PIG-206 PR (checks green). Next — land the Loop 1 drift:"
echo "    git checkout PIG-206 && ./.github/scripts/demo-injury.sh land-a && git push"
echo "  Then watch Bugbot Autofix repair the bg-pink-500 Duplicate button on the PR."
