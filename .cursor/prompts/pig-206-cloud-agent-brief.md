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

## Deterministic execution plan — touch exactly these files, in this order (do NOT scan the repo)

The status system has ONE source of truth (`components/ui/status-tokens.ts`); everything else
derives from it or gates off it. **Mirror the shipped `archived` status (PIG-204)** — it is your
worked example. Adding `scheduled` is **6 files + 2 migrations, no more.** Do not explore other
directories to "understand the codebase" — this map is the codebase for this task.

**Read first (your pattern — read only these, not the wider repo):**
- `components/ui/status-tokens.ts` — study the `archived` entry in `STATUS_TOKENS` + `SPECTRUM_STATUS`
  and the `CampaignStatus` union; you add `scheduled` the same way. `STATUS_FILTER_OPTIONS` /
  `CAMPAIGN_STATUSES` are **derived here** — you never hand-edit a filter list.
- `components/campaigns/first-flag-demo.tsx` — the `useFlags()` gate pattern (`my-first-flag`); you
  mirror it for `scheduled-status`. The LD provider camelCases keys
  (`useCamelCaseFlagKeys: true`), so the flag `scheduled-status` reads as `scheduledStatus`.
- `.cursor/skills/add-migration/SKILL.md` + `supabase/migrations/0004_campaign_status_archived.sql`
  + `0005_archive_enterprise_onboarding.sql` — the enum two-step you mirror as 0006/0007.

**Then edit, in this order:**
1. `components/ui/status-tokens.ts` — (a) `CampaignStatus` union `+ 'scheduled'`; (b) a `scheduled`
   entry in `STATUS_TOKENS` with an **on-brand blue** AA pair in both themes (a known-good pair:
   light `{ bg: '#E0EEF9', fg: '#0C447C' }`, dark `{ bg: '#152C42', fg: '#7EC8F2' }` — both clear
   4.5:1); (c) widen the `SPECTRUM_STATUS` value type with `'info'` and add `scheduled: 'info'`.
   **Do not** touch `review` or any other token, and **do not** hand-add `scheduled` to
   `STATUS_FILTER_OPTIONS` / `CAMPAIGN_STATUSES` — those derive from `STATUS_TOKENS`, so your one
   entry propagates automatically. (Editing `status-filter.tsx` in step 3 is the *component*, not
   this derived list — that edit is still required.)
2. `components/ui/status-badge.tsx` — add `const { scheduledStatus } = useFlags()`; compute
   `const shown = status === 'scheduled' && !scheduledStatus ? 'draft' : status`; render with
   `shown` on BOTH the Spectrum and SSR-fallback paths.
3. `components/campaigns/status-filter.tsx` — accept an optional `options` prop defaulting to
   `STATUS_FILTER_OPTIONS`; render the list from `options`.
4. `components/campaigns/campaigns-view.tsx` — `useFlags()`; `statusOptions` drops `'scheduled'`
   when the flag is off; remap `scheduled → draft` for filtering when off; reset the selected
   filter if it was `scheduled` and the flag turns off; pass `options={statusOptions}` to `StatusFilter`.
5. `lib/campaigns-seed.ts` — flip **APJ Expansion** (id `c3`) `status: 'draft' → 'scheduled'`;
   update its sync comment to name 0007.
6. Migrations via the **`add-migration`** skill: `0006_campaign_status_scheduled.sql`
   (`alter type campaign_status add value if not exists 'scheduled';`) then
   `0007_schedule_apj_expansion.sql` (`update public.campaigns set status = 'scheduled' where name = 'APJ Expansion';`).

**Your oracle — run, don't guess:** `npm run typecheck && npm test`. `status-badge.test.ts` checks
your new pair clears AA in both themes; `status-badge.spectrum.test.ts` checks the Spectrum mapping
stays semantic. Only iterate the hex if AA fails.

**Do NOT:** scan other directories; edit any test (the a11y + spectrum tests iterate the tokens,
so `scheduled` is auto-covered — adding one is wasted work and weakening one is forbidden); touch
other statuses/tokens; hand-add your status to the derived `STATUS_FILTER_OPTIONS`/`CAMPAIGN_STATUSES`;
or author a new component (reuse `@/components/ui`).

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
