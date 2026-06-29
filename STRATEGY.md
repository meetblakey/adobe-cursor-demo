# Cursor × Adobe — Field Engineer Demo Strategy (101 + 201)

> **The one rule:** Sell TO Adobe, not your knowledge of Cursor. Every beat opens on an
> Adobe problem and a board metric, shows the minimum tool needed, then states the
> so-what as a number. Features only ever appear in service of a named Adobe problem.

## Thesis

Adobe (mid-2026) is being valued by Wall Street on one question — *can you out-ship AI
rivals to defend the creative moat and the ~47% margin?* The bottleneck is engineering
throughput against a 78M-line, decades-old C++ estate and a sprawling Java/AEM cloud
stack. **Cursor is the governed, model-agnostic control plane that lets Adobe's existing
(India-heavy) engineers ship AI features and modernize legacy code measurably faster —
without their source code training anyone else's model.**

## Why now (board altitude — confirmed facts)

- Stock **~50% off its 52-week high**; market cap retreated toward ~$100B.
- **CEO Shantanu Narayen (since 2007) transitioning to executive chair** (March 2026);
  investors fatigued with "conservative guidance in the face of hyper-competition."
- **Cost of subscription revenue growing FASTER than revenue (~13% vs ~11–12%)** — Firefly
  GPU inference squeezing the ~47% non-GAAP operating margin (target ~45.5–46%).
- **$1B Figma breakup fee paid, deal dead** → organic R&D throughput is the only lever left.
- **$5B+ AI-influenced ARR** — the growth narrative depends on shipping AI features first.
- Adobe is **simultaneously trialing Claude Code** → the frame is *governed enterprise
  control + CI fit*, NOT "AI vs no-AI."

## The five Adobe problems → Cursor business case

### 1. Moat/margin squeeze (CONFIRMED)
Must ship defensible AI features faster at lower engineering cost-per-feature to defend the
margin and the $5B AI book, under a flat-headcount mandate.
- **Cursor:** raises throughput-per-engineer on the AI roadmap; cuts the *labor* side of
  cost-to-serve (can't cut GPU cost). Agent/Composer, whole-codebase context, Tab, admin
  dashboard to prove the gain.
- **Metric:** PRs/eng/wk, feature cycle time, cost-per-feature — baselined on Adobe's **own
  DORA** dashboard. Neutral anchor: U. Chicago (Sarkar) **~39% more PRs merged, flat revert
  rate**.
- **Pre-empt:** "AI just generates more code to review (slop)" → flat-revert-rate finding +
  co-build the number on Adobe's baseline, not a vendor stat.

### 2. 78M-line C++ legacy modernization (CONFIRMED: incremental, not rewrite)
Photoshop / Acrobat Core PDF / Premiere / After Effects / Substance. Adobe **publicly
committed to incremental Rust/Swift over a risky rewrite**; their own scientist (David
Sankel, Aug 2025) named **C++/Rust interop as the #1 friction** — not Rust itself.
- **Cursor:** whole-repo context to understand un-authored subsystems, write FFI/binding
  boilerplate, keep Rust modules in sync with C++ headers, generate characterization tests.
  Rules/AGENTS.md to enforce per-team C++ "dialects." **Accelerates the path Adobe already
  chose — never pitch a rewrite they rejected.**
- **Metric:** time-to-first-safe-commit for new/rotated engineers; migration throughput.
- **Pre-empt:** "Don't tell us to rewrite" → "we accelerate your incremental, interop-heavy
  path"; name interop as their own stated #1 friction.

### 3. Memory-safety CVE burden (CONFIRMED)
Real example: **CVE-2025-54257 — use-after-free in Acrobat Reader** → Patch-Tuesday /
emergency releases / reviewer interrupts across 80M+ desktop MAU.
- **Cursor:** Bugbot reviews every PR semantically with cross-file context, encoding
  secure-coding via `.cursor/rules`, catching the bug class *before* it merges and becomes a
  CVE. Complements both sides — find latent C++ bugs AND author the Rust replacement.
- **Metric:** escaped-defect / CVE rate, time-to-remediate, reviewer interrupt load.
- **Pre-empt:** "Our security review gates everything" → Bugbot is an automated SPLC
  *pre-check* LEFT of the human and Jenkins gate, never a replacement. Discover their
  mandatory PR-stage checks first.
- **ATTRIBUTION CARE:** the "70% of critical C/C++ vulns are memory-safety" figure is
  INDUSTRY data Adobe *cites*, not a measurement of Adobe's codebase. Do **NOT** use
  CVE-2026-34621 here — it is prototype-pollution/JS, not memory-safety.

### 4. Ungoverned AI-tool sprawl at ~31k-engineer scale
Adobe's own job posts list **Cursor + Claude Code + Copilot side by side**; AEM docs name
all three and ship `AGENTS.md` + MCP servers. Source code is crown-jewel IP — institutional
memory includes the **2013 breach** (Acrobat/Photoshop/ColdFusion source stolen).
- **Cursor:** the governed control plane — org-wide Privacy Mode (no training), ZDR posture,
  embeddings-only indexing (vector DB never sees raw code), SOC 2 Type II, SSO/SAML + SCIM,
  audit logs, per-commit **AI Code Tracking**, model/MCP/repo allow-lists. For the most
  sensitive repos, **self-hosted cloud agents keep code + build inside Adobe's VPC**
  (outbound-only HTTPS, AWS PrivateLink).
- **Metric:** % of AI usage under policy/audit; N tools → 1; "how much AI-generated code
  ships in our binaries" becomes answerable.
- **Pre-empt:** "Claude Code is also secure" → **concede it's true** (SOC2 II, ISO
  27001/42001, ZDR, SSO). Differentiate on IDE-native unified surface + model optionality +
  admin instrumentation. Do NOT claim "we're the secure one."
- **CONFIDENCE:** sprawl-is-ungoverned is INFERRED → assert Adobe's own published policy as
  the mirror, then ASK what governs source code reaching model endpoints. Don't allege an
  active exposure.

### 5. Distributed India-heavy org (CONFIRMED)
~50% of ~31,360 employees international; **India 8,000+ engineers since 1997, "more than a
third of innovation," new Noida campus 2026.** 8,000+ miles from US product leadership.
- **Cursor:** grounded explanations of unfamiliar legacy modules cut handoff friction;
  Rules/AGENTS.md enforce local conventions; deploy as a **regionally-owned Noida/Bangalore
  pilot**.
- **Single-sponsor advantage:** **Abhigyan Modi holds BOTH Country Manager–Adobe India AND
  SVP Document Cloud** → the C++/PDF pain and the India org report to one exec.
- **Metric:** time-to-first-merged-PR for new India hires; review churn from convention drift.
- **Pre-empt:** "Data residency / DPDP" → don't bluff a region story (Cursor publishes none);
  lead with Privacy Mode + ZDR + repo blocklist + self-hosted-in-VPC; convert residency to
  honest discovery + written roadmap follow-up.

## Artifact decision — OWN A VISUAL SHOWPIECE (final)

Build and **own** a small, visual demo repo — **`Pigment`**, a design system consumed by
"200+ product surfaces" — and own the CI/CD around it. Do NOT demo on Adobe's react-spectrum
(you'd be a tourist with no control over the SDLC story) and do NOT build a complex repo (the
point is *pain↔solution made visible*, not code complexity).

**Adobe-native framing (the Floor).** Present Pigment as a deliberate **stand-in for an Adobe
App Builder add-on built on React Spectrum** — same shape as an internal Adobe surface, scaled
down so we run the whole governed pipeline live. Back it with three *verified* proof points (re-
verify day-of): Adobe's official **`@adobe/react-spectrum`** design system; the **`@adobe/express-developer-mcp`**
server that feeds Adobe SDK docs into Cursor; and Adobe GPM **Ruben Rincon's** Oct-2025 write-up
on building an Express add-on in Cursor. Keep the "imagine / stands in for" guardrail — Pigment's
runtime is Next.js + Vercel, *not* App Builder. **The Upgrade (Part B) makes this literal where it
counts:** Layer 1 *is* now `@adobe/react-spectrum` behind the stable Pigment API, the default
design system in production (no flag, client-only after hydration) so the owned Vercel/CI/Bugbot/LaunchDarkly pipeline is
unchanged — we kept SDLC control *and* stopped being a tourist on the design system itself. See
[`docs/PLAN-ADOBE-NATIVE-FRAMING-AND-SPECTRUM.md`](docs/PLAN-ADOBE-NATIVE-FRAMING-AND-SPECTRUM.md).

Why this wins all four constraints:
- **Visual & understood** — UI renders; a magenta button in an indigo system, or unreadable
  dark-mode text, reads in one second to execs and engineers alike.
- **You own repo + CI/CD** — full SDLC + governance plane to show (rules, CODEOWNERS, Bugbot,
  `cursor-agent` in CI).
- **100+-dev workflow** — "one platform team owns the system, 200 product teams consume it" is
  literally how Adobe runs Spectrum and AEM; the scale story is built into the model.
- **Simple code** — ~5 components + a token file. Complexity lives in the *workflow*.

| Session | What runs live | The point |
|---|---|---|
| **101** | the Pigment **product surface** (visual inner loop) | a dev adds/fixes a component; see it render right, fast |
| **201** | the **SDLC at scale** (PR → Bugbot → `cursor-agent` in CI) | governance for 100+ devs no human review team can match |
| **AEM/Java** | **talk-track reference only** | "your own AEM docs ship AGENTS.md + MCP and name Cursor" — verbal home-turf proof |
| **C++/Rust** | **strategic narrative only** | confidential + fragile to compile on stage |

Repo: `~/Documents/adobe-cursor-demo` — **Next.js 16 (App Router) + Tailwind v4 + shadcn +
Base UI + Supabase, deploy on Vercel** (user owns the config). `components/ui/*` =
platform-owned design system; `app/campaigns/` + `components/campaigns/*` = a product team's
surface; `components/ui/status-badge.test.ts` = the WCAG AA gate. Seeded regressions in
`docs/INJURIES.md` are **specific** (named file + component + variant + exact diff + the exact
Cursor prompt): off-brand `bg-pink-500` on the Duplicate button → Bugbot; `StatusBadge`
"In review" dark-mode contrast fail → `cursor-agent` fixes red CI. `main` stays green;
injuries performed live. Verified: `npm test`, `tsc`, `next build` all pass.

## Objection handling (full)

- **Why Cursor over Claude Code?** They should like Claude Code — it's a top-satisfaction,
  genuinely secure product. Not a model fight: Cursor routes Anthropic + OpenAI + Gemini, so
  you keep the model they love. Difference = (1) IDE-native (Tab/agent/chat/Bugbot in the
  editor 30k engineers already live in — near-zero adoption friction vs a terminal tool); (2)
  one governed admin plane (AI Code Tracking, audit, allow-lists, Privacy Mode) a terminal
  tool makes admins assemble; (3) model optionality — Adobe's OWN philosophy (Firefly is a
  multi-model marketplace; don't single-source engineers to one lab when you didn't
  single-source your product). Score the trial on *their* 2–3 criteria.
- **Why not build our own / use free models?** Adobe tells its OWN customers via Firefly
  Foundry "don't build/run your own model." Category re-bases every ~8 weeks; building
  internally = standing team chasing cadence with zero differentiation vs your actual product
  (creative software), diverting scarce ML talent from the Firefly roadmap. Free/consumer
  endpoints train on inputs, no retention controls/SSO/audit. It's TCO + opportunity cost.
- **Security/IP (2013 scar):** Lead here before any feature. Privacy Mode org-wide (no
  training), contractual ZDR, embeddings-only indexing, SOC 2 II, SSO/SCIM, audit. Most
  sensitive repos → self-hosted cloud agents in Adobe VPC + PrivateLink + repo blocklist. Put
  exact commitments in writing for security review; scope pilot to a non-sensitive repo day 1.
- **Data residency / DPDP India:** Don't bluff. Privacy Mode + ZDR + embeddings-only + repo
  blocklist + self-hosted-in-VPC. DPDP uses notified-jurisdiction approach, not blanket
  localization — discover sector-specific constraints; bring data-flow + roadmap in writing.
- **ROI/adoption at 10k+:** Co-build on THEIR loaded cost + target metric. Anchors: Sarkar
  ~39% more PRs (flat reverts), DX median ~7.76% PR-throughput. Admin dashboard proves
  per-team adoption/model-mix/spend for renewal. "Which one metric would you point leadership
  to if this works?"
- **We already have Copilot / several tools:** That's the pain, not the counter — likely 3
  tools, no standard, no unified audit, exactly when your Gen-AI policy demands governance.
  We pitch *consolidation onto one governed surface*, not a 4th tool.

## Discovery questions (asking = the credibility move)

1. Which 2–3 engineering metrics will the board judge new leadership on this year?
2. Current lead time from "AI feature greenlit" → production, and where does it stall?
3. Is the mandate "more output per engineer at flat headcount," and who owns that number?
4. **Where should the pilot live + which codebase** — India vs US; AEM/Java, AEP/Scala,
   Creative Cloud web (React/TS), or C++ desktop? *(This forks the entire demo motion.)*
5. On oldest C++ modules, time-to-first-safe-commit for a rotated/new engineer? How many can
   safely touch the most legacy subsystems?
6. For C++→Rust, biggest blocker — interop boilerplate, missing characterization tests, or
   reviewer bandwidth? *(Their scientist flagged interop #1.)*
7. Share of Acrobat/desktop CVEs that are memory-safety vs logic/JS?
8. When an engineer uses an AI tool today, which one — enforced standard or team-by-team?
9. How does security govern source code reaching model endpoints today?
10. Is in-VPC/self-hosted execution required for most-sensitive repos, or is managed cloud +
    Privacy Mode + SOC 2 + PrivateLink enough for a scoped pilot?
11. CI/CD estate for highest-traffic services — is GitHub→Jenkins→Spinnaker→K8s
    representative, or do C++ products use a different build world? Biggest build bottleneck?
12. Claude Code trial — the job each tool is evaluated for, 2–3 named success criteria, and
    who is the economic buyer behind the technical evaluators?
13. India R&D expansion owner if pilot succeeds — single buyer (Abhigyan Modi thread) or
    cross-org coalition? What converts a 20–30 person pilot to org-wide?
14. Is per-commit AI Code Tracking a hard requirement for security sign-off?
15. Standardize on one model lab, or keep optionality across Anthropic/OpenAI/Google?

## Top risks / de-risk

1. **Stale product claims in front of Cursor's own Head of FE.** "Cloud-only/no on-prem" is
   FALSE (2026 self-hosted cloud agents) — reframe as a strength. CMEK NOT verified — drop
   unless confirmed day-of. Verify the exact self-hosted boundary (cloud agents vs interactive
   indexing) before claiming "fully in-VPC."
2. **Over-precision a pro seller falsifies live:** brittle YTD stock % (use "~50% off
   52-wk high" / live quote), "18-year CEO" (since 2007 ≈19 yrs, stays as chair), the 70%
   memory-safety stat (industry, not Adobe's code), CVE-2026-34621 (JS, NOT memory-safety),
   Bugbot "90%/3min / 18:1 ROI" + seat-pricing bands (out of an FE's lane). Strip brittle
   numbers; attribute survivors precisely; let Adobe supply the rest.
3. **Asserting unknowable internals** (exact stack, per-product migration mix, "silent
   layoffs," tool-count-per-engineer, active shadow-AI exposure) → convert every internal to
   a discovery question.
4. **Live-demo failure** — keep C++ narrative-only; run on pre-staged react-spectrum + AEM
   with rehearsed failures + a recorded fallback; verify venue network.
5. **Mis-framing Claude Code** as "we're more secure / better model" (both lose) → concede,
   differentiate on surface + control plane + optionality. Avoid Cursor/Anthropic
   corporate-structure tangents.
6. **Wrong altitude/room** — 101 opens board-altitude; 201 goes CI/CD-deep; seat technical
   pilot in India R&D, route economic narrative through commercial APJ org; never mis-target
   a commercial-only Tokyo room as engineering.
7. **Adobe-as-existing-customer trap** — a third-party blog lists Adobe as a Cursor customer
   but Adobe is NOT on cursor.com/enterprise. Treat as net-new/expansion; peer social proof =
   NVIDIA (C++/systems), Stripe/Salesforce (compliance), "64% of Fortune 500."

---
*Source of record: 15-agent web-sourced + adversarially fact-checked research, 2026-06-26.
Re-verify volatile facts (stock, current Cursor product/security claims) the day of.*
