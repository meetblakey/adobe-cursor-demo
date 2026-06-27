# Bugbot review guide — Pigment

Review PRs against the same standard the editor agent, **`/review-bugbot`** (IDE pre-push),
and `.cursor/rules/design-system.mdc` already enforce — so author and review share one
standard. Prefer a few high-confidence findings over many nits; cite `file:line` and the rule
violated.

## Flag
- **Tokens, never literals** — a hardcoded Tailwind color (`bg-pink-500`) or raw hex outside the
  token sources (`components/ui/status-badge.tsx`, `app/globals.css`). This is design-system
  drift, the most important class to catch (it's INJURY A).
- **WCAG AA** — any new/changed text-on-background pair below 4.5:1 (reason with `lib/contrast.ts`).
  Report the pair + ratio.
- **Reuse before authoring** — a one-off element duplicating a `@/components/ui` component.
- **RSC boundaries** — data fetched outside a Server Component, or `'use client'` where it isn't
  needed; the Supabase server client must keep `setAll` wrapped for read-only RSC contexts.
- **Tests** — a behaviour or token change that ships without a test, or weakens an assertion to
  go green.
- General correctness/security on the diff: missing error handling, unsafe input, secrets.

## Don't
- Re-flag unchanged code (Incremental Review is on).
- Block on style the linter/formatter owns.
