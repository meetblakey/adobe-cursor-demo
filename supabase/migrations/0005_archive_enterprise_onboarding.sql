-- archive_enterprise_onboarding
-- Keep status in sync with lib/campaigns-seed.ts: Enterprise Onboarding → archived.
-- Runs after 0004 commits the new enum value. Additive (never edits 0001/0002),
-- so prod converges to the seed's final state.

update public.campaigns set status = 'archived'
where name = 'Enterprise Onboarding';
