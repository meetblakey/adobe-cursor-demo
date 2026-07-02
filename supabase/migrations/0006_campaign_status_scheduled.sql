-- campaign_status_scheduled
-- Add the 'scheduled' value to the campaign_status enum (PIG-206).
-- Postgres will not let a newly added enum value be used in the same transaction
-- that adds it, so the backfill that sets a campaign to 'scheduled' lives in the
-- next migration (0007), which runs after this one commits.

alter type campaign_status add value if not exists 'scheduled';
