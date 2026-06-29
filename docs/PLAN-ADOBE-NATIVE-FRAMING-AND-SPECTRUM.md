# Plan — Make Pigment Adobe-native: the Floor (framing) + the Upgrade (React Spectrum)

> **READ THIS FIRST (you are a fresh chat with zero prior context).** This document is
> self-contained. It carries everything you need: what the project is, the current state of
> two repos, verified external facts, and two sequenced implementation parts. Do **Part A (the
> Floor) first and ship it** — it is talk-track only and low risk. Do **Part B (the Upgrade) on
> a branch** — it re-platforms the demo app's design system to the real Adobe React Spectrum.
> Author: prior session, 2026-06-28. Re-verify the volatile product facts in §3 the day you act.

---

## 1. Cold-start context (what this is)

This is interview-prep for a **Cursor Field Engineer** role: two role-play demos to "Adobe" as a
prospective enterprise customer. There are **two repos**:

- **`~/Documents/adobe-cursor-demo`** — the live demo app, **"Pigment"**, plus its SDLC
  (CI, rules, Bugbot, LaunchDarkly, Sentry). *This is where Part B happens.* Source of record:
  `STRATEGY.md`, `docs/DEMO-RUNBOOK.md`, `docs/INJURIES.md`.
- **`~/Documents/Cursorlearn`** — the "Learn Cursor" site. The **talk tracks** live in
  `src/content/prep/cursor-101.ts` and `cursor-201.ts` (sealed admin "Prep Zone"). *This is where
  Part A happens.* The site auto-deploys `main` → prod on Vercel (`vercel ls` to watch).

### What Pigment is — one repo, two layers

Pigment is **one repo with two layers**, and the whole demo is the *relationship* between them:

- **Layer 1 — the design system** (`components/ui/*`): shared buttons, badges, status tokens.
  Owned by **the platform team**. Today it is shadcn + Base UI (`@base-ui/react`) + Tailwind v4.
  **It is the demo's stand-in for Adobe's React Spectrum.** Part B makes it *literally* React
  Spectrum.
- **Layer 2 — the campaigns console** (`app/campaigns` + `components/campaigns/*`): the product —
  a marketers' tool to create/review/launch campaigns (each campaign a card; lifecycle Draft → In
  review → Live). Built on Layer 1. Owned by **a product team**.

**The rule the demo dramatizes:** Layer 2 *consumes* Layer 1 — it uses the shared `<Button>`,
badge and tokens, it never hardcodes its own colors. The 200+-consumers-of-one-system model maps
onto how Adobe runs Spectrum (and AEM).

**Personas in the talk tracks:** **Priya** (developer, works on Layer 2 the product), **Raj**
(platform-team lead, owns Layer 1), **Anjali** (on-call engineer, 201 observe). The FE steps into
and out of role out loud, runs Tell-Show-Tell, and choreographs the round as a Challenger
commercial-teaching pitch.

**The two seeded demo injuries:**
- **INJURY A** (101, live fix) — *design-system drift in the product.* In
  `components/campaigns/campaign-card.tsx` the Duplicate button is a raw `<button>` with hardcoded
  `bg-pink-500` instead of the system's `<Button variant="ghost">`. Off-brand, won't theme. Bugbot
  catches it on the PR; you fix it live with Cmd-K.
- **INJURY B** (201) — *WCAG AA dark-mode contrast failure in the design system.* In
  `components/ui/status-tokens.ts` the `review` token's `dark.fg` is set to `#6A4A1E` on `#3A2A12`
  (≈1.7:1, below 4.5:1) so `npm test` goes red; a headless `cursor-agent` (the `fix-ci` job)
  restores `#E0A24E`.

### The strategic decision driving this plan

`STRATEGY.md` deliberately chose to **own the SDLC** with Pigment rather than demo on Adobe's real
react-spectrum (*"you'd be a tourist with no control over the SDLC story"*). We keep that. We make
Pigment **Adobe-native** in two escalating ways:

- **Floor (Part A):** talk-track only. Reframe Pigment as a deliberate **stand-in for an Adobe App
  Builder add-on built on React Spectrum**, and weave in three *verified* Adobe proof points.
- **Upgrade (Part B):** make **Layer 1 literally `@adobe/react-spectrum`** (Adobe's real,
  open-source design system), keeping the owned Vercel/CI/Bugbot pipeline.

### The guardrail (do not break this)

**"Imagine / stands in for," never "this IS App Builder."** Pigment's stack is Next.js 16 + Tailwind
+ shadcn + Supabase on Vercel — it is *not* App Builder (App Builder = Adobe I/O Runtime + React
Spectrum + the `aio` CLI). You present to **Cursor's own Head of FE**; a literal claim collapses on
one glance at `package.json`. Frame the imagining explicitly. And re-verify every volatile product
fact (§3) the morning of.

### Current-state facts you must know before touching anything

- **The injury automation is NOT on current `main`.** As of this writing, `~/Documents/adobe-cursor-demo`
  `main` has a **clean working tree** and `.demo/injury-a.patch`, `.demo/injury-b.patch`,
  `.github/scripts/demo-injury.sh`, `docs/DEMO-INJURIES.md`, and the `/apply-injury-*` /
  `/rehearse-injury-*` / `/reset-injuries` / `/demo-reset` commands **do not exist** here. Injuries
  live only in `docs/INJURIES.md`, applied by hand. **However**, a prior session *did* build that
  automation (it was committed as `8593589` and the Learn Cursor talk tracks reference it). It is
  almost certainly on a branch or stash. **Reconcile this first in Part B (step B0):** decide which
  branch is canonical, and whether the talk tracks' `/apply-injury-*` references are valid.
- **`next.config.ts` has `cacheComponents: true`** (Next 16 Cache Components / PPR is ON) and wraps
  in `withSentryConfig`. This matters for Spectrum's client providers (Part B).
- **Tailwind v4 is CSS-first** (no `tailwind.config.js`; theme via `@theme inline` in
  `app/globals.css`). `components.json` is shadcn `base-nova`, `rsc: true`.
- **The contrast gate is `components/ui/status-badge.test.ts` + `lib/contrast.ts`** (pure hex
  contrast math). It iterates every `STATUS_TOKENS` status × light/dark and asserts ≥ 4.5:1. It only
  reads literal 6-digit hex — a Spectrum migration changes its input contract (handled in B3).

---

## 2. Floor vs Upgrade — what each is, and sequencing

| | Part A — Floor | Part B — Upgrade |
|---|---|---|
| What | Reframe + weave Adobe proof points into the 101 talk track | Make Layer 1 literally `@adobe/react-spectrum` |
| Repo | `Cursorlearn` (talk track) + small `adobe-cursor-demo` doc edits | `adobe-cursor-demo` (app) + re-sync `Cursorlearn` talk tracks |
| Risk | Low (copy only) | Medium (re-platforms the design system) |
| Effort | ~half a day | ~3 days (Layer-1 hot path); +~2 days for full component set |
| Ship | To prod immediately (push `main`) | On a branch; merge when QA-green |

**Sequence:** Do **A** and ship it (it stands alone and de-risks the room immediately). Then do **B**
on a branch. After B merges, the Floor's "stand-in for React Spectrum" language tightens to "Layer 1
*is* React Spectrum" (B5 covers that re-sync).

---

## 3. Verified Adobe proof points (confirmed live 2026-06-28 — re-verify day-of)

These power both parts. All three are **confirmed**. Bank the precision fixes — they are exactly
what the Head of FE would catch.

### Proof 1 — Adobe Express Developer MCP Server ✅
- Adobe ships an **official MCP server** that feeds curated Adobe Express add-on docs + official SDK
  TypeScript defs to the LLM to cut hallucinations, **with explicit Cursor support** (`~/.cursor/mcp.json`).
- **Package: `@adobe/express-developer-mcp`** (the beta `@adobe/express-add-on-dev-mcp` is
  **deprecated** — cite the new name; the old one is a day-of landmine).
- Docs: `https://developer.adobe.com/express/add-ons/docs/guides/getting-started/local-development/mcp-server`
  · Stable-release blog (Mar 2026): `https://blog.developer.adobe.com/en/publish/2026/03/build-faster-with-the-adobe-express-developer-mcp-server`
- **Use it where:** the comprehension / Supabase-MCP-gesture beat — "Adobe already built an MCP
  server for exactly this, for Cursor."

### Proof 2 — `adobe/skills` GitHub repo ✅ (Cursor = pilot)
- `adobe/skills` — "Repository of Adobe skills for AI coding agents." Plugins for App Builder, AEM
  (Edge Delivery / Cloud Service / 6.5), Analytics, CJA, creative — installable as **Claude Code
  plugins** (`/plugin marketplace add adobe/skills`), with a **Cursor pilot** (the `app-builder`
  plugin ships `plugins/app-builder/.cursor-plugin/plugin.json`; README: *"Other plugins will gain
  Cursor support once the pattern is validated"*). **Say "Cursor preview/pilot," never "full
  support."**
- The **mandatory `AGENTS.md` skill-discovery** example is in **`adobe/helix-website`** (NOT
  `adobe/skills` — that path 404s): *"YOU ARE REQUIRED TO USE THESE SKILLS… run `./.agents/discover-skills`…
  you MUST start with the content-driven-development skill."*
- URLs: `https://github.com/adobe/skills` · `https://github.com/adobe/helix-website/blob/main/AGENTS.md`
  · App Builder AI tools (lists Cursor): `https://developer.adobe.com/app-builder/docs/get_started/app_builder_get_started/ai-development-tools`
- **Use it where:** the `@codebase`/AGENTS.md comprehension beat and the governance beat — "you
  already ship agent skills + a mandatory AGENTS.md; you've decided agentic context belongs in the
  editor."

### Proof 3 — Adobe's own GPM Cursor write-up ✅
- **"From Idea to Product: Learnings from Vibe Coding with Cursor and the Adobe Express Add-On MCP
  Server"** — **Ruben Rincon, Group Product Manager, Adobe Developer Platform**, **Oct 20 2025**.
- URL: `https://blog.developer.adobe.com/en/publish/2025/10/learnings-from-vibe-coding-with-cursor-and-the-adobe-express-add-on-mcp-server`
- Field-engineering lessons in it: strong/rewritten prompts; ground in docs when it drifts;
  fine-tune autonomy; version control; **shorter conversations (new chat per feature)**; AI for UI
  polish / accessibility / compliance / debugging. *(This is almost a blueprint for your demo's
  tone — echo it.)*
- **PRECISION FIX:** the "MVP in under two hours" was an *earlier, separate* experiment; the **main
  weekend project took 8–10 hours at ~20% of traditional time.** Phrase: *"their own GPM built an
  MVP add-on in under two hours, then a production-ready add-on over a weekend at about a fifth of
  traditional time."* Do not conflate.
- **Use it where:** the pilot / close beat as social proof — "Adobe's own platform PM published this."

### Bonus proofs (optional, lower durability — lead with the three above)
- **Adobe Commerce AI coding tools** (a RAG service grounding the agent in Commerce docs, **Cursor
  setup explicit**): `https://developer.adobe.com/commerce/extensibility/developer-agent/coding-tools`
- **AEM "AI coding agents"** (Cursor-compatible): `https://www.aem.live/developer/ai-coding-agents`
- **Adobe Developers Live 2025** built a Commerce extension *in Cursor*: event content — cite last.

---

## PART A — THE FLOOR (talk-track only; ship to prod)

**Goal:** the 101 reframes Pigment as a stand-in for an Adobe App Builder add-on on React Spectrum,
and cites the three proof points. No app changes. All edits in
`~/Documents/Cursorlearn/src/content/prep/cursor-101.ts` (+ small `adobe-cursor-demo` doc edits).

**Constraints (apply to every edit):** tsc exit 0; `npm run build` green; `node scripts/ops/ai-tells-check.mjs --changed`
→ 0 severe; obey `Cursorlearn/CURSOR-VOICE.md` (banned substrings: leverage, seamless, unlock,
supercharge, game-changer, force-multiplier, terminal-only, agentic, effortless, revolutioniz,
cutting-edge). Keep the "imagine/stand-in" guardrail. The `play` block shape is
`{ type:"play", surface, meta?, role?, beats:[{say?,type?,do?,see?}] }`.

### A1 — Reframe "stand-in for Spectrum" → "stand-in for an App Builder add-on on React Spectrum"

Edit these spots in `cursor-101.ts` (current text quoted so you can find them):

1. **`c101-stage` (Setup) — Layer 1 card.** Find: *"This is the demo's stand-in for Spectrum — the
   role your real design system plays. Priya does not touch this layer."* → Replace with:
   *"In the demo this stands in for **React Spectrum**, Adobe's real design system — the role
   Spectrum plays across their products. (Picture the whole app as an internal Adobe App Builder
   add-on; this is its UI layer.) Priya does not touch it."*
2. **`c101-stage` — Layer 2 card.** Append to the body: *"Think of it as an App Builder add-on
   extending Experience Cloud — a product team's surface, built on the shared system."*
3. **`c101-stage` takeaway.** Change "the demo's Spectrum" → *"the demo's stand-in for React
   Spectrum (picture an App Builder add-on built on it)."*
4. **`c101-talk-pigment` — the "why my own repo" beat** (the richest insertion point; current `say`
   begins *"Why my own app, and not your react-spectrum directly?"*). Replace the `say` with:
   > "Why my own app, and not your react-spectrum directly? Two reasons. First, I own this repo and
   > the whole pipeline around it — the CI, the rules, the review — so I can show you governance
   > running live instead of asserting it. Second, I want you to picture this as one of your own: an
   > internal app, an App Builder add-on extending Experience Cloud, with its UI on React Spectrum. I
   > built a small stand-in so I keep that control, but every part of it maps onto your world."
5. **`c101-talk-pigment` — the "Adobe why" beat** (current `say` includes *"Your design system is
   Spectrum, and it is consumed across…"*). Keep it; it is already strong. Optionally tighten the
   close to: *"…Pigment is a deliberately small model of that exact problem — picture it as an App
   Builder add-on on React Spectrum, scaled down so I can run the whole governed pipeline live."*
6. **`c101-talk-pigment` — kv row 1** ("1 · One repo, two layers"). Change "the demo's stand-in for
   Spectrum" → *"the demo's stand-in for React Spectrum (picture an App Builder add-on built on it)."*

> After Part B ships, revisit A1: "stand-in for React Spectrum" becomes "Layer 1 **is** React
> Spectrum," and the "imagine" softening on the design-system layer drops (App Builder stays an
> imagining unless you also re-platform the runtime, which we are not).

### A2 — Weave in the three Adobe proof points (subtle, on-voice, at the right beats)

1. **`c101-talk-live` — the Supabase-MCP-gesture beat** (in the AGENT play; current `do` is
   *"Optional, only if the Supabase MCP is connected: gesture at it…"*). Add a short FE-voice aside
   (a new `say` beat or appended to the close-Tell): *"And this isn't hypothetical for you — Adobe
   ships an official Express developer MCP server, `@adobe/express-developer-mcp`, built to feed your
   own SDK docs and types straight into Cursor and cut hallucinations. The grounding you just watched
   is the pattern; Adobe already built the Adobe-specific version of it."*
2. **`c101-talk-live` — the `@codebase`/comprehension close-Tell** AND **`c101-talk-story`
   governance beat.** Add (governance is the better home): *"You've already decided agentic context
   belongs in the editor — you publish an `adobe/skills` repo of agent skills with a Cursor preview,
   and your `helix-website` repo ships an `AGENTS.md` that *requires* engineers to discover and use
   those skills. So this isn't me selling you on the idea; it's me showing you the governed version
   of something you already do."* (Note: voice-gate bans the bare word "agentic" → write
   "agent-based" / "agent" in `say` lines that ship to the public corpus; the prep zone is sealed,
   but keep it clean.)
3. **`c101-talk-close` — the pilot/close.** Add a social-proof beat before the discovery questions:
   *"One more thing to make this concrete: your own Group PM for the Developer Platform, Ruben Rincon,
   published in October how he built an Express add-on in Cursor — an MVP in under two hours, then a
   production-ready add-on over a weekend at about a fifth of the usual time. His lessons read like a
   field-engineering checklist: strong prompts, keep it grounded in docs, shorter chats per task,
   lean on it for UI, accessibility and compliance. That's the workflow I'm proposing you trial,
   from someone inside Adobe."*

**Re-verify before shipping/presenting:** the `@adobe/express-developer-mcp` package name, the
`adobe/skills` Cursor-pilot status, and the Rincon "<2h MVP / weekend production" framing (§3).

### A3 — Update `adobe-cursor-demo` docs to match the framing

Light edits so the source-of-record agrees with the talk track:
- `STRATEGY.md` (the "Artifact decision" section): add a sentence that Pigment is presented as a
  **stand-in for an App Builder add-on built on React Spectrum**, with the three Adobe proof points
  as the credibility layer (cite §3 refs). Keep the existing "own the SDLC, don't demo on
  react-spectrum" rationale — it still holds for Part A; Part B revisits it.
- `docs/DEMO-RUNBOOK.md` (101 section): one line on the new Pigment framing + the proof-point beats.
- Optionally `docs/PRD.md`: note the Adobe-native framing.

### A4 — Verify + ship

In `~/Documents/Cursorlearn`: `npx tsc --noEmit` → `npx eslint src/content/prep/cursor-101.ts` →
`node scripts/ops/ai-tells-check.mjs --changed` → `npm run build`. All green, then commit and
`git push origin main` (auto-deploys; `vercel ls` to confirm the Production deploy reaches Ready).
**Do not put backticks in `git commit -m` bodies** (shell command-substitution mangles them — use
`-F` with a heredoc or no backticks).

---

## PART B — THE UPGRADE (Layer 1 → real `@adobe/react-spectrum`; on a branch)

**Goal:** Layer 1 *is* React Spectrum. The owned Vercel/CI/Bugbot pipeline is unchanged. The two
injuries get **better, more honest** reframes (Spectrum makes the old failure modes structurally
impossible). Effort ≈ 3 days for the hot path. Use **`@adobe/react-spectrum` (v3)**, **not** Spectrum
2 (`@react-spectrum/s2`) — S2 needs a build-time `style` macro wired into Turbopack/webpack, which
would make your demo pipeline non-boring; v3 is a runtime dependency swap with a documented Next
App Router SSR story.

**Verify-after-every-step (in `adobe-cursor-demo`):** `npm run typecheck` · `npm test` · `npm run build`.

### B0 — Branch + reconcile the injury-automation discrepancy (do this first)

1. `git checkout -b feat/react-spectrum` off the canonical `main`.
2. **Resolve the discrepancy from §1:** find where the injury automation lives
   (`git branch -a`, `git log --all --oneline | grep -i injur`, `git stash list`). Decide: is
   `demo-injury.sh` + `.demo/*.patch` + the `/apply-injury-*` commands part of canonical `main` or a
   separate branch? The Learn Cursor talk tracks *reference them as if they exist* (`/apply-injury-a`,
   `/rehearse-injury-b`, `/reset-injuries`, `/demo-reset`). Either (a) merge that automation into the
   line you build on, or (b) note that the talk tracks' automation references need a follow-up
   correction. **Do not proceed assuming both states are true.**

### B1 — Install + wire the Provider/SSR for Next 16 App Router

```bash
npm i @adobe/react-spectrum @react-aria/optimize-locales-plugin
```

- `@adobe/react-spectrum` re-exports `Provider`, `defaultTheme`, `Button`, `ActionButton`,
  `StatusLight`, `Badge`, etc. You do **not** need the per-component subpackages or
  `react-aria-components` (that's the separate unstyled lib — don't mix it with v3).
- **`next.config.ts`** — add the locales plugin to the webpack branch (it strips ~30 bundled locale
  files; you ship only `en-US`). Keep the existing `cacheComponents` + `withSentryConfig`:

```ts
const localesPlugin = require('@react-aria/optimize-locales-plugin');
// inside the existing config object:
webpack(config, { isServer }) {
  if (!isServer) config.plugins.push(localesPlugin.webpack({ locales: [] }));
  return config;
},
```

- **New `components/spectrum-provider.tsx`** (client; drives Spectrum's colorScheme off the existing
  `components/theme-provider.tsx` so Pigment's dark-mode toggle stays authoritative — needed so the
  contrast injury still demos in dark):

```tsx
'use client';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { useTheme } from '@/components/theme-provider'; // existing 'light' | 'dark' context

export function SpectrumProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return <Provider theme={defaultTheme} colorScheme={theme} locale="en-US">{children}</Provider>;
}
```

- **`app/layout.tsx`** — mount the i18n string provider in the server tree, wrap children:

```tsx
import { LocalizedStringProvider } from '@adobe/react-spectrum/i18n';
// in <body>, outermost-in:
<LocalizedStringProvider locale="en-US" />
<ThemeProvider>
  <SpectrumProvider>{children}</SpectrumProvider>
</ThemeProvider>
```

- **SSR gotcha:** Spectrum components are client components; with React 18+/19 you do **not** need
  the old `SSRProvider`, but **pass `locale` and `colorScheme` explicitly** (as above) rather than
  letting Spectrum auto-detect on the server, to avoid a hydration flash. One root `Provider` only.
- Smoke test: render one `<Button variant="accent">` on `/campaigns`, `npm run build`, confirm green
  in light + dark. (~0.5 day to here.)

### B2 — Migrate the hot Layer-1 components behind the stable Pigment API

Keep `components/ui/Button`, `Badge`, `StatusBadge` exporting the **same prop API** so Layer 2
(`app/campaigns`, `components/campaigns/*`) barely churns. Internally they render Spectrum.

| Pigment Layer-1 (today, shadcn/cva/Tailwind) | Spectrum v3 | Mapping notes |
|---|---|---|
| `Button` (`variant` default/outline/secondary/destructive/ghost/link; `size`) | `Button` + `ActionButton` | default→`variant="accent"`; secondary→`variant="secondary"`; outline→`variant="primary" style="outline"`; destructive→`variant="negative"`; **ghost/link/icon → `ActionButton` (`isQuiet`)**. `onClick`→`onPress`; `disabled`→`isDisabled`; loading→`isPending`. **No `className`/`size` styling** — use Spectrum scale + spacing props (`margin="size-100"`) or `UNSAFE_*`. |
| `Badge` (generic chip) | `Badge` | `variant`: semantic (`neutral`/`positive`/`negative`/`info`/`notice`) or label colors (`indigo`, `magenta`, …). |
| **`StatusBadge`** (`draft`/`live`/`review` hex token table) | **`StatusLight`** (dot+label) | draft→`neutral`; live→`positive` (or `info`); review→`notice`. `<StatusLight variant="positive">Live</StatusLight>`. **Delete the hand-rolled `STATUS_TOKENS` hex map** — color now comes from Spectrum tokens, pre-validated AA in light + dark. |

Push Spectrum to **leaf** components so Layer-2 server components stay RSC where possible (any
component rendering Spectrum needs `'use client'`). (~1 day.)

### B3 — Re-author the two injuries (they get *better* in the Spectrum world)

Spectrum's semantic variants are guaranteed-AA, and you can't pass `className="bg-pink-500"` to a
Spectrum component — so **both old failure modes become structurally impossible.** Reframe them as
*fighting the system*, which is a more realistic, more impressive drift:

- **INJURY A (design-system drift, 101 live fix).** Old: raw `<button bg-pink-500>`. New: the
  Duplicate action either (a) drops to a raw HTML `<button>` with a hardcoded color *because the dev
  couldn't get a Tailwind class onto the Spectrum `Button`* (the smell is now "they abandoned the
  component entirely"), or (b) keeps the Spectrum `Button` but slaps `UNSAFE_style={{backgroundColor:'#ff00aa'}}`
  on it. Either is off-brand + won't theme. **Talk-track reframe (strong):** *"The design system used
  to be a convention you could ignore; now it's the type system. To go off-brand Priya had to fight
  the component — and the moment she did, our rules and Bugbot caught it."* Update `docs/INJURIES.md`
  (and the `.demo/injury-a.patch` if the automation is in scope) + the Cmd-K fix prompt to the new
  shape.
- **INJURY B (WCAG contrast, 201 CI self-heal).** Old: a hand-picked hex `dark.fg` fails AA. In the
  Spectrum world there are no hand-authored status colors to fail. **Retarget the test + injury:**
  keep `components/ui/status-badge.test.ts` but assert *computed* contrast on the rendered
  `StatusLight` (against the Provider's resolved background) in `colorScheme="dark"`. The injury
  becomes: someone overrides a StatusLight color via `UNSAFE_style={{color:'#…'}}` (or adds a
  non-semantic custom variant) that fails AA in dark; `npm test` goes red; the `cursor-agent`
  `fix-ci` job removes the override and restores the semantic variant. (This is *more* honest than
  the original — "the system catches someone who fought the tokens.") Rework `lib/contrast.ts` usage:
  it currently only reads literal hex; you'll read computed styles from the rendered component
  (`@testing-library/react` + `getComputedStyle`, or resolve the Spectrum CSS variable). (~0.5 day.)

### B4 — Update rules / governance / CI / Tailwind coexistence

- `.cursor/rules/design-system.mdc`: the rule is now "use Spectrum components and semantic variants;
  never `UNSAFE_*` color overrides or raw HTML controls in `app/**`/`components/campaigns/**`." Keep
  the glob scope.
- `.cursor/BUGBOT.md`: update the INJURY A description (drift = abandoning the Spectrum component /
  `UNSAFE_style` color, not `bg-pink-500`).
- `AGENTS.md`: note the design system is React Spectrum. *(Bonus credibility: mirror Adobe's own
  `helix-website` AGENTS.md tone — "you must use the design system components.")*
- CI (`ci.yml`) is **unaffected** by the Spectrum swap (runtime dep only — true for v3, NOT S2).
- **Tailwind coexistence:** Layer 1 → pure Spectrum; Layer 2 app shell → keep Tailwind. The one real
  conflict is **Tailwind v4 Preflight** bleeding resets into Spectrum's DOM — if you see it, scope
  Preflight away from the Spectrum subtree; never style Spectrum internals with Tailwind utilities
  (use spacing props / `UNSAFE_*`). (~1 day for the Layer-2 sweep: `onClick`→`onPress`, remove
  `className`/`size` props, Preflight, light+dark visual QA.)

### B5 — Re-sync the Learn Cursor talk tracks to the Spectrum reality

In `Cursorlearn/src/content/prep/cursor-101.ts` and `cursor-201.ts`:
- Tighten the Floor's framing: "stand-in for React Spectrum" → **"Layer 1 is React Spectrum"** (it's
  now literally true). The "imagine an App Builder add-on" can stay (the runtime is still not App
  Builder).
- Update INJURY A's `kv` + Cmd-K prompt to the new shape (B3); update the `<Button variant="ghost">`
  fix references to the Spectrum equivalent.
- Update INJURY B's `kv` + the contrast-test description (201) to the retargeted test (B3).
- Update the c101-stage Layer-1 card / takeaway / kv to say Spectrum is real now.
- Re-verify: `tsc` + `build` + `ai-tells` in Cursorlearn.

### B6 — Verify + QA + merge

- `adobe-cursor-demo`: `npm run typecheck && npm test && npm run build` green. Manually rehearse both
  injuries end-to-end (apply, Bugbot/CI catches, fix, reset) in light **and** dark. Confirm the
  `/campaigns` grid renders correctly with Spectrum components.
- `Cursorlearn`: `tsc` + `build` + `ai-tells` green; deploy.
- Merge `feat/react-spectrum` → `main` only when both are green.

### Risks / rollback (Part B)
- Spectrum bundle is heavier than Base UI — the locales plugin (B1) is mandatory to keep it sane.
- PPR/`cacheComponents` + client Providers: if `next build` complains, ensure Spectrum sits behind
  the `'use client'` boundary at a leaf and not above a prerendered server boundary.
- If the migration destabilizes the demo close to game day, the branch is disposable — Part A alone
  is a complete, shippable, honest win. **Never present a half-migrated app.**

---

## 4. Sequencing checklist (tear-off)

- [ ] **A.** Reframe `cursor-101.ts` (A1) + weave the 3 proof points (A2) + update `adobe-cursor-demo`
      docs (A3). Verify (A4). Push `main` → deploy. *(½ day; ship now.)*
- [ ] **B0.** Reconcile the injury-automation branch discrepancy (§1).
- [ ] **B1–B4.** React Spectrum on a branch in `adobe-cursor-demo` (Provider/SSR, components, injury
      reframes, rules/CI/Tailwind). *(~3 days.)*
- [ ] **B5.** Re-sync the Learn Cursor talk tracks to the Spectrum reality.
- [ ] **B6.** Verify both repos, QA injuries in light+dark, merge.
- [ ] **Day-of:** re-verify §3 (Express MCP package name, `adobe/skills` Cursor-pilot status, Rincon
      "<2h MVP / weekend production" framing); re-verify Cursor's own self-hosted/Privacy-Mode/Bugbot
      claims at cursor.com/docs.

## 5. Open questions only the human can resolve
1. **The injury-automation branch** (§1, B0) — which line is canonical, and are the talk tracks'
   `/apply-injury-*` references valid on it?
2. **Scope of B:** hot path (Button/Badge/StatusBadge ≈ 3 days) only, or the full Layer-1 set
   (table/tabs/breadcrumb/avatar, +~2 days)? Hot path is enough for the demo.
3. **Persona names** are Priya (dev) / Raj (platform) / Anjali (on-call) — confirm before any
   talk-track edits in Part A/B.
4. **App Builder vs Express vs AEM framing:** this plan uses "App Builder add-on on React Spectrum"
   as the imagining. If you'd rather anchor on Adobe Express (where the MCP + the Rincon write-up
   actually live), swap the imagining to "an Adobe Express add-on" — it makes Proof 1 and Proof 3
   *literally about the thing you're imagining Pigment to be*, which is tighter. Worth considering.
