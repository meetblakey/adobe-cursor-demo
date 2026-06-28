#!/usr/bin/env bash
# Enable Vercel "Protection Bypass for Automation" on a project so preview URLs
# are reachable with x-vercel-protection-bypass (header or query param).
# SSO deployment protection can stay enabled; bypass grants demo/automation access.
#
# Usage: ./.github/scripts/enable-preview-protection-bypass.sh [project-name]
# Requires: vercel CLI logged in (vercel login) with access to the project.
set -euo pipefail

PROJECT="${1:-adobe-cursor-demo}"

echo "→ Enabling Protection Bypass for Automation on ${PROJECT}..."
vercel project protection enable "${PROJECT}" --protection-bypass --format json

echo ""
echo "✓ Bypass enabled. Retrieve the secret (do not commit it):"
echo "  vercel project protection ${PROJECT} --format json"
echo ""
echo "Use locally:"
echo "  export VERCEL_AUTOMATION_BYPASS_SECRET=<secret-from-json>"
echo "  vercel curl /campaigns --deployment <preview-url>"
echo ""
echo "Shareable demo link (sets a bypass cookie in the browser):"
echo "  <preview-url>/campaigns?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=<secret>"
echo ""
echo "Optional — make all preview URLs public (disables SSO protection entirely):"
echo "  vercel project protection disable ${PROJECT} --sso"
