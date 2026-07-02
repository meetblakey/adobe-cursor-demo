# Seeded demo "injuries" — the specific fixes

`main` stays green and clean, but the **room doesn't open on a clean page**: the 101 opens with
**INJURY A already applied** (uncommitted, on `main` — `demo-injury.sh start-101`), and in the
201 the same drift rides the staged **PIG-206** PR. The audience sees something break **on the
Campaigns page** (`/campaigns`), and Cursor fixes it — a **named component, on a named page, in
specific language.**

Page under demo for both: **`/campaigns`** → `app/campaigns/page.tsx`.

**Where each injury lives per session:**

| | 101 (editor) | 201 (pipeline) |
|---|---|---|
| **A** | Pre-applied on `main`, uncommitted (`start-101`); fixed live with Cmd-K; never pushed | Baked into the PIG-206 commit ("Priya missed it"); **Bugbot** catches it on push 1; fixed live on the PR |
| **B** | not used | Landed mid-room as a follow-up commit (`replay-b`); CI goes red; **`fix-ci`** self-heals |

**The PIG-206 PR is the ONE injury-carrying branch that ever merges** — by merge time both
injuries have been fixed *on the branch* (that's the story: the gates caught them). After the
session the merge is reverted on `main` (see [`DEMO-INJURIES.md`](DEMO-INJURIES.md#post-201-reset)).
Standalone `demo/injury-a` / `demo/injury-b` rehearsal PRs are never merged.

---

## INJURY A — off-brand color on the Duplicate button → **Bugbot** (the PR gate)

**Where:** `components/campaigns/campaign-card.tsx` — the **`Duplicate` button** on every
campaign card.

> **Spectrum-world framing (since Layer 1 is React Spectrum).** The design system used to be a
> convention you could ignore; now it's the component contract. You can't put a Tailwind color
> on a Spectrum `Button` — so to go off-brand the engineer had to **abandon the system
> component entirely** and hand-roll a raw `<button>`. The smell is louder, not quieter, and
> the rule + Bugbot catch it the moment they fight the system. The fix is the same: use the
> Pigment `<Button variant="ghost">` (which renders Spectrum by default).

**Apply** — `.demo/injury-a.patch` (via `start-101` on main for the 101; baked into
`stage-scheduled-pr.sh` for the 201):
```diff
-        <Button variant="ghost" size="sm" className="h-11 w-full sm:h-8 sm:w-auto">
+        <button className="h-11 w-full rounded-md bg-pink-500 px-2.5 text-[0.8rem] font-medium text-white hover:bg-pink-600 sm:h-8 sm:w-auto">
           Duplicate
-        </Button>
+        </button>
```
(Same sizing as the real control — only the design-token violation changes: a hardcoded
`bg-pink-500` literal instead of the `Button` variant, so it bypasses the system and won't theme.)

**What the room sees:** a magenta "Duplicate" button on every card, clashing with the indigo
brand — and it won't respond to dark mode. "One product engineer's shortcut, multiplied by
200 teams." `/campaigns` opens on the **grid** view, so the off-brand button is on screen the
moment the page loads. `npm test` stays **green** — no test catches a design-token violation;
only review does.

**The exact fix prompt (Cmd-K on the file — the 101 fix and the 201 live fix are the same):**
> "In `components/campaigns/campaign-card.tsx`, the **Duplicate** action is a raw `<button>`
> using `bg-pink-500 hover:bg-pink-600`. That bypasses the Pigment design system and won't
> theme. Replace it with our `<Button variant="ghost" size="sm" className="h-11 w-full sm:h-8 sm:w-auto">`
> so it inherits the design tokens, per `.cursor/rules/design-system`."

**What Bugbot should comment on the PIG-206 PR (rehearse that it does):**
> `components/campaigns/campaign-card.tsx` — hardcoded color `bg-pink-500` bypasses the design
> system (*tokens & system components, never literals* — the standard in `.cursor/BUGBOT.md`).
> Use `<Button variant="ghost">` so the control inherits `--primary`/theme tokens and dark mode.

---

## INJURY B — a hand-authored hex fails AA → **`cursor-agent` in CI**

**Where:** `components/ui/status-tokens.ts` — the **`review`** status token, **dark** theme.
(This is the hand-authored hex map that powers the **legacy** StatusBadge — the pre-hydration
SSR fallback, since Spectrum is client-only.)

> **Spectrum-world framing.** This is the *old* failure mode — a human picking a hex that fails
> contrast. The hydrated, **rendered default is Spectrum's `StatusLight`** with semantic
> variants (`neutral` / `positive` / `notice` / `info`) that Spectrum pre-validates AA in light
> *and* dark — there is no hand-authored hex in the rendered chip to get wrong, and
> `status-badge.spectrum.test.ts` asserts the mapping stays semantic. So the regression is
> **CI-visible, not room-visible**: the page looks fine; the build goes red.

**Apply** — `.demo/injury-b.patch` (mid-room: `demo-injury.sh replay-b`, which commits it on
top of HEAD):
```diff
-  review: { label: 'In review', light: { bg: '#FFF1D6', fg: '#8A4B00' }, dark: { bg: '#3A2A12', fg: '#E0A24E' } },
+  review: { label: 'In review', light: { bg: '#FFF1D6', fg: '#8A4B00' }, dark: { bg: '#3A2A12', fg: '#6A4A1E' } },
```

**What the room sees:** **the page, unchanged** — the rendered "In review" chips are Spectrum
StatusLights and stay readable in both themes. What goes loud is **CI**: `npm test` →
*StatusBadge "review" meets WCAG AA in dark mode* fails (the test prints the actual ratio,
~1.7:1, vs the 4.5:1 bar). That's the talking point: at 200-team scale you don't rely on
someone *noticing* — the a11y contract is a build gate. (The broken hex is real, though — it's
the SSR fallback chip pre-hydration, and any consumer still on the legacy path would ship it.)

**What `cursor-agent` does in the CI job** (headless, from the failing pipeline):
> reads the vitest failure → identifies `components/ui/status-tokens.ts`, `review.dark.fg` →
> chooses an on-brand amber that clears 4.5:1 on `#3A2A12` (restores `#E0A24E`) → commits to
> the same PR and comments its diagnosis. Bounded by allow/deny rules (deny `Shell(git)`,
> `Write(.env*)`; the workflow owns commit/push).

**The exact prompt** (if you drive it in the editor instead of CI — `/fix-ci`):
> "`components/ui/status-badge.test.ts` is failing: the **StatusBadge 'In review'** chip fails
> WCAG AA in dark mode — `components/ui/status-tokens.ts`, `review.dark.fg = #6A4A1E` on
> `#3A2A12`. Pick a foreground that clears 4.5:1 on that background and keep the chip
> on-brand amber. Don't touch the test."

---

## Reset & repeat demos

**Only the in-room PIG-206 PR merges** (with both injuries fixed on it); revert it on `main`
afterwards. Standalone rehearsal PRs are closed, never merged.

| Action | Shortcut |
|--------|----------|
| 101 start state (A on main, uncommitted) | `./.github/scripts/demo-injury.sh start-101` |
| Stage the 201 PR (scheduled + A) | **`/stage-scheduled-pr`** |
| Mid-room INJURY B (commit on top) | `./.github/scripts/demo-injury.sh replay-b` |
| Restore clean files | **`/reset-injuries`** or `demo-injury.sh reset` |
| Apply A / B on a branch | **`/apply-injury-a`** · **`/apply-injury-b`** |
| Standalone rehearsals | **`/rehearse-injury-a`** · **`/rehearse-injury-b`** |
| Between demos | **`/demo-reset`** · post-merge: [post-201 reset](DEMO-INJURIES.md#post-201-reset) |

Full loop (branch names, verify commands, the mid-room tip-never-moves-backwards rule):
[`docs/DEMO-INJURIES.md`](DEMO-INJURIES.md)

Quick local undo (same as reset script — also restores the Scheduled files + removes
migrations 0006/0007):

```
./.github/scripts/demo-injury.sh reset
```
