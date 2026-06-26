# Ship a ticket (document → link → done)

Close out a story honestly after the work passes. Argument: the story key (e.g. `PIG-3`).

1. Confirm the gates are green: `npm run typecheck && npm test && npm run build`.
2. **Document the decision.** Append a short ADR (what you chose + why, one paragraph) to the
   Confluence **Decision Log** with `updateConfluencePage`. If this phase changed the design
   system or pipeline, update the **Design System Spec** / **SDLC Pipeline** page too.
3. `addWorklogToJiraIssue` with the effort, and a closing comment summarising what shipped.
4. Link the PR to the story with `createIssueLink`.
5. `transitionJiraIssue` to **Done**.

Never weaken a test to go green. If a production issue surfaces later (via Sentry), open a NEW
story with `createJiraIssue` in epic PIG — don't reopen this one. Stay scoped to PIG / Pigment.
