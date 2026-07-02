-- campaign_status_archived
-- Add the 'archived' value to the campaign_status enum (PIG-204, the archived-status story).
-- Postgres will not let a newly added enum value be used in the same transaction
-- that adds it, so the backfill that sets a campaign to 'archived' lives in the
-- next migration (0005), which runs after this one commits.

alter type campaign_status add value if not exists 'archived';
