#!/usr/bin/env bash
# Merge latest origin/main into the current (or named) feature branch.
# Use at the start of a work session so the branch stays close to team main.
# Safe for editor agents: checkout/pull/merge only — never pushes to main.
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$repo_root"

main_branch="${MAIN_BRANCH:-main}"
feature_branch="${1:-$(git branch --show-current)}"

if [ -z "$feature_branch" ]; then
  echo "Not on a branch. Checkout a feature branch first." >&2
  exit 1
fi

if [ "$feature_branch" = "$main_branch" ]; then
  echo "Already on $main_branch. Checkout your feature branch (e.g. PIG-8), then re-run." >&2
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Uncommitted changes present. Commit or stash before syncing with $main_branch." >&2
  exit 1
fi

if ! git show-ref --verify --quiet "refs/heads/$feature_branch"; then
  echo "Branch '$feature_branch' does not exist locally." >&2
  exit 1
fi

echo "Fetching origin/$main_branch …"
git fetch origin "$main_branch"

echo "Updating local $main_branch …"
git checkout "$main_branch"
git pull --ff-only origin "$main_branch"

echo "Merging $main_branch into $feature_branch …"
git checkout "$feature_branch"
if git merge "$main_branch" -m "chore: merge $main_branch into $feature_branch"; then
  echo "Done — $feature_branch now includes latest $main_branch."
else
  echo "Merge conflict. Resolve files, commit, then continue work." >&2
  exit 1
fi
