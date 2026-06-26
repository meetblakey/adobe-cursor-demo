# Accessibility audit

Audit the changed files (or the whole `components/` + `app/` tree if asked) for WCAG issues a
product team would miss at scale.

1. Find every color pair (text on background) introduced or changed. For each, compute the
   WCAG contrast ratio with `lib/contrast.ts` and flag anything < 4.5:1 (normal) or < 3:1
   (large/bold). Report `file:line`, the pair, and the ratio.
2. Flag any **hardcoded** color (raw hex or Tailwind color literal like `bg-pink-500`) outside
   the token sources — that's design-system drift, per `.cursor/rules/design-system`.
3. Flag interactive elements missing a focus-visible state or an accessible name.
4. Propose the minimal token-based fix for each, and confirm `npm test` (the a11y gate) passes.

Prefer a few high-confidence findings over many nits. Cite the rule each one violates.
