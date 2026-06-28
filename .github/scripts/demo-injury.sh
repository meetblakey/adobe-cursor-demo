#!/usr/bin/env bash
# Apply, verify, or reset seeded demo injuries (INJURY A / INJURY B).
# Patches live in .demo/*.patch — never applied on main.
#
# Usage:
#   ./.github/scripts/demo-injury.sh apply a|b
#   ./.github/scripts/demo-injury.sh reset
#   ./.github/scripts/demo-injury.sh verify baseline|a|b
#   ./.github/scripts/demo-injury.sh tag-broken    # tag current HEAD as demo/injury-b-broken
#   ./.github/scripts/demo-injury.sh reset-branch-b  # reset demo/injury-b to tagged injury commit
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PATCH_DIR="$ROOT/.demo"
CARD="$ROOT/components/campaigns/campaign-card.tsx"
# INJURY B lives in the Spectrum-free token data module (status-tokens.ts), not
# the StatusBadge component — the a11y gate imports the tokens directly.
TOKENS="$ROOT/components/ui/status-tokens.ts"
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

cmd="${1:-}"
sub="${2:-}"

case "$cmd" in
  apply)
    on_main && die "refuse to apply injury on main — create a demo branch first"
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
  reset)
    ref="$(baseline_ref)"
    git -C "$ROOT" checkout "$ref" -- "$CARD" "$TOKENS"
    echo "→ Restored injury files from $ref baseline."
    ;;
  verify)
    ref="$(baseline_ref)"
    case "$sub" in
      baseline)
        if git -C "$ROOT" diff --quiet "$ref" -- "$CARD" "$TOKENS"; then
          echo "OK: injury files match $ref baseline."
        else
          echo "DIFF: injury files differ from $ref baseline." >&2
          git -C "$ROOT" diff "$ref" -- "$CARD" "$TOKENS" >&2 || true
          exit 1
        fi
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
  tag-broken)
    on_main && die "tag the injury commit on demo/injury-b, not main"
    git -C "$ROOT" tag -f "$INJURY_B_TAG"
    echo "→ Tagged HEAD as $INJURY_B_TAG (reset-branch-b can replay INJURY B after fix-ci)."
    ;;
  reset-branch-b)
    on_main && die "refuse to reset-branch-b on main — checkout demo/injury-b first"
    git -C "$ROOT" rev-parse --verify "$INJURY_B_TAG" >/dev/null 2>&1 \
      || die "missing tag $INJURY_B_TAG — run tag-broken after applying INJURY B on demo/injury-b"
    git -C "$ROOT" reset --hard "$INJURY_B_TAG"
    echo "→ Branch reset to $INJURY_B_TAG. Force-push to replay CI: git push --force-with-lease"
    ;;
  *)
    cat <<EOF
Usage: demo-injury.sh <command> [arg]

Commands:
  apply a|b           Apply INJURY A or B patch (not on main)
  reset                 Restore both injury files from main baseline
  verify baseline|a|b   Check baseline clean or injury applied
  tag-broken            Tag current commit as $INJURY_B_TAG
  reset-branch-b        Hard-reset branch to $INJURY_B_TAG (replay INJURY B)

Docs: docs/DEMO-INJURIES.md
EOF
    ;;
esac
