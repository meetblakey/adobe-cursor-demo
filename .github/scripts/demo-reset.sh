#!/usr/bin/env bash
# Deterministic, idempotent, machine-checkable REPO-side helpers for /demo-reset.
# The Jira / LaunchDarkly / Supabase / Vercel resets are driven by the /demo-reset
# command playbook via MCP; this script owns git + gh + repo baseline assertions.
#
# Usage:
#   ./.github/scripts/demo-reset.sh preflight          # checkout main + fetch + ff-pull + clean-tree warn
#   ./.github/scripts/demo-reset.sh scheduled-on-main  # exit 0 = 'scheduled' merged into origin/main (revert needed); 1 = clean
#   ./.github/scripts/demo-reset.sh cleanup-branches   # hook-safe delete of remote demo branches (skips ones with an open PR)
#   ./.github/scripts/demo-reset.sh verify             # REPO baseline PASS/FAIL matrix (system 1 of the reset)
#
# NOT `set -e`: verify/checks must all run and report, not abort on the first failure.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEMO_INJURY="$ROOT/.github/scripts/demo-injury.sh"
DEMO_BRANCHES=(PIG-206 demo/injury-a demo/injury-b test/201-e2e)
TOKENS_REL="components/ui/status-tokens.ts"
SEED_REL="lib/campaigns-seed.ts"
MIG6_REL="supabase/migrations/0006_campaign_status_scheduled.sql"

say() { printf '%s\n' "$*"; }
die() { printf 'demo-reset: %s\n' "$*" >&2; exit 1; }

# 'scheduled' present on origin/main? (truth source = origin/main, NOT the working tree —
# a stale local ref must never answer "did a live 201 merge into main").
scheduled_on_origin_main() {
  git -C "$ROOT" grep -q "'scheduled'" origin/main -- "$TOKENS_REL" "$SEED_REL" 2>/dev/null \
    || git -C "$ROOT" cat-file -e "origin/main:$MIG6_REL" 2>/dev/null
}

cmd="${1:-}"

case "$cmd" in
  preflight)
    git -C "$ROOT" rev-parse --verify main >/dev/null 2>&1 || die "no local main branch"
    git -C "$ROOT" checkout main >/dev/null 2>&1 || die "cannot checkout main (commit/stash first)"
    git -C "$ROOT" fetch --quiet origin || die "git fetch origin failed"
    if ! git -C "$ROOT" diff --quiet || ! git -C "$ROOT" diff --cached --quiet; then
      say "WARN: working tree has uncommitted changes — commit/stash unrelated work first"
      say "      (demo-injury.sh reset will overwrite the demo files)."
    fi
    git -C "$ROOT" pull --ff-only origin main >/dev/null 2>&1 \
      || say "WARN: local main is not fast-forwardable to origin/main — reconcile before continuing."
    say "OK: on main; fetched. origin/main tip = $(git -C "$ROOT" rev-parse --short origin/main)."
    ;;

  scheduled-on-main)
    git -C "$ROOT" fetch --quiet origin main 2>/dev/null || true
    if scheduled_on_origin_main; then
      say "SCHEDULED PRESENT on origin/main — a live 201 merged; revert it BEFORE the file reset."
      exit 0
    fi
    say "clean: origin/main is Scheduled-free (no revert needed)."
    exit 1
    ;;

  cleanup-branches)
    git -C "$ROOT" fetch --quiet --prune origin 2>/dev/null || true
    for b in "${DEMO_BRANCHES[@]}"; do
      git -C "$ROOT" ls-remote --exit-code origin "refs/heads/$b" >/dev/null 2>&1 || continue
      if [ -n "$(gh pr list --repo "$(git -C "$ROOT" remote get-url origin)" --head "$b" --state open --json number --jq '.[].number' 2>/dev/null)" ]; then
        say "  skip remote $b — it has an OPEN PR; close that PR first (do not orphan it)."
        continue
      fi
      say "→ deleting remote branch $b"
      git -C "$ROOT" push origin --delete "$b" 2>/dev/null || say "  (could not delete remote $b)"
    done
    local_left="$(git -C "$ROOT" branch --list "${DEMO_BRANCHES[@]}" | sed 's/[* ]//g' | paste -sd' ' -)"
    [ -n "$local_left" ] && say "NOTE: local branches remain ($local_left) — guard-shell denies 'git branch -D'; delete via the GitHub UI or a fresh clone."
    say "OK: remote demo branches cleaned."
    ;;

  verify)
    git -C "$ROOT" fetch --quiet origin main 2>/dev/null || true
    fails=0
    check() { if [ "$2" -eq 0 ]; then printf '  %-28s PASS\n' "$1"; else printf '  %-28s FAIL\n' "$1"; fails=$((fails+1)); fi; }
    say "REPO baseline:"
    [ "$(git -C "$ROOT" rev-parse --abbrev-ref HEAD)" = main ]; check "on main" $?
    ( ! scheduled_on_origin_main ); check "origin/main Scheduled-free" $?
    "$DEMO_INJURY" verify baseline >/dev/null 2>&1; check "working tree baseline" $?
    "$DEMO_INJURY" check-patches >/dev/null 2>&1; check "patch stack composes" $?
    say ""
    for b in "${DEMO_BRANCHES[@]}"; do
      git -C "$ROOT" ls-remote --exit-code origin "refs/heads/$b" >/dev/null 2>&1 \
        && say "  WARN: remote branch $b still exists (blocks next stage-scheduled-pr / re-run)"
    done
    if [ "$fails" -eq 0 ]; then say "REPO: PASS"; else say "REPO: FAIL ($fails) — fix and re-run (steps are idempotent)"; exit 1; fi
    ;;

  *)
    cat <<EOF
Usage: demo-reset.sh <preflight|scheduled-on-main|cleanup-branches|verify>

  preflight          checkout main + fetch + ff-pull + clean-tree warn (run FIRST)
  scheduled-on-main  exit 0 if a live 201 merged into origin/main (revert needed), 1 if clean
  cleanup-branches   hook-safe delete of remote demo branches with no open PR; list stubborn local refs
  verify             machine-checkable REPO baseline PASS/FAIL (system 1 of the four-system reset)

Jira / LaunchDarkly / Supabase / Vercel resets are driven by the /demo-reset command via MCP.
EOF
    [ -z "$cmd" ] || exit 1
    ;;
esac
