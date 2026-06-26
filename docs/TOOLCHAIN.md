# The toolchain — one tool per SDLC stage (and what's deliberately left out)

The loop has a *named, installed* tool at every stage. The discipline is the point: a tool that
isn't load-bearing for **this** demo is clutter, and clutter reads as not-knowing-what-matters to
the people who built Cursor. So most of the machine's skill base is **excluded on purpose** (see
the bottom of this doc). Everything below is confirmed installed or a one-line configure.

## Tool per stage
| Stage | Primary tool | Skill(s) — reach for when needed | Status |
|---|---|---|---|
| **Plan / Docs** | Atlassian MCP | `twg-jira`, `twg-confluence`, `twg-context-discovery` | MCP: configure · twg: installed |
| **Code** | Cursor primitives (`.cursor/*`) + Supabase MCP + `supabase` CLI | `impeccable`, `add-migration`, `design:accessibility-review` | installed · CLI present |
| **Review** | `gh` CLI + Bugbot + `/reviewer` subagent | `twg-engineering-work` | gh installed · Bugbot: configure |
| **CI** | GitHub Actions + `cursor-agent` + hooks | — | configure |
| **Deploy** | `vercel` CLI + Vercel MCP | `vercel:deploy`, `vercel:nextjs`, `vercel:shadcn` | vercel CLI installed (54.9.1) · MCP: configure |
| **Observe** | Sentry MCP / Seer | `twg-operational-health` | MCP: configure · *(sentry-cli not installed — use the MCP)* |
| **Report** | — | `twg-status-rollups` | installed |

`.cursor/mcp.json` now declares the four MCP servers the loop touches: **supabase** (data),
**atlassian** (plan/docs), **vercel** (deploy), **sentry** (observe). Cursor-primitive detail:
[`CURSOR-SETUP.md`](CURSOR-SETUP.md); twg detail + guardrails: [`TEAMWORK-SKILLS.md`](TEAMWORK-SKILLS.md).

## Notes
- **Deploy** — the `vercel` CLI is already installed; `vercel:deploy` (and `vercel:nextjs` /
  `vercel:shadcn` for build questions) are the skills. Preview-per-PR is the demo behaviour; the
  human owns the production promote.
- **Observe** — `sentry-cli` is *not* on this machine, so wire and query Sentry via the **Sentry
  MCP / Seer** (the loop-closing path anyway). The `sentry-cli` skill is only useful if you
  install the binary; don't claim a CLI you don't have.
- **a11y craft** — `design:accessibility-review` complements the `afterFileEdit` a11y hook and
  Bugbot; `impeccable` (installed) is the deeper design pass. One a11y standard, several lenses.

## The actual slide decks (separate deliverable)
The 101/201 "slides" sections are outlines. To produce real decks, `anthropic-skills:pptx` can
generate them from those sections — headline + one spoken line per slide, no bullet avalanche.
This is a *deliverable* task, not part of the app toolchain.

## Deliberately EXCLUDED (judgment, not oversight)
Present on the machine but **not** wired in, because they don't serve this demo:
- **Railway** (`railway` CLI) — we host on **Vercel**; a second deploy target is noise.
- **Clerk** (`clerk` CLI + skills) — Pigment has **no auth** (out of scope by the PRD).
- **Firecrawl** (`firecrawl` CLI + skills) — no web-scraping/research need in the loop.
- **searchfit-seo, product-management, cowork, prometheus, last30days, editorial-author,
  operating-company** — off-task for an FE coding-tool demo.
- Generic process skills (`engineering:*`, `design:*` beyond accessibility) — useful references,
  but the loop already names the concrete tool at each stage; don't narrate a generic skill where
  a real tool does the work.

If a future ticket genuinely needs one of these (e.g. Pigment grows an auth surface → Clerk), add
it *then*, scoped to that ticket — the same "earns its place" rule.
