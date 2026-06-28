#!/usr/bin/env bash
# Disable Vercel SSO deployment protection so branch preview URLs are public.
# Use for demo day when the audience is not logged into your Vercel team.
# Re-enable after the demo: ./.github/scripts/enable-preview-sso.sh
#
# Usage: ./.github/scripts/disable-preview-sso.sh [project-name]
set -euo pipefail

PROJECT="${1:-adobe-cursor-demo}"

echo "→ Disabling SSO deployment protection on ${PROJECT}..."
vercel project protection disable "${PROJECT}" --sso --format json

echo ""
echo "✓ Preview URLs on *.vercel.app are now public (production alias unchanged)."
echo "  Re-enable after demo: ./.github/scripts/enable-preview-sso.sh ${PROJECT}"
