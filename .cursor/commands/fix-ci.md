# Fix the failing pipeline

Use when CI is red (also the behaviour the headless `cursor-agent` CI job performs).

1. Read the failing job output — start with the Vitest report and the typecheck/build errors.
2. Identify the **root cause**, not the symptom. For an a11y-gate failure, that's almost
   always a token in `components/ui/status-tokens.ts` (the legacy `STATUS_TOKENS` hex map) or
   `app/globals.css` that dropped below WCAG AA — fix the token to a value that clears the
   threshold and stays on-brand. (Under the Spectrum path the colors are semantic variants, so
   there is no hex to regress — see `components/ui/status-badge.spectrum.test.ts`.)
3. **Do not** weaken or delete the failing assertion to make it pass.
4. Make the smallest change, re-run `npm run typecheck && npm test && npm run build`, and
   summarise the diagnosis + fix in one paragraph (PR-comment ready).

Stay within the allow/deny permission rules: no `git` shell, no writes to `.env*`.
