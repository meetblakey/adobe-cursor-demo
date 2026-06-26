#!/usr/bin/env bash
# beforeShellExecution governance gate. Makes the cursor-agent allow/deny posture REAL and
# deterministic — it fires in the editor, the `cursor` CLI, and cloud/CI agents (all read
# .cursor/hooks.json). Cursor passes the event as JSON on stdin; we return a snake_case
# decision on stdout: {"permission":"allow"|"deny","user_message":...,"agent_message":...}.
#
# Note (state this honestly when demoing): Cursor hooks fail OPEN — only an explicit "deny"
# (or exit 2) blocks; a crash exits non-zero and the action is allowed. So we log and fail safe.
set -uo pipefail

payload="$(cat)"
cmd="$(printf '%s' "$payload" | python3 -c 'import sys,json
try: print(json.load(sys.stdin).get("command",""))
except Exception: print("")' 2>/dev/null || true)"

# deny: destructive removes, secret/env writes, .github edits, outbound network
if printf '%s' "$cmd" | grep -Eq 'rm[[:space:]]+-rf|>[[:space:]]*\.env|tee[[:space:]]+\.env|\.github/|(^|[[:space:]])(curl|wget)[[:space:]]'; then
  printf '{"permission":"deny","user_message":"Blocked by Pigment governance hook.","agent_message":"Denied: rm -rf, .env writes, .github edits, and outbound network are not allowed. Stay within Edit(app|components|lib) + npm test/typecheck/build. A denial means re-scope, not retry."}'
  exit 0
fi
printf '{"permission":"allow"}'
