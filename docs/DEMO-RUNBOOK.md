# Demo Run-of-Show — Cursor × Adobe (101 + 201)

Two sessions, one continuous Adobe narrative, one owned repo (**Pigment** — Next.js, Supabase,
Tailwind, and Adobe React Spectrum behind a stable Pigment UI API, with shadcn/Base UI fallback,
on Vercel). 101 = board altitude (mixed room). 201 = CI/CD governance at 100+-dev scale. Full why
in `STRATEGY.md`; specific fixes in `INJURIES.md`.

Throughline: *one platform team owns Pigment; 200+ product teams consume it; keeping them
consistent, on-brand and accessible at that scale is the pain. Cursor holds that standard at
every stage of the SDLC — the rules in the editor, Bugbot on the PR, the agent in CI.*

**One piece of work carries both sessions:** the **`scheduled` campaign status**. In the 101,
Priya builds it **live in the editor** (and fixes the broken button the room walked in on) —
nothing is committed. In the 201, the *same* work re-enters as **one ticketed PR (PIG-206)**
that runs the whole outer loop: Bugbot → CI self-heal → merge → dark deploy →
**`scheduled-status`** flag release → Sentry.

---

## Pre-flight (day before + day of)

- [ ] `npm install && npm run dev` → `/campaigns` renders; toggle light/dark.
- [ ] `npm test` green on `main`; Actions enabled; **Bugbot enabled**; `CURSOR_API_KEY` repo
      secret for the CI agent job; Supabase project + env set (or leave seed data); deploy
      preview on **Vercel**.
- [ ] **Disable Bugbot AUTOFIX** (Cursor dashboard) — rehearsal-proven: with autofix on,
      Bugbot pushes its own fix commit to the PIG-206 PR ~10–15 min after the PR opens,
      stealing the live-fix beat AND rewriting the staged Scheduled diff. Bugbot *review
      comments* stay on; only the auto-push must be off.
- [ ] **Patches still apply:** `./.github/scripts/demo-injury.sh check-patches` on clean `main`
      (CI also runs this on every push to `main`). If a patch has drifted, regenerate it against
      `main` before anything else.
- [ ] **Jira/Confluence trail exists:** story **PIG-206** ("Add a scheduled campaign status")
      with acceptance criteria + the agent plan posted as a comment, linked Confluence design
      page. The 201's Plan beat shows this trail — don't skip it.
- [ ] **LaunchDarkly:** flag **`scheduled-status`** exists (envs test + production), **OFF in
      both** at start of day. `my-first-flag` stays as-is (it gates the demo card only).
- [ ] **Preview SSO bypass** for the LD demo ([`ENVIRONMENTS.md`](ENVIRONMENTS.md)): run
      `./.github/scripts/disable-preview-sso.sh` so preview URLs are public in the browser; keep
      `./.github/scripts/enable-preview-protection-bypass.sh` for CI when SSO is re-enabled
      post-demo.
- [ ] **Rehearse the 201 outer loop once end-to-end** (see the 201 section):
      `/stage-scheduled-pr` → Bugbot comments on the drift (checks green) → live fix →
      `demo-injury.sh replay-b` → red CI → `fix-ci` self-heals → optionally `tag-broken` at the
      injury commit (between-rehearsal replays only) → close the rehearsal PR WITHOUT merging.
      Between runs: **`/demo-reset`**. Guide: [`docs/DEMO-INJURIES.md`](DEMO-INJURIES.md).
- [ ] **101 start state (set this LAST, right before the room):**
      ```bash
      git checkout main && git pull --ff-only origin main
      ./.github/scripts/demo-injury.sh start-101
      ```
      That applies **INJURY A to the working tree on `main`, UNCOMMITTED** (the room opens
      broken) and verifies `scheduled` is absent from tokens/seed/migrations (the 101 needs to
      build it from scratch). Double-check by eye:
      `rg "'scheduled'" components/ui/status-tokens.ts lib/campaigns-seed.ts supabase/migrations/`
      → no hits.
- [ ] **Cloud Agent + Sentry artifacts** ([`docs/DASHBOARD-SETUP.md`](DASHBOARD-SETUP.md)):
      Cloud Agent PR artifact saved (diff, tests, screenshots); Sentry Automation rehearsed only
      if you plan to trigger it; fallback **video** of trigger → Jira → draft PR.
- [ ] Pre-bake a **fallback PR** (Bugbot comment already posted) + a screen recording of the
      201 loop, for network/timing lag.
- [ ] **Re-verify volatile facts day-of:** live Adobe stock vs 52-wk high; current Cursor
      enterprise/security claims, Bugbot specifics, and any Cloud Agent or CI execution boundary
      you plan to mention at cursor.com/docs.

---

## 101 — Kickoff (15–20 min). Open at board altitude — on a broken page.

**The room opens BROKEN.** `/campaigns` is on screen as people sit down, and the Duplicate
button on every campaign card is **magenta** — one product engineer's hardcoded `bg-pink-500`
shortcut (INJURY A, pre-applied uncommitted on `main` by `start-101`). Don't acknowledge it yet;
let it sit there through the opening hook.

**Opening hook:**
> "You're not valued on whether your software works — it's the best in the world. You're
> valued on one question your board hears every earnings call: can you out-ship Sora,
> Midjourney, Figma and Canva fast enough to defend the moat while inference costs eat the
> margin? After the Figma deal, the only lever left is organic engineering throughput. So the
> only question worth your 20 minutes: can the same engineers ship faster — and can we prove
> it in your 30-day trial? I'll also be honest about where the real decision gets made: your
> security review, not this demo. …And yes, that pink button is real. One engineer on one of
> your 200 teams shipped a shortcut. We'll fix it before the end of this session — with the
> same tool that's about to ship a feature."

1. **Why-now frame** (slide, no tool) — velocity = moat + margin defense. Invite their pressure.
2. **Ship a feature live: the `scheduled` status** — the cold open below. Priya (the platform
   engineer persona) takes a real product ask through **Ask → Tab → Plan → Agent** and sees it
   render. Output-per-engineer, on their stack. *Frame it Adobe-native:* Pigment stands in for
   an **App Builder add-on on React Spectrum** — Layer 1 is literally `@adobe/react-spectrum`
   behind the stable Pigment API. Drop the proof point: Adobe ships an official
   `@adobe/express-developer-mcp` server that feeds Adobe SDK docs into Cursor.
3. **Fix the broken page** — the magenta button, in-editor with **Cmd-K**. "One shortcut ×
   200 teams" is the hidden consistency tax; the rules/tokens are what prevent it.
4. **Legacy = the velocity tax** (slide + narrative, NO live compile) — whole-repo context +
   Agent accelerate the *incremental* C++→Rust migration Adobe chose; interop = their
   scientist's #1 friction.
5. **Governance is the real gate** — Privacy Mode/no-training wording, admin controls, repo
   rules, review gates, and the written execution boundary for any Cloud Agent or CI usage.
6. **Honest competitive frame + pilot ask** — Cursor runs Claude and supports models from
   Anthropic, OpenAI, Gemini, Cursor, and more; propose a 20-30 engineer pilot and choose the
   location with Adobe based on the metric.

### Cold open — ship `scheduled` live, then heal the page (≈8–10 min, is beats 2–3)

Climb the autonomy ladder — **Ask → Tab → Plan → Agent** — alternating *you in code* and *the
agent acting*. All live on `/campaigns`. **Nothing is committed and no PR is opened in the
101** — the work is discarded at the end (`demo-injury.sh reset`); it re-enters properly
ticketed in the 201.

| # | Who | Primitive | Do | Room sees |
|---|-----|-----------|----|-----------|
| 1 | **Agent** | **Ask** (read-only) | "How does theming + status color work here?" | it explains the token system and cites the exact files |
| 2 | **You (code)** | **Tab** | In `status-tokens.ts`, start the `scheduled:` entry | Tab completes the token shape — autocomplete that knows the file |
| 3 | **Agent → you** | **Plan** | Paste the Plan prompt; read it, approve it | a multi-file plan you gate before any code is written |
| 4 | **Agent** | **Agent** | Run the implementation prompt | tokens + seed + flag gate + two migrations land; tests go green; APJ Expansion renders **Scheduled** |
| 5 | **You → Agent** | **Cmd-K** | Fix the magenta Duplicate button in-editor | the page heals: system `<Button>` back, theming restored |

**1 — Ask (comprehension before code).** Open Ask and paste:
> @codebase how does theming, React Spectrum, and status-badge color work in this app? Where do
> the status labels, legacy color tokens, and Spectrum variants come from, and how do we keep them
> on-brand and accessible across product surfaces?

Expect it to surface `components/ui/status-tokens.ts` (`STATUS_TOKENS` + `SPECTRUM_STATUS`),
`components/ui/status-badge.tsx`, the two status-badge tests,
`.cursor/rules/design-system.mdc`, and `app/globals.css`. **No edits.**

**2 — Tab (you type).** In `components/ui/status-tokens.ts`, at the bottom of the
`STATUS_TOKENS` map, start a new line and type `scheduled:` — accept Tab's completion of the
token shape. *Teaching beat:* Tab will autocomplete **anything**, including drift — velocity
makes every change fast, so the quality bar has to live in the rules, the PR, and CI. Leave the
line half-formed; the Agent will finish the job properly in beat 4 (or let Tab's completion
stand and let the Agent correct the hex pair to an AA-passing one).

**3 — Plan (the agent proposes, you approve).** Switch to Plan mode and paste:
> Plan adding a `scheduled` campaign status, following the existing pattern: a `STATUS_TOKENS`
> entry in components/ui/status-tokens.ts that passes the WCAG contrast test in both themes,
> plus a Spectrum semantic StatusLight variant in SPECTRUM_STATUS. The status filter and labels
> derive from STATUS_TOKENS so they should update automatically. Flip the APJ Expansion seed
> campaign to scheduled, keep the Supabase enum in sync via migrations, and gate the new
> status's exposure behind our `scheduled-status` LaunchDarkly flag per the repo conventions.
> Don't write code yet — just the plan.

Expect a plan that touches the platform-owned status source, calls out the Spectrum semantic
mapping (`'info'` — note `status-badge.spectrum.test.ts` already allowlists it), the derived
filter, the **two-step enum migration** rule from the `add-migration` skill, and the flag gate.
**Read it aloud, then approve.** The checkpoint-before-code is the 101 lesson.

**4 — Agent (it ships).** Run the plan. The diff you should see (it matches
`.demo/scheduled.patch`, so rehearsal == live):
- `status-tokens.ts` — `scheduled` token pair (AA in light + dark) + `SPECTRUM_STATUS:
  'info'`; `CampaignStatus` union grows; filter options derive automatically.
- `lib/campaigns-seed.ts` — **APJ Expansion → `scheduled`**.
- `supabase/migrations/0006` (add enum value) + `0007` (backfill APJ) — the enum two-step,
  via the **`add-migration`** skill.
- The **`scheduled-status`** flag gate: flag OFF → scheduled campaigns present as before
  (draft chip, no filter entry); flag ON → real **Scheduled** chip + filter entry
  (`useFlags` in the badge + view, the same pattern as `my-first-flag`).

`npm test` green (the a11y gate now covers the new pair — flip a hex to show it fail if you
want the point made). With dev LD keys on **test**, toggle `scheduled-status` ON to show the
chip + filter appear live; toggle it back OFF.

**5 — the fix (Cmd-K, in-editor).** Select the raw `<button>` in
`components/campaigns/campaign-card.tsx`, Cmd-K:
> The Duplicate button is a raw `<button>` with a hardcoded `bg-pink-500`. Put it back on our
> design system — `<Button variant="ghost" size="sm">` with the same layout classes — per
> `.cursor/rules/design-system`.

The page heals on save. Close the loop verbally: "In session two you'll see what happens when
this drift tries to get past the **PR** instead — the review gate catches what the editor
missed." *(No push, no PR, no Bugbot in the 101.)*

**Reset (after the room):** `./.github/scripts/demo-injury.sh reset` — restores the injury
file, the Scheduled diff, and deletes the two migrations; `verify baseline` confirms
`scheduled` is gone.

**Bridge:** "Next session: this exact feature comes back as a ticket, and you'll watch the
pipeline — not the presenter — hold the standard."

---

## 201 — Deep dive (20 min). SDLC at 100+-dev scale; CI/CD is the hero.

**The spine: one ticketed PR carries the whole loop.** Before the room, **`/stage-scheduled-pr`**
cut branch **`PIG-206`** from clean `main` and opened the PR: the Scheduled implementation
(`.demo/scheduled.patch`) **plus the INJURY A drift** (`.demo/injury-a.patch`) in one commit —
*Priya missed it*. Checks are green (drift isn't a test failure); **Bugbot has already
commented on the drift** by the time you present.

**Opening hook:**
> "Your own AEM docs already list Cursor, Claude Code and Copilot and ship AGENTS.md + MCP
> servers — so you've answered whether AI belongs in your pipeline. The question is where it
> inserts. Your platform team owns a design system; 200 product teams consume it. No human
> review team reads every PR at that scale. So the pull request is your highest-impact
> control point — and we don't replace Jenkins or Spinnaker, we author and review the commit
> that flows into them. Two insertions: the PR, and the CI job."

1. **Map to the pipeline — the LOOP, not a line** (diagram; see [`PIPELINE.md`](PIPELINE.md)):
   **Jira** ticket → **Cursor** editor → **PR + Bugbot** → **GitHub Actions + Cursor CLI
   agent** → **Vercel** (preview + auto prod, **dark**) → **LaunchDarkly** human gate → **Sentry**
   fallback → next Jira ticket. Human owns PR merge and LD prod rollout — not Vercel promote.
2. **Plan: the ticket trail** — open **PIG-206** in Jira: acceptance criteria (statuses derive
   from `STATUS_TOKENS`; AA both themes; semantic Spectrum variant; behind `scheduled-status`,
   OFF in prod; enum two-step migrations staging-first), the **agent's plan posted back as a
   comment**, the linked Confluence design page. "Session one you watched this get built at a
   desk; here's the same work entering the system of record."
3. **Bugbot as the governance gate** — open the staged PR. Bugbot's comment is already on the
   drift: the raw `bg-pink-500` button, flagged against the platform standard (`.cursor/BUGBOT.md`
   — Bugbot reviews from that root+nested file plus dashboard/learned rules, the same standard
   the editor rule encodes). **Fix it live**: Cmd-K on `campaign-card.tsx` (same prompt as the
   101), commit, push. Checks stay green. "The engineer missed it, the reviewer-bot didn't —
   before a human spent a minute."
4. **Cursor CLI agent in CI — the red build heals itself** — land INJURY B as a follow-up
   commit **on top of HEAD**:
   ```bash
   ./.github/scripts/demo-injury.sh replay-b && git push
   ```
   (**Never** `reset-branch-b`/force-push mid-room — the tip must never move backwards or the
   fix you just pushed is gone.) `check` goes **red**: *StatusBadge "review" meets WCAG AA in
   dark mode* fails at ~1.7:1. The `fix-ci` job calls `agent -p --force`, restores a passing
   token, **commits to the same PR**, and comments its diagnosis. Green-build time + MTTR.
   *Rehearsal note:* the fix commit lands via `GITHUB_TOKEN`, so the workflow re-dispatches
   the required `check` on it automatically (green in ~1 min). GitHub may also show one
   **"workflow awaiting approval"** run on the fixed commit — click **Re-run** on it (or
   `gh run rerun <id>`) before the merge beat; it's a bot-push artifact, not a failure.
   What the room sees on the preview: **nothing broken** — the rendered chip is the Spectrum
   `StatusLight` (semantic, structurally AA); the regression lives in the SSR-fallback hex map
   and is caught **by CI**, not by eyeballs. That's the point: gates catch what screens don't.
5. **Merge + dark deploy** — human merges PIG-206 (the one injury-carrying branch that ever
   merges — both injuries are fixed on it by now). Vercel auto-deploys production **dark**:
   `scheduled-status` is OFF in prod, so APJ Expansion still presents as draft and there's no
   Scheduled filter entry. "Deploy ≠ release."
6. **Release: `/release-flag scheduled-status`** — toggle ON in LD **test**, verify the
   Scheduled chip + filter on the preview URL; then the human gate: ON in **production** —
   the chip and filter entry appear live on the prod URL. Instant rollback = flag OFF (kill
   switch). Narrate Enterprise options: guarded rollouts, approvals.
7. **Close the loop with Sentry (LIVE optional + fallback)** — trigger `/sentry-example-page`
   or `/api/sentry-example-api?demo=1` → Sentry **issueCreated** → Cursor Automation → new
   **PIG-*** Jira story + **draft PR** (human merge). Narrate while Automation runs (~2–3 min);
   cut to pre-recorded fallback if timing fails. Manual replay: **`/sentry-incident`**. Spec:
   [`SENTRY-AUTOMATION.md`](SENTRY-AUTOMATION.md).
7b. **Cloud Agent path (artifact)** — show the **`/cloud-ticket`** PR you dispatched before the
   room: branch, diff, test result, and browser screenshots on `/campaigns`. See
   [`CLOUD-AGENTS.md`](CLOUD-AGENTS.md). Do not wait for a live dispatch.
8. **Governance + model optionality** — repo rules, review gates, audit, allow-lists, Privacy
   Mode/no-training wording, and model support from Anthropic, OpenAI, Gemini, Cursor, and more.
   Document any Cloud Agent or CI execution boundary before the pilot rather than improvising it.
9. **Baseline on Adobe's yardstick** — co-build the 30-day plan vs their DORA dashboard.
   Anchor: Sarkar ~39% more PRs, flat reverts. Every outcome = a hypothesis to baseline.

### Post-201 reset (the merge was real — undo it honestly)

Tag `main` as **`pre-201`** before a full rehearsal or the room
(`git tag pre-201 origin/main`). Afterwards:
1. **Revert the Scheduled merge on `main`** via a revert commit — PR the revert if you have
   time, never `git reset --hard` on `main`. The `check-patches` drift gate stands down while
   `scheduled` is on `main` and re-arms once the revert lands.
2. **Flags OFF** in both LD envs (`scheduled-status`).
3. **Staging Supabase:** revert the 0007 backfill (`update public.campaigns set status =
   'draft' where name = 'APJ Expansion';`). Postgres can't drop enum values — leaving
   `'scheduled'` in the staging enum between rehearsals is acceptable and additive.
Details: [`DEMO-INJURIES.md`](DEMO-INJURIES.md#post-201-reset).

---

## The two injuries in one line each (see `docs/INJURIES.md` for diffs + prompts)

- **A — Bugbot:** `components/campaigns/campaign-card.tsx`, Duplicate button → raw `<button>`
  with `bg-pink-500` → fix to `<Button variant="ghost">`. *(101: the room walks in on it;
  201: it rides the PIG-206 PR and Bugbot catches it.)*
- **B — Cursor CLI agent in CI:** `components/ui/status-tokens.ts`, `review.dark.fg` →
  `#6A4A1E` contrast fail → CI red → agent restores AA. *(Rendered UI stays fine — Spectrum
  semantic variants; the drift is CI-visible in the SSR-fallback hex map.)*

---

## Say THIS, not THAT (you're presenting to Cursor's own Head of FE)
| Don't | Do |
|---|---|
| "Cursor is cloud-only / no on-prem" | Verify the exact Cloud Agent or CI execution boundary in writing |
| Quote CMEK | Drop unless confirmed in current docs day-of |
| brittle YTD stock % | "~50% off its 52-week high" / live quote |
| "18-year CEO exit" | "CEO since 2007, moving to executive chair" |
| "70% of Adobe's vulns are memory-safety" | Industry data Adobe *cites*, not their codebase |
| CVE-2026-34621 in the Rust story | CVE-2025-54257 (real Acrobat use-after-free) |
| claim in-region data residency | honest DPDP discovery + Privacy Mode/admin controls + written data flow |
| imply Adobe already uses Cursor | net-new; peer proof = NVIDIA, Stripe/Salesforce |
| "we're more secure / better model" than Claude Code | concede it's excellent; differentiate on IDE-native + control plane + model optionality |
| "Bugbot reads `.cursor/rules`" | Bugbot reviews from `.cursor/BUGBOT.md` (root + nested) + dashboard/learned rules — the same standard the editor rules encode |
