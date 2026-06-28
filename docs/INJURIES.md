# Seeded demo "injuries" — the specific fixes

`main` stays green and clean (the "good" state the room sees first). You introduce one of
these live, the audience sees something break **on the Campaigns page** (`/campaigns`), and
Cursor fixes it — calling out a **named component, on a named page, in specific language.**

Page under demo for both: **`/campaigns`** → `app/campaigns/page.tsx`.

---

## INJURY A — off-brand color on the Duplicate button → **Bugbot** (the PR gate)

**Where:** `components/campaigns/campaign-card.tsx` — the **`Duplicate` button** on every
campaign card.

> **Spectrum-world framing (since Layer 1 is React Spectrum).** The design system used to be a
> convention you could ignore; now it's the component contract. You can't put a Tailwind color
> on a Spectrum `Button` — so to go off-brand the engineer had to **abandon the system
> component entirely** and hand-roll a raw `<button>`. The smell is louder, not quieter, and
> the rule + Bugbot catch it the moment they fight the system. The fix is the same: use the
> Pigment `<Button variant="ghost">` (which now renders Spectrum when the flag is on).

**Apply (on a branch / PR):**
```diff
-        <Button variant="ghost" size="sm" className="h-11 w-full sm:h-8 sm:w-auto">
-          Duplicate
-        </Button>
+        <button className="h-11 w-full rounded-md bg-pink-500 px-2.5 text-[0.8rem] font-medium text-white hover:bg-pink-600 sm:h-8 sm:w-auto">
+          Duplicate
+        </button>
```
(Same sizing as the real control — only the design-token violation changes: a hardcoded
`bg-pink-500` literal instead of the `Button` variant, so it bypasses the system and won't theme.)

**What the room sees:** a magenta "Duplicate" button on every card, clashing with the indigo
brand — and it won't respond to dark mode. "One product engineer's shortcut, multiplied by
200 teams." `/campaigns` opens on the **grid** view, so the cards (and the off-brand button)
are on screen the moment you load the page.

**The exact prompt to type into Cursor (Cmd+K on the file, or chat):**
> "In `components/campaigns/campaign-card.tsx`, the **Duplicate** action is a raw `<button>`
> using `bg-pink-500 hover:bg-pink-600`. That bypasses the Pigment design system and won't
> theme. Replace it with our `<Button variant="ghost" size="sm" className="h-11 w-full sm:h-8 sm:w-auto">`
> so it inherits the design tokens, per `.cursor/rules/design-system`."

**What Bugbot should comment on the PR (rehearse that it does):**
> `components/campaigns/campaign-card.tsx` — hardcoded color `bg-pink-500` bypasses the design
> system (`.cursor/rules/design-system`: *tokens & system components, never literals*). Use
> `<Button variant="ghost">` so the control inherits `--primary`/theme tokens and dark mode.

---

## INJURY B — unreadable "In review" badge in dark mode → **`cursor-agent` in CI**

**Where:** `components/ui/status-tokens.ts` — the **`review`** status token, **dark** theme.
(This is the hand-authored hex map that powers the **legacy** StatusBadge — now the
pre-hydration SSR fallback, since Spectrum is client-only.)

> **Spectrum-world framing.** This is the *old* failure mode — a human picking a hex that fails
> contrast — and the a11y gate (`status-badge.test.ts`) still catches it in CI, because the
> legacy hex map is the SSR fallback. The hydrated UI is Spectrum: `StatusLight` with **semantic**
> variants (`neutral` / `positive` / `notice`) that Spectrum pre-validates AA in light *and* dark.
> There is no hand-authored hex in the rendered Spectrum chip to get wrong — the failure mode is
> **structurally impossible** there, and `components/ui/status-badge.spectrum.test.ts` asserts the
> mapping stays semantic. The demo is now CI-driven: the regression turns the build red and
> `cursor-agent` restores the token.

**Apply (on a branch / PR):**
```diff
-  review: { label: 'In review', light: { bg: '#FFF1D6', fg: '#8A4B00' }, dark: { bg: '#3A2A12', fg: '#E0A24E' } },
+  review: { label: 'In review', light: { bg: '#FFF1D6', fg: '#8A4B00' }, dark: { bg: '#3A2A12', fg: '#6A4A1E' } },
```
**What the room sees:** toggle to **Dark mode** (top-right) → the **"In review"** chips on the
"Brand Refresh 2026" and "Firefly Holiday Push" campaigns are nearly invisible. And CI goes
**red**: `npm test` → *StatusBadge "review" meets WCAG AA in dark mode* fails (the test prints
the actual ratio, ~1.7:1, vs the 4.5:1 bar).

**What `cursor-agent` does in the CI job** (headless, from the failing pipeline):
> reads the vitest failure → identifies `components/ui/status-tokens.ts`, `review.dark.fg` →
> chooses an on-brand amber that clears 4.5:1 on `#3A2A12` (restores `#E0A24E`) → pushes the
> fix and comments the PR. Bounded by allow/deny rules (deny `Shell(git)`, `Write(.env*)`).

**The exact prompt** (if you drive it in the editor instead of CI):
> "`components/ui/status-badge.test.ts` is failing: the **StatusBadge 'In review'** chip fails
> WCAG AA in dark mode — `components/ui/status-tokens.ts`, `review.dark.fg = #6A4A1E` on
> `#3A2A12`. Pick a foreground that clears 4.5:1 on that background and keep the chip
> on-brand amber. Don't touch the test."

---

## Reset & repeat demos

**Do not merge injury PRs.** Production and `main` stay clean; only PR previews show the break.

| Action | Shortcut |
|--------|----------|
| Restore clean files | **`/reset-injuries`** or `./.github/scripts/demo-injury.sh reset` |
| Apply A / B | **`/apply-injury-a`** · **`/apply-injury-b`** |
| Full rehearsal | **`/rehearse-injury-a`** · **`/rehearse-injury-b`** |
| Between demos | **`/demo-reset`** |

Full loop (tag/force-push for INJURY B replay, branch names, verify commands):
[`docs/DEMO-INJURIES.md`](DEMO-INJURIES.md)

Quick local undo (same as reset script):

```
git checkout main -- components/campaigns/campaign-card.tsx components/ui/status-tokens.ts
```
