# New design-system component

Scaffold a new **platform-owned** component in the Pigment design system, on-spec by default.

Given a component name and purpose:

1. Create `components/ui/<name>.tsx`.
2. Preserve the stable Pigment prop API at the call site.
3. Prefer Adobe React Spectrum for the hydrated hot path when the component maps cleanly to
   Spectrum primitives.
4. Keep the legacy shadcn/Base UI/Tailwind path only as the pre-hydration SSR fallback or when
   Spectrum does not support the behavior.
5. Use semantic props and theme tokens only — never hardcoded color literals.
6. If the component carries color pairs, add a token map and a WCAG-AA contrast test.
7. Add focus-visible and keyboard behavior.
8. Run `npm run typecheck && npm test && npm run build`.

Report the file created, the Spectrum primitive or fallback used, and the tokens or semantic
variants chosen.
