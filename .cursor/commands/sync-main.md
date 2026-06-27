# Sync main into your feature branch (stay current)

Pull the team's latest approved code from `main` into your feature branch. Run at the
**start of each work session** (or daily) so conflicts stay small and local.

Argument: optional branch name (e.g. `PIG-8`). Defaults to the current branch.

1. Confirm you are **not** on `main` and have **no uncommitted changes** (commit or stash first).

2. Run the repo script from the project root:

   ```bash
   ./.github/scripts/sync-main-into-branch.sh [branch-name]
   ```

   Equivalent manual steps (what the script does):

   - `git fetch origin main`
   - `git checkout main` → `git pull --ff-only origin main`
   - `git checkout <feature-branch>`
   - `git merge main`

3. If the merge conflicts, resolve in the editor, `git add` the fixes, and `git commit`.
   Do not push to `main`.

4. Resume building on the feature branch. Continue with **`/open-pr`** when ready to ship.

Do not use `git rebase main` here — this repo standardises on **merge** to match the PR
merge flow and keep history predictable for the demo.
