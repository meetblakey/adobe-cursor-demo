# Bootstrap the plan (Jira + Confluence, via Atlassian MCP)

One-shot: stand up the whole live planning environment from the on-disk spec. Cursor handles
everything through the Atlassian MCP. Source of truth: `docs/PLAN.md`.

1. Confirm access: `atlassianUserInfo` + `getAccessibleAtlassianResources`. Find or create the
   Jira project (key **PIG**) with `getVisibleJiraProjects` / `createJiraIssue` metadata, and
   the Confluence space **Pigment** with `getConfluenceSpaces`.
2. Create the Confluence pages from `docs/PLAN.md` (Overview & PRD, Architecture & Conventions,
   Design System Spec, SDLC Pipeline, Demo Runbook, and an empty **Decision Log**), seeded from
   the matching on-disk docs, via `createConfluencePage`.
3. Create the epic **PIG — Build Pigment** and every "plan phase" story (PIG-1…PIG-7) plus the
   demo-prep stories (PIG-101, PIG-102, PIG-204) with `createJiraIssue` — each description
   carrying its acceptance criteria, each linked to its Confluence page with `createIssueLink`.
4. Leave all stories in **To Do**. Report the created keys + page URLs.

Scope strictly to project **PIG** and space **Pigment**. Use returned keys/IDs — never invent
them. Idempotent: if an item already exists, update it rather than duplicating.
