# New design-system component

Scaffold a new **platform-owned** component in the Pigment design system, on-spec by default.

Given a component name and purpose:

1. Create `components/ui/<name>.tsx`. Compose existing primitives where possible; use Base UI
   (`@base-ui/react`) for unstyled behaviour, styled with Tailwind tokens.
2. Use theme tokens only — never a hardcoded color. If a new semantic value is needed, add it
   to `app/globals.css` (light + dark) or the relevant token map, not inline.
3. If the component carries color pairs (badge/alert/etc.), add them to a `*_TOKENS` map and a
   matching contrast test asserting WCAG AA in both themes (mirror `status-badge.test.ts`).
4. Add a focus-visible state for any interactive element.
5. Run `npm run typecheck && npm test`.

Report the file created and the tokens used.
