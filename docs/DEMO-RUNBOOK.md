# Demo Run-of-Show — Cursor × Adobe (101 + 201)

Two sessions, one continuous Adobe narrative, one owned repo (**Pigment** — Next.js + Supabase
+ Tailwind + shadcn + Base UI on Vercel). 101 = board altitude (mixed room). 201 = CI/CD
governance at 100+-dev scale. Full why in `STRATEGY.md`; specific fixes in `INJURIES.md`.

Throughline: *one platform team owns Pigment; 200+ product teams consume it; keeping them
consistent, on-brand and accessible at that scale is the pain. Cursor holds that standard at
every stage of the SDLC — the rules in the editor, Bugbot on the PR, the agent in CI.*

---

## Pre-flight (day before + day of)
- [ ] `npm install && npm run dev` → `/campaigns` renders; toggle light/dark.
- [ ] `npm test` green on `main`; push to a **private GitHub repo**; Actions enabled; **Bugbot
      enabled**; `CURSOR_API_KEY` repo secret for the CI agent job; Supabase project + env set
      (or leave seed data); deploy preview on **Vercel**.
- [ ] **Preview SSO bypass** for LD demo ([`ENVIRONMENTS.md`](ENVIRONMENTS.md)): run
      `./.github/scripts/disable-preview-sso.sh` so preview URLs are public in the browser; keep
      `./.github/scripts/enable-preview-protection-bypass.sh` for CI when SSO is re-enabled
      post-demo.
- [ ] Rehearse both **injuries** (`docs/INJURIES.md`) — **`/rehearse-injury-a`** and
      **`/rehearse-injury-b`**; confirm Bugbot on INJURY A and `fix-ci` on INJURY B. Between
      runs: **`/demo-reset`**. Guide: [`docs/DEMO-INJURIES.md`](DEMO-INJURIES.md).
- [ ] **Cloud Agent + Sentry Automation** ([`docs/DASHBOARD-SETUP.md`](DASHBOARD-SETUP.md)):
      VM snapshot saved; Sentry Automation enabled (`SentryExampleAPIError` filter); Atlassian +
      Sentry MCP authenticated in dashboard; fallback **video** of trigger → Jira → draft PR.
- [ ] Pre-bake a **fallback PR** (Bugbot comment already posted) + a screen recording of the
      201 loop, for network/timing lag.
- [ ] **Re-verify volatile facts day-of:** live Adobe stock vs 52-wk high; current Cursor
      enterprise/security claims (self-hosted boundary, Bugbot specifics) at cursor.com/docs.

---

## 101 — Kickoff (15–20 min). Open at board altitude.
**Opening hook:**
> "You're not valued on whether your software works — it's the best in the world. You're
> valued on one question your board hears every earnings call: can you out-ship Sora,
> Midjourney, Figma and Canva fast enough to defend the moat while inference costs eat the
> margin? After the Figma deal, the only lever left is organic engineering throughput. So the
> only question worth your 20 minutes: can the same engineers ship faster — and can we prove
> it in your 30-day trial? I'll also be honest about where the real decision gets made: your
> security review, not this demo."

1. **Why-now frame** (slide, no tool) — velocity = moat + margin defense. Invite their pressure.
2. **Throughput, live on Pigment** — open `/campaigns`. Ask the codebase "how does theming
   work here?", then have Agent add/fix a component; **see it render**. Output-per-engineer.
   *Frame it Adobe-native:* Pigment stands in for an **App Builder add-on on React Spectrum** —
   and Layer 1 is now literally `@adobe/react-spectrum` behind the stable Pigment API (the default
   design system, rendered client-only). Drop a proof point: Adobe ships an official
   `@adobe/express-developer-mcp` server that feeds Adobe SDK docs into Cursor — "you already
   built the Adobe-specific version of the grounding you just watched."
3. **Consistency at scale = the hidden tax** — apply **INJURY A** (magenta Duplicate button).
   "One shortcut × 200 teams." Show the rules/tokens that prevent it. *(Run beats 2–3 as the
   hand-typed **Cold open** below — you drive the primitives and type the injury yourself.)*
4. **Legacy = the velocity tax** (slide + narrative, NO live compile) — whole-repo context +
   Agent accelerate the *incremental* C++→Rust migration Adobe chose; interop = their
   scientist's #1 friction.
5. **Governance is the real gate** — Privacy Mode, ZDR, audit, AI Code Tracking, allow-lists,
   self-hosted cloud agents. Speak Firefly/Acrobat provenance language.
6. **Honest competitive frame + pilot ask** — Cursor runs Claude + GPT + Gemini in the IDE;
   propose an India-seated pilot; name the discovery questions.

### Cold open — drive the primitives, then break it yourself (≈6–8 min, expands beats 2–3)

Climb the autonomy ladder — **Tab → Ask → Plan → Agent** — and deliberately alternate *you in
code* and *the agent acting*, so the room sees a human **and** the tool do real work. All live on
`/campaigns`; nothing here is committed — discard the edits after.

| # | Who | Primitive | Do | Room sees |
|---|-----|-----------|----|-----------|
| 1 | **You (code)** | **Tab** | In `status-tokens.ts` `STATUS_TOKENS`, start a new `archived:` entry | Tab completes the token shape — autocomplete that knows the file |
| 2 | **Agent** | **Ask** (read-only) | Paste the Ask prompt | it explains the token system and cites the exact files |
| 3 | **Agent → you** | **Plan** | Paste the Plan prompt; read, don't run | a multi-file plan you approve — it plans before it touches anything |
| 4 | **You (code)** | typing | Replace the Duplicate `<Button>` with the raw snippet | a magenta button on every card — off-system, on purpose |
| 5 | **Agent** | **Agent / Bugbot** | Hand it the fix prompt, or push for Bugbot | it rewrites it back to the system component, citing the rule |

**1 — Tab (you type).** `components/ui/status-tokens.ts`, in the `STATUS_TOKENS` map —
start a new line and type `archived:`, accept Tab's completion:
```ts
export const STATUS_TOKENS: Record<
  CampaignStatus,
  { label: string; light: { bg: string; fg: string }; dark: { bg: string; fg: string } }
> = {
  draft: { label: 'Draft', light: { bg: '#EDEDEA', fg: '#44443F' }, dark: { bg: '#26262F', fg: '#B9B9B2' } },
  live: { label: 'Live', light: { bg: '#DCF5E4', fg: '#0F6B33' }, dark: { bg: '#14331F', fg: '#57D98A' } },
  review: { label: 'In review', light: { bg: '#FFF1D6', fg: '#8A4B00' }, dark: { bg: '#3A2A12', fg: '#E0A24E' } },
  archived:   // ← type "archived:"  →  Tab fills in the token entry
};
```
*Teaching beat:* Tab will autocomplete **anything**, including drift — that's the setup. Velocity
makes every change fast, so the quality bar has to live in the rules, the PR, and CI (exactly where
this cold-open lands). Discard the line after.

**2 — Ask (read-only; the agent explains).** Open Ask and paste:
> @codebase how does theming and status-badge color work in this app? Where do the status colors
> come from, and how do we keep them on-brand and accessible across surfaces?

Expect it to surface `components/ui/status-tokens.ts` (`STATUS_TOKENS` + `SPECTRUM_STATUS`),
`app/globals.css` (indigo `--primary` + tokens), `.cursor/rules/design-system.mdc`, and the contrast
gate `components/ui/status-badge.test.ts`. **No edits — this is comprehension before code.**

**3 — Plan (the agent proposes, you approve).** Switch to Plan mode and paste:
> Plan adding an `archived` status to the StatusBadge, following the existing pattern: a token in
> `components/ui/status-tokens.ts` that passes the WCAG contrast test, plus a Spectrum semantic
> `StatusLight` variant in `SPECTRUM_STATUS`. The status filter and labels derive from
> `STATUS_TOKENS`, so they update automatically; the existing contrast test covers the new status.
> Don't write code yet — just the plan.

Expect a **single-file** plan: only `components/ui/status-tokens.ts` (extend `CampaignStatus`, add
the `archived` light/dark token + `SPECTRUM_STATUS.archived`). TypeScript *forces* both
`Record<CampaignStatus, …>` maps, and the status filter + labels **derive** from `STATUS_TOKENS`, so
they propagate with nothing to forget; `status-badge.test.ts` auto-covers the new status. **Read it
and stop** — the point is *"it plans before it touches anything,"* and the nice tell is *one* file
fans out to the whole surface. *(Known-AA values if you want to pre-stage: light `#E7E9EC`/`#3A4250`,
dark `#2B313B`/`#A9B2C0`, Spectrum `neutral`. No seed campaign is `archived`, so the filter shows the
empty state unless you flip one in `lib/campaigns-seed.ts`.)* This is the real **PIG-11 / PIG-204**
ticket — run it end-to-end in the 201 for the full Plan → Code → Review → CI loop.

**4 — the injury (you type it).** In `components/campaigns/campaign-card.tsx`, replace:
```tsx
<Button variant="ghost" size="sm" className="h-11 w-full sm:h-8 sm:w-auto">
  Duplicate
</Button>
```
with the off-brand version (verbatim `.demo/injury-a.patch`, so the rehearsal matches what you type
live):
```tsx
<button className="h-11 w-full rounded-md bg-pink-500 px-2.5 text-[0.8rem] font-medium text-white hover:bg-pink-600 sm:h-8 sm:w-auto">
  Duplicate
</button>
```
You didn't tweak a variant — you **abandoned the system component** and hand-styled a raw `<button>`
with a literal color. It won't theme, it clashes with the indigo brand, and `npm test` stays
**green** (no test catches a design-token violation — only review does). Now Layer 1 is React
Spectrum, you can't even put that class on a system `<Button>`, so going off-brand means leaving the
component entirely — a louder smell.

**5 — the fix (the agent does it).** Push and let **Bugbot** comment on the PR (it cites
`.cursor/rules/design-system.mdc` / `.cursor/BUGBOT.md`), then hand that to the Agent — or fix it in
the editor with **Cmd-K**:
> The Duplicate button in `components/campaigns/campaign-card.tsx` is a raw `<button>` with a
> hardcoded `bg-pink-500`. Put it back on our design system — `<Button variant="ghost" size="sm">`
> with the same layout classes — per `.cursor/rules/design-system`.

**Reset:** discard the edits, or `/reset-injuries` (works off `main` once this lands; on a feature
branch use `git apply --reverse .demo/injury-a.patch`). Keep `.demo/injury-a.patch` as your
rehearsal/fallback if you'd rather not type it live.

**Bridge:** "Next session: how this holds the line across hundreds of engineers in your pipeline."

---

## 201 — Deep dive (20 min). SDLC at 100+-dev scale; CI/CD is the hero.
**Opening hook:**
> "Your own AEM docs already list Cursor, Claude Code and Copilot and ship AGENTS.md + MCP
> servers — so you've answered whether AI belongs in your pipeline. The question is where it
> inserts. Your platform team owns a design system; 200 product teams consume it. No human
> review team reads every PR at that scale. So the pull request is your highest-impact
> control point — and we don't replace Jenkins or Spinnaker, we author and review the commit
> that flows into them. Two insertions: the PR, and the CI job."

1. **Map to the pipeline — the LOOP, not a line** (diagram; see [`PIPELINE.md`](PIPELINE.md)):
   **Jira** ticket → **Cursor** (Plan→Agent or **`/cloud-ticket`** Cloud Agent, **behind LD flag**) →
   **`/review-bugbot`** → **PR + Bugbot** → **GitHub Actions + `cursor-agent`** → **Vercel**
   (preview + auto prod, **dark**) → **`/release-flag`** → **Sentry Automation** → next Jira ticket.
   Human owns PR merge and LD prod rollout — not Vercel promote.
2. **Plan: pull the ticket** — the Atlassian MCP brings the Jira ticket + acceptance criteria
   **and its linked Confluence design doc** into the agent; the agent posts its plan back as a
   comment. Flex: this whole backlog + the Confluence docs were authored by Cursor as it built
   Pigment (see [`PLAN.md`](PLAN.md)) — the Plan stage is real history, not a mockup.
3. **Bugbot as the governance gate** — optionally show **`/review-bugbot`** catching INJURY A
   before push; LIVE on PR: open a PR with **INJURY A** on `components/campaigns/campaign-card.tsx`.
   Bugbot comments, cites `.cursor/BUGBOT.md` / design-system rules, BEFORE the human + CI gate.
4. **`cursor-agent` headless in CI — fix the red build** — LIVE: open a PR with **INJURY B** on
   `components/ui/status-tokens.ts` (the "In review" chip). `npm test`/CI goes red; the
   `cursor-agent` job reads the failing test, restores a passing token, comments the PR —
   fenced by `guard-shell.sh` (denies git + .env writes in CI, fail-open); the hard stop is the
   required `check` ruleset + the workflow's own commit step. Green-build time + MTTR.
4b. **Flag-driven release (`/release-flag`)** — show `my-first-flag` on `/campaigns`. Merge ships
   code **dark** (prod flag OFF). Toggle ON in LD **test** on preview; then narrate prod rollout
   via LaunchDarkly MCP. Instant rollback = flag OFF (kill switch).
5. **Close the loop with Sentry (LIVE optional + fallback)** — trigger `/sentry-example-page` or
   `/api/sentry-example-api?demo=1` → Sentry **issueCreated** → Cursor Automation → new **PIG-***
   Jira story + **draft PR** (human merge). Narrate while Automation runs (~2–3 min); cut to
   pre-recorded fallback if timing fails. Manual replay: **`/sentry-incident`**. Spec:
   [`SENTRY-AUTOMATION.md`](SENTRY-AUTOMATION.md).
5b. **Cloud Agent path (optional)** — narrate **`/cloud-ticket`** on PIG-204: parallel VM authoring,
   browser self-verify with screenshots on `/campaigns`. See [`CLOUD-AGENTS.md`](CLOUD-AGENTS.md).
6. **Governance + model optionality** — AI Code Tracking, audit, allow-lists, Privacy Mode;
   routes Anthropic + OpenAI + Gemini; self-hosted cloud agents in-VPC for sensitive repos.
7. **Baseline on Adobe's yardstick** — co-build the 30-day plan vs their DORA dashboard.
   Anchor: Sarkar ~39% more PRs, flat reverts. Every outcome = a hypothesis to baseline.

---

## The two specific fixes (see `docs/INJURIES.md` for exact diffs + prompts)
- **A — Bugbot:** `components/campaigns/campaign-card.tsx`, Duplicate button → `bg-pink-500`
  hardcoded → fix to `<Button variant="ghost">`. *(visible: magenta button on `/campaigns`)*
- **B — `cursor-agent` in CI:** `components/ui/status-tokens.ts`, `review.dark.fg` →
  contrast fail → fix the token to clear AA *(legacy flag-OFF path; Spectrum semantic variants
  make it structurally impossible)*. *(visible: unreadable "In review" chip in dark mode)*

---

## Say THIS, not THAT (you're presenting to Cursor's own Head of FE)
| Don't | Do |
|---|---|
| "Cursor is cloud-only / no on-prem" (FALSE) | Self-hosted cloud agents in-VPC = a strength |
| Quote CMEK | Drop unless confirmed in current docs day-of |
| brittle YTD stock % | "~50% off its 52-week high" / live quote |
| "18-year CEO exit" | "CEO since 2007, moving to executive chair" |
| "70% of Adobe's vulns are memory-safety" | Industry data Adobe *cites*, not their codebase |
| CVE-2026-34621 in the Rust story | CVE-2025-54257 (real Acrobat use-after-free) |
| claim in-region data residency | honest DPDP discovery + Privacy Mode/ZDR/in-VPC |
| imply Adobe already uses Cursor | net-new; peer proof = NVIDIA, Stripe/Salesforce |
| "we're more secure / better model" than Claude Code | concede it's excellent; differentiate on IDE-native + control plane + model optionality |
