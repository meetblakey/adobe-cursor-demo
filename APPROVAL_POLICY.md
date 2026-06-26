# Approval policy — Pigment

Policy the Cursor **Approval Agent** applies to PRs. It auto-approves only low-risk,
policy-compliant PRs with no unresolved Bugbot or Security findings; everything else routes to a
human. It never merges and never replaces human review — a person still owns the merge and the
deploy gate. (A PR cannot relax this policy: the agent uses the base-branch version of this file.)

## Always route to a human (never auto-approve)
Any PR that touches platform-owned or sensitive paths:
- `components/ui/**` · `lib/**` · `app/globals.css` — the design system + gates (matches CODEOWNERS)
- `.cursor/**` — rules, hooks, permissions, agents (the governance config itself)
- `supabase/migrations/**` — schema/RLS changes
- `.github/**` — CI/workflow changes
- `package.json` / lockfile — any dependency change

Also route to a human when: an unresolved Bugbot or Security Reviewer finding is present, or the
PR's risk score exceeds the maximum threshold.

## Eligible for auto-approval (low risk)
Product-surface changes under `app/campaigns/**` and `components/campaigns/**` that: are within
the risk threshold, have a clean Bugbot review and a clean Security review, keep `npm test` green,
and touch no path above. These still merge through the normal GitHub review gate.

## Risk
Set a conservative **maximum risk threshold** so any high-blast-radius PR (many files, platform
paths, or a security finding) always escalates. Enable **Bugbot Review Context** and **Security
Review Context** so approval decisions consume both reviewers' findings.
