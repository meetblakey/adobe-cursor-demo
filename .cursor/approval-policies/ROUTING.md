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
    - "Solo demo repo: auto-approve when within the risk threshold, Bugbot and Security Reviewer have no open findings, and the CI check job is green — including platform paths. Org scale: route to @pigment/platform (never auto-approve platform paths that affect 200+ surfaces)."

- product: pigment-campaigns
  boundary: "Product-team surfaces: app/campaigns/** and components/campaigns/**"
  policies:
    - APPROVAL_POLICY.md
    - "Auto-approve when within the risk threshold, Bugbot and Security Reviewer have no open findings, and CI check is green. Solo repo: same maintainer (@meetblakey) owns both platform and product boundaries."
