# Approval policy — Pigment

Policy the Cursor **Approval Agent** applies to PRs. It auto-approves low-risk,
policy-compliant PRs with no unresolved Bugbot or Security findings; everything else routes to a
human. It never merges and never replaces human review — a person still owns the merge and the
deploy gate. (A PR cannot relax this policy: the agent uses the base-branch version of this file.)

## Solo developer mode (this repo — active)

This repository has a **single maintainer** (`@meetblakey`) emulating the 100+-engineer ownership
model. Auto-approve any PR when **all** of the following hold:

- Within the configured **maximum risk threshold**
- **Bugbot** review has no unresolved findings
- **Security Reviewer** has no unresolved findings (when enabled)
- GitHub Actions **`check`** job is green (typecheck + test + build)
- No new dependency added **unless** `npm test` and Security review are clean

Platform paths (`components/ui/**`, `lib/**`, `.cursor/**`, migrations, `.github/**`) are
**eligible for auto-approval** under these conditions — the maintainer is the platform team.

`CODEOWNERS` lists `@meetblakey` for narrative ownership. GitHub ruleset does **not** require
code-owner review (`require_code_owner_review: false`); merge remains a human click.

## Org scale (narrative — when `@pigment/*` teams exist)

At organization scale, tighten platform and sensitive paths:

- `components/ui/**` · `lib/**` · `app/globals.css` — design system + gates
- `.cursor/**` — rules, hooks, permissions, agents
- `supabase/migrations/**` — schema/RLS changes
- `.github/**` — CI/workflow changes
- `package.json` / lockfile — dependency changes

Route those PRs to `@pigment/platform` for human review. Product surfaces (`app/campaigns/**`,
`components/campaigns/**`) may auto-approve when low risk and reviews are clean.

Always route to a human when: an unresolved Bugbot or Security finding is present, or the PR's
risk score exceeds the maximum threshold.

## Risk

Set a conservative **maximum risk threshold** so any high-blast-radius PR (many files, platform
paths, or a security finding) escalates when in doubt. Enable **Bugbot Review Context** and
**Security Review Context** so approval decisions consume both reviewers' findings.
