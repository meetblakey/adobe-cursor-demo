# Cloud Agent brief — PIG-206 "Add a scheduled campaign status"

The exact brief the native **@Cursor** Cloud Agent is dispatched with when PIG-206 moves
**To Do → In Progress** (Jira Automation assigns @Cursor). Build in a VM on branch `PIG-206`,
self-verify in a browser, open a PR against `main` — **do not merge**.

---

Build **PIG-206 — "Add a scheduled campaign status"** following this repo's rules and skills
([`AGENTS.md`](../../AGENTS.md), [`.cursor/rules/design-system.mdc`](../rules/design-system.mdc),
[`.cursor/rules/launchdarkly.mdc`](../rules/launchdarkly.mdc)). Mirror the shipped `archived`
story (migrations 0004/0005) as the worked example.

## Acceptance criteria

1. A `STATUS_TOKENS` entry for `scheduled` in `components/ui/status-tokens.ts` that passes the
   WCAG AA contrast test (`components/ui/status-badge.test.ts`) in **both** themes.
2. A Spectrum semantic mapping `SPECTRUM_STATUS: 'info'` (no literal color on the Spectrum path;
   `components/ui/status-badge.spectrum.test.ts` stays green).
3. The status filter + labels **derive from `STATUS_TOKENS`** — no second source of truth.
4. Flip the **APJ Expansion** seed campaign to `scheduled` in `lib/campaigns-seed.ts`.
5. Keep the Supabase enum in sync via the **two-step migration** (use the **`add-migration`**
   skill): `0006` add the enum value, `0007` backfill APJ. Staging-first.
6. Gate the new status behind the **`scheduled-status`** LaunchDarkly flag (default **OFF** in
   production): flag OFF → scheduled campaigns present as before (draft chip, no filter entry);
   flag ON → Scheduled chip + filter entry.
7. **Leave the existing `review` token at its current value** (`review.dark.fg = #E0A24E`). Do
   not touch other status tokens.

## Self-verify (required before the PR)

Follow [`.cursor/prompts/cloud-agent-self-verify.md`](cloud-agent-self-verify.md):

- `npm run typecheck && npm test && npm run build` — all green (do not weaken assertions).
- Open `http://localhost:3000/campaigns`; capture **light**, **dark**, and **filtered** (status
  filter) screenshots; attach them to the PR description.
- Open the PR against `main` with the Jira key in the title — **do not merge** (human owns merge
  + `/release-flag`).

## Out of scope for the agent (these ride the PR afterward — do NOT author them)

- The **INJURY A** design drift (raw `bg-pink-500` Duplicate button) is a **seeded governance
  condition** landed onto this PR by `demo-injury.sh land-a` — Bugbot Autofix repairs it (Loop 1).
- The **INJURY B** a11y regression (`review.dark.fg` → `#6A4A1E`) is landed by
  `demo-injury.sh replay-b` — the CI `fix-ci` job self-heals it (Loop 2).

Build a **clean, AA-passing** feature; the governance loops are demonstrated on top of it.
