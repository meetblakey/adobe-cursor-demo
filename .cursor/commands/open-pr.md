# Open a PR (review → push → PR → merge gate)

Bridge between finished implementation and `/ship-ticket`. Argument: optional Jira key
(e.g. `PIG-8`) for the PR title/body.

1. **Local gates** — `npm run typecheck && npm test && npm run build`. Fix failures before
   continuing.

2. **`/review-bugbot`** — run the review-bugbot skill (Bugbot subagent, `branch changes` vs
   `main`). Fix blocking findings before push. Local review syncs patch ID with PR Bugbot —
   opening a PR with the same diff may skip duplicate remote review.

3. **`/review-security`** — run when the diff touches platform or sensitive paths:
   `lib/**`, `supabase/**`, `.cursor/**`, `.github/**`, `app/api/**`, or auth/data-handling
   code. Fix blocking findings before push.

3b. **Preview flag validation** (feature-flagged work) — toggle the flag **ON** in LaunchDarkly
   **test** environment only. After push, confirm behaviour on the Vercel preview URL. Production
   LD flag stays **OFF** until `/release-flag` after merge.

4. **Commit** any review fixes on the feature branch. Never commit on `main`.

5. **Push** — `git push origin <branch>` (never push to `main`; enforced by
   `.github/rulesets/main-branch.json` + `guard-shell.sh`).

6. **Open PR** — `gh pr create` targeting `main` (or update an existing PR). Include the Jira
   key in title/body when provided.

7. **Wait for PR checks** — `check`, `validate-pr-source`, `Cursor Bugbot`, Security Reviewer,
   Approval Agent (when configured), Vercel preview. Do not call `/ship-ticket` until checks
   are green and a **human merges** the PR.

8. Hand off to **`/release-flag <key> [flag-key]`** for flag-gated features, then
   **`/ship-ticket <key>`** after prod rollout (or documented dark ship).
