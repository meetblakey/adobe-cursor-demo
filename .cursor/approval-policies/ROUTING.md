# Approval routing — Pigment
#
# Per cursor.com/docs/approval-agents#approval-policy-files: a YAML list of product entries.
# The Approval Agent routes a PR to the matching product by `boundary`, then applies its
# `policies` (file paths and/or semantic descriptions). A PR cannot relax these by editing this
# file — the agent uses the base-branch version. (Docs give the keys but no example; verify the
# exact value shapes against the docs when you enable the agent.)

- product: pigment-platform
  boundary: "The platform-owned design system and governance: components/ui/**, lib/**, app/globals.css, .cursor/**, supabase/migrations/**, .github/**"
  policies:
    - APPROVAL_POLICY.md
    - "Never auto-approve. Always route to a human reviewer (CODEOWNERS @pigment/platform). A change here can affect 200+ product surfaces, so it gets human eyes regardless of risk score."

- product: pigment-campaigns
  boundary: "Product-team surfaces: app/campaigns/** and components/campaigns/**"
  policies:
    - APPROVAL_POLICY.md
    - "Eligible for auto-approval when within the risk threshold, with a clean Bugbot review and no open findings, npm test green, and no platform path touched. Otherwise route to @pigment/growth."
