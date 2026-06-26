# The optimised Cursor setup (Rules · Skills · Subagents · Hooks · Commands)

Why each primitive is used the way it is — researched against cursor.com/docs so it reads as
best-practice to the people who built Cursor. Five primitives, one job each, reinforcing the
demo's three beats (plan-first build, the two injuries, 100+-dev governance).

## Primitive boundaries (use the right tool)
| Primitive | On disk | Use for | Not for |
|---|---|---|---|
| **Rules** `.cursor/rules/*.mdc` | project · design-system · planning | always-in-force conventions ("wear the seatbelt") | deterministic checks (→ hooks/CI); multi-step procedures (→ skills) |
| **Skills** `.cursor/skills/<name>/SKILL.md` | impeccable (installed) · add-migration | on-demand procedures the agent auto-reaches by description; run in the CLI too | always-on constraints (→ rule); hard enforcement (→ hook) |
| **Subagents** `.cursor/agents/*.md` | reviewer | isolated-context specialists (a readonly verifier; heavy research) | reinventing built-ins; Claude-Code `tools:`/`color:` fields |
| **Hooks** `.cursor/hooks.json` | afterFileEdit · beforeShellExecution · preToolUse | deterministic, fail-loud gates that fire even in CI/cloud agents | advisory guidance (→ rule); user macros (→ command) |
| **Commands** `.cursor/commands/*.md` | bootstrap/start/ship-ticket · new-component · a11y-audit · fix-ci | human-triggered job macros (human owns the timing) | things the agent should auto-reach (→ skill) |

## Rules — correct apply modes (set by frontmatter, nothing else)
- **`project.mdc`** — `alwaysApply: true` (Always). The project constitution: stack, RSC
  boundaries, ownership, test discipline, and the agent permission posture. Legitimately on
  every turn.
- **`planning.mdc`** — `alwaysApply: true` (Always). Plan-first Atlassian discipline must fire
  on planning turns when *no source file is open*, where a glob-scoped rule couldn't.
- **`design-system.mdc`** — `alwaysApply: false` + `globs` (Auto-Attach). **Fixed:** it
  previously set `alwaysApply: true` AND `globs`, which makes the globs inert (always-on loses
  the scoping). Now it loads exactly when a `.tsx`/`lib` file is edited — i.e. when the
  off-brand button is written — and stays out of planning/MCP turns.
- Two always-on rules is the right ceiling; keep rule files flat at `.cursor/rules/` root
  (nested dirs are documented but reported to silently fail).

## Skills — agent-reachable procedures
- **impeccable** (installed, v3.8) — the design-craft engine; auto-invokes on UI work via its
  description. Left as-is (well-formed: folder name == `name`).
- **add-migration** (added) — "do a Supabase migration the Pigment way": judgment in
  `SKILL.md`, the must-be-identical part in `scripts/new-migration.sh` (deterministic
  sequence + header). Pairs with the Supabase MCP; auto-invokes on schema work (e.g. PIG-204's
  `archived` status). `description` says *when*, which is what auto-invocation matches on.
- Skills use `paths` for glob scoping (not the rules' `globs`); `disable-model-invocation: true`
  makes a skill slash-only. Skills run in the `cursor` CLI too — so they reach the CI agent.
- **twg (Teamwork-Graph) skills** — seven skills installed user-global at `~/.claude/skills/twg*`
  (which Cursor scans), backed by the `twg` CLI. They're the *synthesis* layer over the Atlassian
  MCP — review queues, incident reviews, status rollups, "catch me up". The agent reaches for the
  narrowest one when needed; full loop map + guardrails in `docs/TEAMWORK-SKILLS.md`.

## Subagents — isolated specialists
- **reviewer** (added, `.cursor/agents/reviewer.md`) — `readonly: true`, `model: inherit`.
  Invoked `/reviewer` (forward slash). Verifies a finished diff against the design-system +
  project rules **before** the PR — same standard as Bugbot, shifted one step left. Clean
  context window: pass it the diff.
- Cursor's **built-in** Explore / Bash / Browser subagents cover research/shell/browser
  zero-config — cite them rather than authoring equivalents.
- Cursor frontmatter is `name · description · model · readonly · is_background` only —
  **never** Claude-Code's `tools:` or `color:`.

## Hooks — deterministic gates (the "same standard in three places")
- **afterFileEdit** → `a11y-gate.sh` — editor-time a11y/contrast gate (the leftmost catch of
  the contrast injury, before the PR).
- **beforeShellExecution** → `guard-shell.sh` (added) — the real, deterministic allow/deny gate
  that makes the headless `cursor-agent` boundedness true, not just claimed. Denies `git`
  mutations / `rm -rf` / `.env` writes / `.github` edits / outbound network; fires in the
  editor, the CLI, and cloud/CI agents.
- **preToolUse** → impeccable's pre-edit design guard (installed with the skill).
- Stdout is **snake_case**: `{"permission":"allow"|"deny"|"ask","user_message":…,"agent_message":…}`.
  Hooks **fail OPEN** — only an explicit `deny` (or exit 2) blocks; a crash allows the action,
  so we log and fail safe. Say this honestly when presenting governance.

## Verify on the demo machine, day-of
- Cursor version ≥ **2.4** (Skills + custom Subagents; Jan 2026) and ≥ **2.5** for one-level
  subagent nesting. Confirm Skills/Subagents load in-app.
- Re-check the **hooks stdout field casing** on cursor.com/docs (snake_case verified at build
  time, but it's the one contract worth eyeballing live).
- Confirm `design-system.mdc` Auto-Attaches on a `.tsx` edit and the three rules show under
  Settings → Rules with the expected types.
- The exact rule-generation command label varies by version (`/create-rule` vs `/create rule`).
