# PRD — Pigment (Cursor × Adobe demo app)

> **Purpose of this repo:** a *spec package* you open in Cursor and build out with
> Composer/Agent. It is documentation-first. A verified reference scaffold is included, but
> **this PRD + the build plan are the source of truth** — rebuild or extend from them.
> You configure the live pieces in Cursor (Bugbot, repo, Supabase, Vercel, CI secrets).

## 1. Why this exists (one paragraph)
The Field Engineer demo must *sell to Adobe*, not tour Cursor's features. Pigment is the
stage: a small, visual product surface where one platform team's design system is consumed by
"200+ product teams." It exists so the audience can **see pain → solution** — an off-brand or
inaccessible change shipping, then Cursor catching/fixing it across the SDLC. The app is small
but real (a campaigns console over a shared component/token system, with a detail route and a
live a11y gate) — scoped to stay legible in the room; the value is the *workflow at
100+-engineer scale*, not lines of code. Full strategy in [`STRATEGY.md`](../STRATEGY.md).

**Adobe-native framing.** Pigment stands in for an **Adobe App Builder add-on built on React
Spectrum**; Layer 1 is now literally `@adobe/react-spectrum` (flag-gated, default OFF), and the
pitch cites three verified Adobe proof points — React Spectrum, the `@adobe/express-developer-mcp`
server, and Adobe GPM Ruben Rincon's Cursor write-up. See
[`PLAN-ADOBE-NATIVE-FRAMING-AND-SPECTRUM.md`](PLAN-ADOBE-NATIVE-FRAMING-AND-SPECTRUM.md).

## 2. Goals / non-goals
**Goals**
- A digestible, visual web app a mixed (exec + engineer) room understands in seconds.
- Owned repo + CI/CD so the demo shows the full SDLC and governance plane.
- Two **specific, rehearsed** failure→fix scenarios (named file, component, page) — see §6.
- Stack that reads as modern-Adobe-shaped and deploys clean on Vercel.

**Non-goals**
- Real product depth or feature completeness. No auth, no multi-tenant, no real campaigns CRUD.
- Demoing on Adobe's actual code (we own ours — see STRATEGY artifact decision).
- A live C++/Rust compile (that stays a *narrative* in the deck, never on stage).

## 3. Users / personas (for the demo narrative)
- **Platform engineer** — owns `components/ui/*`, tokens, the rules. Wants consistency at scale.
- **Product engineer** — owns `app/campaigns/*`. Ships fast, occasionally drifts off-system.
- **Eng leadership (the room)** — cares about velocity, governance, and the metric.

## 4. Stack (required)
Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Base UI (`@base-ui/react`) ·
Supabase (Postgres + SSR client) · Vercel. Test: Vitest. These are fixed — they make the demo
read as a real enterprise front-end stack and let Bugbot/CI/Vercel previews shine.

## 5. Scope — what to build
**Pages**
- `/` → redirect to `/campaigns`.
- `/campaigns` — the **Campaigns Console**: a product team's surface. Header (brand + theme
  toggle), a Base UI `Select` status filter, a grid of campaign cards, and a campaigns table.

**Design system (`components/ui/`, platform-owned)**
- shadcn `Button` (variants: default/secondary/outline/ghost), `Card`, `Table`.
- `StatusBadge` — a custom component owning the **semantic status tokens** (`draft`/`live`/
  `review`) for light + dark, each pair WCAG-AA. This is the a11y-gated component.
- Brand token = indigo (`--primary`).

**Product surface (`components/campaigns/`, product-owned)**
- `CampaignCard` (name, `StatusBadge`, owner, Open/Duplicate actions).
- `CampaignsTable`, `StatusFilter` (Base UI Select), `CampaignsView` (client; holds filter state).

**Data (`lib/`, `supabase/`)**
- `campaigns` table: `id, name, owner, status enum, updated_at`. RLS + anon read (demo only).
- Server Component reads via `@supabase/ssr`; **falls back to seed data** when env is unset so
  the app always renders before configuration.

**Governance / SDLC (the point)**
- **Plan-first:** the whole build is a Jira backlog (epic **PIG** → "plan phase" stories) and a
  Confluence space (**Pigment**), created and driven via the Atlassian MCP — see [`PLAN.md`](PLAN.md).
- `.cursor/rules/` (design-system + project + planning), `AGENTS.md`, `CODEOWNERS` (platform vs product).
- CI: typecheck + test + the a11y gate; Bugbot on PRs; a headless `cursor-agent` CI job.
- The full loop (see [`PIPELINE.md`](PIPELINE.md)): **Jira** (plan) → Cursor → PR/Bugbot →
  Actions/`cursor-agent` → **Vercel** → **Sentry** (observe; Seer/MCP back into Cursor) →
  Sentry files the next Jira ticket. **Datadog** is the enterprise complement (backend SLOs),
  named not demoed.

## 6. The two demo scenarios (definition of done — must be exact)
Keep `main` green; these are introduced live. Full diffs + verbatim prompts + expected Bugbot
comment in [`INJURIES.md`](INJURIES.md).

| # | Surface | The drift | The fix | Caught by |
|---|---|---|---|---|
| A | `components/campaigns/campaign-card.tsx`, Duplicate button on `/campaigns` | hardcoded `bg-pink-500` (off-brand, won't theme) | `<Button variant="ghost">` | **Bugbot** on the PR |
| B | `components/ui/status-tokens.ts`, `review.dark` token (legacy flag-OFF path) | foreground fails WCAG AA in dark mode | restore an on-brand amber ≥4.5:1 | **`cursor-agent`** in CI (test goes red) |

These are non-negotiable: the demo's credibility depends on the fix calling out a *named
component, on a named page, in specific language*. The app must be built so both are true.

## 7. Success criteria
- `npm run dev` renders `/campaigns`; light/dark toggle works; chips/buttons on-brand.
- `npm test` (a11y gate) green on `main`; `tsc` clean; `next build` succeeds; Vercel preview deploys.
- Applying INJURY A → Bugbot comments citing the tokens-never-literals standard (`.cursor/BUGBOT.md`). Applying INJURY B → CI red → `cursor-agent` fixes.
- A non-engineer in the room can name what broke and what fixed it.

## 8. Out of scope / explicitly deferred
Auth, real CRUD, pagination, search, mobile polish beyond responsive grid, analytics, i18n.
A second product surface ("many teams, one system") is a *nice-to-have* — add only if it
strengthens the scale story without adding demo risk.
