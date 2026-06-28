#!/usr/bin/env bash
# Append Vercel deployment-protection bypass query params to a preview URL.
# Requires VERCEL_AUTOMATION_BYPASS_SECRET in the environment (never commit the value).
#
# Usage:
#   export VERCEL_AUTOMATION_BYPASS_SECRET="$(vercel project protection adobe-cursor-demo --format json | jq -r '.protectionBypass | keys[0]')"
#   ./scripts/preview-demo-url.sh https://your-preview.vercel.app/campaigns
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <preview-base-url> [path]" >&2
  exit 1
fi

BASE="${1%/}"
PATH_PART="${2:-}"
SECRET="${VERCEL_AUTOMATION_BYPASS_SECRET:-}"

if [[ -z "${SECRET}" ]]; then
  echo "Set VERCEL_AUTOMATION_BYPASS_SECRET first." >&2
  echo "Dashboard: Project → Settings → Deployment Protection → Protection Bypass for Automation" >&2
  echo "CLI: vercel project protection adobe-cursor-demo --format json" >&2
  exit 1
fi

TARGET="${BASE}${PATH_PART}"
SEP="?"
if [[ "${TARGET}" == *"?"* ]]; then
  SEP="&"
fi

printf '%s%sx-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=%s\n' \
  "${TARGET}" "${SEP}" "${SECRET}"
