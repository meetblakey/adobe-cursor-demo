#!/usr/bin/env bash
# Apply .github/rulesets/main-branch.json to the GitHub repo via the Rulesets API.
# Run from repo root after `gh auth login`. Safe to re-run — updates an existing ruleset
# named "Protect main — PR + CI required" or creates it if missing.
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
ruleset_file="$repo_root/.github/rulesets/main-branch.json"
ruleset_name="Protect main — PR + CI required"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required. Install: https://cli.github.com/" >&2
  exit 1
fi

repo="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
existing_id="$(gh api "repos/$repo/rulesets" --jq ".[] | select(.name == \"$ruleset_name\") | .id" | head -1)"

if [ -n "$existing_id" ]; then
  echo "Updating ruleset $existing_id on $repo …"
  gh api --method PUT "repos/$repo/rulesets/$existing_id" --input "$ruleset_file"
else
  echo "Creating ruleset on $repo …"
  gh api --method POST "repos/$repo/rulesets" --input "$ruleset_file"
fi

echo "Done. Verify at: https://github.com/$repo/settings/rules"
