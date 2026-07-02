#!/usr/bin/env bash
# Apply, verify, replay, or reset seeded demo state (INJURY A / INJURY B / the
# Scheduled implementation). Patches live in .demo/*.patch — never committed on main.
#
# Usage:
#   ./.github/scripts/demo-injury.sh apply a|b       # apply injury to working tree (not on main)
#   ./.github/scripts/demo-injury.sh start-101       # 101 start state: INJURY A on main, UNCOMMITTED
#   ./.github/scripts/demo-injury.sh replay-b        # commit INJURY B on top of HEAD (mid-room CI beat)
#   ./.github/scripts/demo-injury.sh reset           # restore demo files from main baseline
#   ./.github/scripts/demo-injury.sh verify baseline|a|b
#   ./.github/scripts/demo-injury.sh check-patches   # all .demo patches apply to HEAD (drift gate; run on clean main)
#   ./.github/scripts/demo-injury.sh tag-broken      # BETWEEN REHEARSALS ONLY: tag HEAD as demo/injury-b-broken
#   ./.github/scripts/demo-injury.sh reset-branch-b  # BETWEEN REHEARSALS ONLY: hard-reset to that tag
#
# MID-ROOM RULE — the branch tip must NEVER move backwards during a session.
# On the staged PIG-206 PR, the live INJURY A fix is a pushed commit; a
# reset-branch-b + force-push after it would wipe that fix from the PR — and
# merging would ship the magenta button to production. Mid-room, only add
# state forward: `replay-b` commits the INJURY B flip on top of HEAD.
# tag-broken / reset-branch-b exist for BETWEEN-REHEARSAL resets only.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PATCH_DIR="$ROOT/.demo"
CARD="$ROOT/components/campaigns/campaign-card.tsx"
# INJURY B lives in the Spectrum-free token data module (status-tokens.ts), not
# the StatusBadge component — the a11y gate imports the tokens directly.
TOKENS="$ROOT/components/ui/status-tokens.ts"
# The Scheduled implementation (.demo/scheduled.patch) additionally touches the
# seed, the badge/filter/view flag gate, and adds migrations 0006/0007.
# (lib/campaigns-types.ts is NOT touched — CampaignStatus lives in status-tokens.ts.)
SEED="$ROOT/lib/campaigns-seed.ts"
BADGE="$ROOT/components/ui/status-badge.tsx"
FILTER="$ROOT/components/campaigns/status-filter.tsx"
VIEW="$ROOT/components/campaigns/campaigns-view.tsx"
MIG_6="$ROOT/supabase/migrations/0006_campaign_status_scheduled.sql"
MIG_7="$ROOT/supabase/migrations/0007_schedule_apj_expansion.sql"
DEMO_FILES=("$CARD" "$TOKENS" "$SEED" "$BADGE" "$FILTER" "$VIEW")
INJURY_B_TAG="demo/injury-b-broken"

die() {
  echo "demo-injury: $*" >&2
  exit 1
}

on_main() {
  local branch
  branch="$(git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
  [ "$branch" = "main" ]
}

baseline_ref() {
  git -C "$ROOT" rev-parse --verify origin/main >/dev/null 2>&1 && echo "origin/main" && return
  git -C "$ROOT" rev-parse --verify main >/dev/null 2>&1 && echo "main" && return
  die "need main or origin/main to restore baseline"
}

# 'scheduled' must be absent from the status sources on main (the 101 needs it
# absent at start; it only exists on the PIG-206 branch). Scoped to the status
# token/seed/migrations — campaigns-types.ts legitimately has a 'scheduled'
# ChannelPlanStatus that is unrelated.
scheduled_absent() {
  ! grep -q "'scheduled'" "$TOKENS" "$SEED" 2>/dev/null \
    && [ ! -f "$MIG_6" ] && [ ! -f "$MIG_7" ]
}

cmd="${1:-}"
sub="${2:-}"

case "$cmd" in
  apply)
    on_main && die "refuse to apply injury on main — create a demo branch first (for the 101 start state use start-101)"
    case "$sub" in
      a|A)
        git -C "$ROOT" apply --check "$PATCH_DIR/injury-a.patch"
        git -C "$ROOT" apply "$PATCH_DIR/injury-a.patch"
        echo "→ INJURY A applied (bg-pink-500 Duplicate button). npm test should still pass."
        ;;
      b|B)
        git -C "$ROOT" apply --check "$PATCH_DIR/injury-b.patch"
        git -C "$ROOT" apply "$PATCH_DIR/injury-b.patch"
        echo "→ INJURY B applied (review.dark.fg #6A4A1E). npm test should fail the a11y gate."
        ;;
      *)
        die "usage: demo-injury.sh apply a|b"
        ;;
    esac
    ;;
  start-101)
    # The 101 opens BROKEN: INJURY A visible on /campaigns, working tree on main,
    # nothing committed. Priya then live-implements Scheduled and fixes the button
    # in-editor — no PR is opened in the 101.
    on_main || die "start-101 sets the 101 start state on main — checkout main first"
    { git -C "$ROOT" diff --quiet -- "${DEMO_FILES[@]}" \
        && git -C "$ROOT" diff --cached --quiet -- "${DEMO_FILES[@]}"; } \
      || die "demo files already modified (worktree or index) — run reset first"
    scheduled_absent || die "'scheduled' already present in tokens/seed/migrations — main must be Scheduled-free for the 101 (post-201? revert the Scheduled merge)"
    git -C "$ROOT" apply --check "$PATCH_DIR/injury-a.patch"
    git -C "$ROOT" apply "$PATCH_DIR/injury-a.patch"
    echo "→ 101 start state ready: INJURY A applied on main, UNCOMMITTED."
    echo "  Do NOT commit. 'scheduled' verified absent from tokens/seed/migrations."
    echo "  After the session (or to restart): demo-injury.sh reset"
    ;;
  replay-b)
    # Mid-room CI beat on the staged PIG-206 PR: commit the INJURY B flip ON TOP
    # of HEAD. Never moves the tip backwards, so the live INJURY A fix survives.
    on_main && die "refuse to commit INJURY B on main — checkout the PIG-206 branch first"
    { git -C "$ROOT" diff --quiet && git -C "$ROOT" diff --cached --quiet; } \
      || die "working tree dirty (worktree or index) — commit or reset first"
    git -C "$ROOT" apply --check "$PATCH_DIR/injury-b.patch" \
      || die "INJURY B patch does not apply — has fix-ci already changed the token on this branch?"
    git -C "$ROOT" apply "$PATCH_DIR/injury-b.patch"
    # pathspec commit: only the token file can ride this commit, whatever the index holds
    git -C "$ROOT" commit -m "PIG-206: tune review badge dark-mode foreground" -- "$TOKENS"
    echo "→ INJURY B committed on top of HEAD (review.dark.fg #6A4A1E; a11y gate will fail)."
    echo "  Push to trigger the red check + fix-ci: git push"
    ;;
  reset)
    ref="$(baseline_ref)"
    git -C "$ROOT" checkout "$ref" -- "${DEMO_FILES[@]}"
    for mig in "$MIG_6" "$MIG_7"; do
      if git -C "$ROOT" ls-files --error-unmatch "$mig" >/dev/null 2>&1; then
        git -C "$ROOT" rm -f "$mig"
      else
        rm -f "$mig"
      fi
    done
    echo "→ Restored demo files from $ref baseline; removed migrations 0006/0007 if present."
    ;;
  verify)
    ref="$(baseline_ref)"
    case "$sub" in
      baseline)
        ok=1
        if ! git -C "$ROOT" diff --quiet "$ref" -- "${DEMO_FILES[@]}"; then
          echo "DIFF: demo files differ from $ref baseline." >&2
          git -C "$ROOT" diff "$ref" -- "${DEMO_FILES[@]}" >&2 || true
          ok=0
        fi
        if ! scheduled_absent; then
          echo "DIFF: 'scheduled' present in tokens/seed or migrations 0006/0007 exist." >&2
          ok=0
        fi
        [ "$ok" = 1 ] || exit 1
        echo "OK: demo files match $ref baseline; 'scheduled' absent."
        ;;
      a|A)
        git -C "$ROOT" apply --reverse --check "$PATCH_DIR/injury-a.patch" 2>/dev/null \
          || die "INJURY A is not applied (or files drifted from patch)"
        echo "OK: INJURY A patch is applied."
        ;;
      b|B)
        git -C "$ROOT" apply --reverse --check "$PATCH_DIR/injury-b.patch" 2>/dev/null \
          || die "INJURY B is not applied (or files drifted from patch)"
        echo "OK: INJURY B patch is applied."
        ;;
      *)
        die "usage: demo-injury.sh verify baseline|a|b"
        ;;
    esac
    ;;
  check-patches)
    # Drift gate: every committed .demo patch must still apply to HEAD. Run on
    # clean main (CI runs it on pushes to main) — it will fail by design on a
    # branch where a patch is already applied. During the sanctioned 201 merge
    # window main briefly carries the Scheduled feature; the gate stands down
    # there and re-arms once the post-201 revert lands.
    if ! scheduled_absent; then
      echo "SKIP: 'scheduled' present on this tree (201 merge window?) — drift gate stands down."
      exit 0
    fi
    failed=0
    for p in "$PATCH_DIR"/*.patch; do
      if git -C "$ROOT" apply --check "$p" 2>/dev/null; then
        echo "OK: $(basename "$p") applies to HEAD."
      else
        echo "DRIFT: $(basename "$p") no longer applies — regenerate it against main." >&2
        failed=1
      fi
    done
    # Stack gate: staging order must compose (scheduled → injury-a → injury-b).
    stack_dir="$(mktemp -d)"
    cleanup_stack() {
      git -C "$ROOT" worktree remove -f "$stack_dir" 2>/dev/null || rm -rf "$stack_dir"
    }
    trap cleanup_stack EXIT
    git -C "$ROOT" worktree add --detach "$stack_dir" HEAD -q
    if git -C "$stack_dir" apply "$PATCH_DIR/scheduled.patch" \
      && git -C "$stack_dir" apply "$PATCH_DIR/injury-a.patch" \
      && git -C "$stack_dir" apply --check "$PATCH_DIR/injury-b.patch"; then
      echo "OK: patch stack (scheduled → injury-a → injury-b) composes."
    else
      echo "DRIFT: patch stack fails — re-verify scheduled → injury-a → injury-b." >&2
      failed=1
    fi
    cleanup_stack
    trap - EXIT
    exit "$failed"
    ;;
  tag-broken)
    on_main && die "tag the injury commit on the demo branch, not main"
    git -C "$ROOT" tag -f "$INJURY_B_TAG"
    echo "→ Tagged HEAD as $INJURY_B_TAG (BETWEEN REHEARSALS: reset-branch-b replays INJURY B after fix-ci)."
    ;;
  reset-branch-b)
    on_main && die "refuse to reset-branch-b on main — checkout the demo branch first"
    git -C "$ROOT" rev-parse --verify "$INJURY_B_TAG" >/dev/null 2>&1 \
      || die "missing tag $INJURY_B_TAG — run tag-broken at the injury commit first"
    echo "⚠ BETWEEN REHEARSALS ONLY — this moves the branch tip BACKWARDS and the"
    echo "  force-push will wipe any commits after the tag (e.g. a live INJURY A fix)."
    git -C "$ROOT" reset --hard "$INJURY_B_TAG"
    echo "→ Branch reset to $INJURY_B_TAG. Force-push to replay CI: git push --force-with-lease"
    ;;
  *)
    cat <<EOF
Usage: demo-injury.sh <command> [arg]

Commands:
  apply a|b             Apply INJURY A or B patch to the working tree (not on main)
  start-101             101 start state: INJURY A on main, UNCOMMITTED ('scheduled' verified absent)
  replay-b              Commit INJURY B on top of HEAD (mid-room CI beat; tip never moves backwards)
  reset                 Restore demo files from main baseline + remove migrations 0006/0007
  verify baseline|a|b   Check baseline clean (incl. 'scheduled' absent) or injury applied
  check-patches         All .demo/*.patch apply to HEAD (drift gate; run on clean main)
  tag-broken            BETWEEN REHEARSALS: tag current commit as $INJURY_B_TAG
  reset-branch-b        BETWEEN REHEARSALS: hard-reset branch to $INJURY_B_TAG (replay INJURY B)

Docs: docs/DEMO-INJURIES.md
EOF
    [ -z "$cmd" ] || exit 1
    ;;
esac
