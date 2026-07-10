-- schedule_apj_expansion
-- Keep status in sync with lib/campaigns-seed.ts: APJ Expansion → scheduled (PIG-206).
-- Runs after 0006 commits the new enum value. Additive (never edits 0001/0002),
-- so prod converges to the seed's final state.

update public.campaigns set status = 'scheduled'
where name = 'APJ Expansion';
