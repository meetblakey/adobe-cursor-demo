---
name: add-migration
description: Generate a Supabase migration the Pigment way (sequential naming + RLS + matching types). Use when a ticket adds or alters database schema — e.g. a new campaign status or column.
---

Add a database change as a versioned, RLS-safe migration consistent with the repo. The judgment
is here; the must-be-identical scaffolding is in `scripts/new-migration.sh`.

1. Read the latest file in `supabase/migrations/` for the naming + RLS pattern, and
   `lib/campaigns.ts` for the current types.
2. Run `scripts/new-migration.sh <slug>` to scaffold the next-numbered migration file
   deterministically (e.g. `0002_add_archived_status.sql`).
3. Write the up SQL. New table/column → add or extend the RLS policy (anon read is demo-only).
   **Enum adds are TWO migrations, always.** Postgres will not let a newly added enum value be
   used in the same transaction that adds it, so a new `campaigns.status` value ships as a pair:
   first `NNNN_<status>.sql` with `alter type campaign_status add value if not exists '<status>';`,
   then `NNNN+1_<backfill>.sql` with the `update` that uses it. Mirror the shipped pairs
   0004/0005 (`archived`, PIG-204) and 0006/0007 (`scheduled`, PIG-206). Note the reverse is
   NOT symmetric: Postgres cannot drop an enum value, so rolling back means reverting the
   backfill only and leaving the value in the enum (additive, harmless).
4. Keep the app in sync: update `CampaignStatus` in `components/ui/status-tokens.ts` (add the
   `STATUS_TOKENS` pair — light + dark, both WCAG AA so `status-badge.test.ts` stays green — and
   the `SPECTRUM_STATUS` semantic variant for the Spectrum path) and the `Campaign` type in
   `lib/campaigns-types.ts`.
5. **Apply across tiers** (see `docs/ENVIRONMENTS.md`): run the migration against the **staging**
   Supabase project first, validate on a Vercel preview, then apply to **production** — never
   skip staging.
6. Per `.cursor/rules/planning.mdc`, note the change as an ADR on the Confluence Design System
   Spec, and keep `npm test` green.
