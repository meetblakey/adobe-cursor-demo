-- campaign_detail_json
-- Optional JSONB column for production detail parity; seed fallback used when null.

alter table public.campaigns
  add column if not exists detail jsonb;

-- Detail narrative lives in lib/campaign-details-seed.ts for local/preview tiers.
-- Production can backfill detail JSON per campaign name when ready.
