# Start a ticket (pull → plan → in progress)

Begin work on a Jira story the right way. Argument: a story key (e.g. `PIG-3`); if none given,
pick the top To Do story in epic PIG with `searchJiraIssuesUsingJql`.

1. `getJiraIssue` the story. Read its acceptance criteria and open the linked Confluence page
   (`getConfluencePage`) for the design context.
2. Enter Plan mode and produce an editable spec for this phase (per `docs/BUILD-PLAN.md`).
3. Post the plan back as a comment with `addCommentToJiraIssue`.
4. `getTransitionsForJiraIssue` → `transitionJiraIssue` to **In Progress**.
5. Summarise: the story, the plan, and the files you're about to touch. Then build.

Do not write code before the story is pulled and the plan is posted. Stay scoped to PIG.
