# Teamwork (twg) skills — the agent-native work-data layer

The candidate's machine has the **Teamwork Graph CLI (`twg`)** + seven companion skills installed
user-global at `~/.cursor`/`~/.claude/skills/` — and Cursor scans `~/.claude/skills/`, so **the
agent can reach them with no copying into the repo.** They are a higher-level, *synthesized*
interface over Atlassian/Rovo (Jira, Confluence, PRs, goals, on-call, assets) than raw MCP
tool-calls. The agent reaches for the **narrowest** one **when needed**; nothing here is on the
critical live path (that stays Bugbot + `cursor-agent` in CI).

## Two Atlassian interfaces, different jobs
| Interface | Use for | In the loop |
|---|---|---|
| **Atlassian MCP** (`.cursor/mcp.json`) | precise CRUD: create/transition/comment/link a Jira story, create/update a Confluence page | the **build** lifecycle (`/bootstrap-plan`, `/start-ticket`, `/ship-ticket`) |
| **`twg` skills/CLI** (`~/.claude/skills/twg*`) | read + synthesize across work-data: rollups, review queues, incident reviews, "catch me up", dependency maps | the **demo's** synthesized beats at each loop stage |

## Skill → loop-stage map (reach for it when needed)
| twg skill | What it does | Where it lands in the loop |
|---|---|---|
| **twg** (root) | typed CLI: `resolve`, `search`, `jira`, `confluence`, `work query`, `pull-requests`, `context`, `goals`, … | the entry point; `twg help <terms>` when grammar is uncertain |
| **twg-jira** | Jira workitems, transitions, sprints, boards, links | **Plan / Code** — the PIG backlog (complements the MCP for read/JQL) |
| **twg-confluence** | Confluence authoring, hierarchy, comments, versions, CQL | **Plan / Docs** — the Pigment space + the Decision Log |
| **twg-context-discovery** | deep context, dependency maps, project-to-repo, "catch me up" | **Plan / onboarding** — "catch me up on PIG-204"; the distributed/India ramp story |
| **twg-engineering-work** | PR queues, stale reviews, review bottlenecks, contributors, hot areas, issue→PR | **Review** — the org's review-capacity view *behind* Bugbot's per-PR catch |
| **twg-operational-health** | on-call handoffs, incident + post-incident reviews, reliability, assets | **Observe** — the Sentry prod error → incident review → next ticket |
| **twg-status-rollups** | personal/team/project/goal/exec rollups, weekly updates | **Report** — the leadership rollup from the PIG epic; the baseline→report beat |

## How the agent should use them
- Add to `planning.mdc` intent: for **synthesized/reporting/discovery** work over Teamwork data,
  prefer the narrowest `twg` skill; for **deterministic ticket/page writes** in the build loop,
  use the Atlassian MCP. Resolve IDs first; never guess keys.
- The agent runs `twg <command>` via its terminal tool; the skills (auto-invoked by description)
  supply the exact grammar. They work in the `cursor` CLI too (so the CI agent could call them).

## Guardrails (these read REAL org data)
- **Scope to the demo:** keep `twg` queries on the **PIG** project, the **Pigment** space, and
  the demo repo. Org-wide rollups (people, on-call) can pull in unrelated/sensitive data — frame
  any broader view as "the same operation Adobe runs on *their* Teamwork at scale," don't expose
  your own org's internals on stage.
- **Not the critical path:** these are *enrichment* beats — narrated or run on pre-scoped data.
  The live, must-work demo stays Bugbot (PR) + `cursor-agent` (CI). Have the recording fallback.
- **Verify day-of:** `twg` auth/connectivity and that the skills load in the demo Cursor version
  (they're at `~/.claude/skills/`, which Cursor scans, but confirm in-app).
