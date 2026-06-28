# Cloud Agent self-verify — required before opening a PR

Use this checklist when a Cloud Agent (VM) implements work on a Pigment feature branch.
Referenced by `/cloud-ticket`, `/sentry-incident`, and the Sentry Automation
([`docs/SENTRY-AUTOMATION.md`](../../docs/SENTRY-AUTOMATION.md)).

## Branch and scope

1. Work on feature branch `PIG-N` synced with latest `main` — never commit on `main`.
2. Smallest change that satisfies the ticket; stay within product paths unless the story
   explicitly requires platform work.

## Quality gates (required)

```bash
npm run typecheck && npm test && npm run build
```

Do **not** weaken or delete failing assertions to go green.

## Visual self-verify (required for UI work)

1. Ensure the dev server is running (`npm run dev` — port 3000).
2. Open `http://localhost:3000/campaigns` in the VM browser.
3. Capture screenshot(s):
   - Light mode — campaigns grid visible.
   - If UI changed: dark mode (theme toggle) and status filter interaction.
4. Attach screenshots to the PR description.

For non-UI fixes (API/lib only), skip browser screenshots; gates still required.

## Feature flags

- Confirm flag wiring in code when the story is flag-gated.
- Do **not** toggle LaunchDarkly **production** — preview/test only per
  [`docs/ENVIRONMENTS.md`](../../docs/ENVIRONMENTS.md).

## Open PR (do not merge)

1. Title includes the Jira key (e.g. `PIG-204: Add archived status filter`).
2. Body links the Jira story and includes self-verify screenshots when UI changed.
3. Open PR targeting `main`; **never merge** — human owns merge and `/release-flag`.

## Governance (always)

- No writes to `.env*` or committed secrets.
- No edits under `.github/`.
- Respect [`guard-shell.sh`](../hooks/guard-shell.sh) and [`.cursor/permissions.json`](../permissions.json).
