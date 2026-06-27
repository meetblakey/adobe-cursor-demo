#!/usr/bin/env bash
# beforeShellExecution governance gate. Makes the cursor-agent allow/deny posture REAL and
# deterministic — it fires in the editor, the `cursor` CLI, and cloud/CI agents (all read
# .cursor/hooks.json). Cursor passes the event as JSON on stdin; we return a snake_case
# decision on stdout: {"permission":"allow"|"deny","user_message":...,"agent_message":...}.
#
# Policy split:
#   - Editor / local chat: allow git add, commit, push, pull (ship from chat); deny destructive git.
#   - CI / headless runs: deny ALL git shell — deterministic workflow steps own git (INJURY B demo).
#
# Note (state this honestly when demoing): Cursor hooks fail OPEN — only an explicit "deny"
# (or exit 2) blocks; a crash exits non-zero and the action is allowed.
set -uo pipefail

payload="$(cat)"
cmd="$(printf '%s' "$payload" | python3 -c 'import sys,json
try: print(json.load(sys.stdin).get("command",""))
except Exception: print("")' 2>/dev/null || true)"

deny_msg='{"permission":"deny","user_message":"Blocked by Pigment governance hook.","agent_message":"Denied by guard-shell.sh. A denial means re-scope, not retry."}'

# Shared denials (every context)
if printf '%s' "$cmd" | grep -Eq 'rm[[:space:]]+-rf|>[[:space:]]*\.env|tee[[:space:]]+\.env|(^|[[:space:]])(curl|wget)[[:space:]]'; then
  printf '%s' "$deny_msg"
  exit 0
fi

# CI / headless: no git from the agent shell — workflow YAML owns commit/push
if [ -n "${GITHUB_ACTIONS:-}" ] || [ "${CI:-}" = "true" ]; then
  if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]'; then
    printf '%s' "$deny_msg"
    exit 0
  fi
  printf '{"permission":"allow"}'
  exit 0
fi

# Editor / local chat: allow ship commands on feature branches; block destructive git
# and any push that targets main (main only receives merges via PR — see .github/rulesets/).
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+reset|git[[:space:]]+clean|git[[:space:]]+push[^|]*(-f|--force)|git[[:space:]]+push[^|]*--force-with-lease|git[[:space:]]+branch[[:space:]]+-D'; then
  printf '%s' "$deny_msg"
  exit 0
fi

if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push([^|]*[[:space:]]+)?(origin[[:space:]]+)?(HEAD:)?main([^a-zA-Z0-9_-]|$)|git[[:space:]]+push[^|]*:[[:space:]]*main([^a-zA-Z0-9_-]|$)|git[[:space:]]+push[^|]*[[:space:]]+main([^a-zA-Z0-9_-]|$)'; then
  printf '%s' "$deny_msg"
  exit 0
fi

printf '{"permission":"allow"}'
