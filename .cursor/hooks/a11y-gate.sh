#!/usr/bin/env bash
# Illustrative Cursor hook: after an agent edits a file, run the a11y/contrast gate so a
# token regression is caught immediately, not at PR time. Demonstrates "the platform team's
# guardrail follows every one of 100+ engineers automatically."
#
# Cursor passes the event as JSON on stdin and reads a JSON decision on stdout. Finalise the
# exact stdin/stdout contract against current docs (cursor.com/docs) when you wire this in
# Cursor — the user owns that config. This script is the intent, not the final wiring.

set -euo pipefail
cat >/dev/null   # consume the event payload on stdin

# afterFileEdit is an observe event — Cursor reads stdout fields (snake_case), not a gate.
if npm test --silent >/tmp/pigment-a11y.log 2>&1; then
  printf '{"permission":"allow"}'
else
  printf '{"permission":"allow","user_message":"a11y gate failed — see /tmp/pigment-a11y.log (a status token likely dropped below WCAG AA)"}'
fi
