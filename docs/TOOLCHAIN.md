# The toolchain — one tool per SDLC stage (and what's deliberately left out)

The loop has a *named, installed* tool at every stage. Most of the machine's skill base is
**excluded on purpose** (see the bottom). Everything below is confirmed installed or a one-line
configure.

## Tool per stage

| Stage | Primary tool | Skill(s) — reach for when needed | Status |
|---|---|---|---|
| **Plan / Docs** | Atlassian MCP | `twg-jira`, `twg-confluence`, `twg-context-discovery` | MCP: configure · twg: installed |
| **Code** | Cursor primitives + Supabase MCP + **LaunchDarkly SDK** | `launchdarkly-flag-create`, `impeccable`, `add-migration` | installed · MCP: configure |
| **Review** | `gh` CLI + **`/review-bugbot`** + Bugbot on PR | `review-bugbot`, `review-security`, `twg-engineering-work` | gh installed · Bugbot: configure |
| **CI** | GitHub Actions + `cursor-agent` + hooks | — | configure |
| **Deploy** | `vercel` CLI + Vercel MCP | `vercel:deploy`, `vercel:nextjs` | vercel CLI installed · auto prod on merge |
| **Release** | **LaunchDarkly MCP** + **`/release-flag`** | `launchdarkly-flag-targeting`, `launchdarkly-flag-discovery` | MCP: OAuth configure |
| **Cleanup** | LaunchDarkly MCP | `launchdarkly-flag-cleanup` | skill installed |
| **Observe** | Sentry MCP / Seer + **LD kill switch** | `twg-operational-health` | MCP: configure |
| **Report** | — | `twg-status-rollups` | installed |

`.cursor/mcp.json` declares: **supabase**, **atlassian**, **vercel**, **sentry**, **launchdarkly**.
Environment tiers: [`ENVIRONMENTS.md`](ENVIRONMENTS.md). Flag setup: [`LAUNCHDARKLY.md`](LAUNCHDARKLY.md).

## Notes

- **Deploy** — preview per PR; **production auto-deploys on merge to `main`** (code ships dark).
  Human gate moves to **LaunchDarkly prod rollout** (`/release-flag`), not Vercel promote.
- **Release** — never toggle prod flags from preview/local credentials; use LD **test** on preview.
- **Observe** — Sentry MCP / Seer closes the loop; LD flag OFF is instant rollback.

## Deliberately EXCLUDED (judgment, not oversight)

- **Railway** — we host on Vercel.
- **Clerk** — no auth in Pigment PRD.
- **Firecrawl** — no scraping need in the loop.
- Generic process skills where a concrete tool does the work.

If a future ticket needs an excluded tool, add it scoped to that ticket.
