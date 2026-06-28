#!/usr/bin/env bash
# Re-enable Vercel SSO deployment protection (all_except_custom_domains).
# Pair with Protection Bypass for Automation for CI/agents while SSO is on.
#
# Usage: ./.github/scripts/enable-preview-sso.sh [project-name]
set -euo pipefail

PROJECT="${1:-adobe-cursor-demo}"

echo "→ Enabling SSO deployment protection on ${PROJECT}..."
vercel project protection enable "${PROJECT}" --sso --format json

echo ""
echo "✓ SSO enabled. Preview URLs require team login unless using bypass:"
echo "  ./.github/scripts/enable-preview-protection-bypass.sh ${PROJECT}"
