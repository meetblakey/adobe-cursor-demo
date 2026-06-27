-- campaign_story_fields
-- Keep UPDATE/INSERT values in sync with lib/campaigns-seed.ts

alter table public.campaigns
  add column if not exists summary text not null default '',
  add column if not exists channels text[] not null default '{}',
  add column if not exists campaign_type text not null default '';

update public.campaigns set
  summary = 'Seasonal Creative Cloud feature push across digital surfaces.',
  channels = array['In-app', 'Email', 'Web'],
  campaign_type = 'Product launch'
where name = 'Summer Launch';

update public.campaigns set
  summary = 'Cross-product visual identity rollout for 200+ Pigment surfaces.',
  channels = array['Design system', 'In-app'],
  campaign_type = 'Brand awareness'
where name = 'Brand Refresh 2026';

update public.campaigns set
  summary = 'Enterprise trial go-to-market for APJ field teams.',
  channels = array['Field events', 'Email'],
  campaign_type = 'Lead generation'
where name = 'APJ Expansion';

update public.campaigns set
  summary = 'Document Cloud AI tier upgrade for existing subscribers.',
  channels = array['In-app', 'Email', 'Paid social'],
  campaign_type = 'Product launch'
where name = 'Acrobat AI Upsell';

update public.campaigns set
  summary = 'Holiday generative-AI awareness and trial activation.',
  channels = array['Social', 'Email', 'Web'],
  campaign_type = 'Brand awareness'
where name = 'Firefly Holiday Push';

update public.campaigns set
  summary = 'Experience Cloud admin onboarding for new enterprise tenants.',
  channels = array['Email', 'In-app', 'Sales enablement'],
  campaign_type = 'Lead generation'
where name = 'Enterprise Onboarding';

insert into public.campaigns (name, owner, status, updated_at, summary, channels, campaign_type)
select 'Summer Launch', 'Growth', 'live', '2026-06-24',
  'Seasonal Creative Cloud feature push across digital surfaces.',
  array['In-app', 'Email', 'Web'], 'Product launch'
where not exists (select 1 from public.campaigns where name = 'Summer Launch');

insert into public.campaigns (name, owner, status, updated_at, summary, channels, campaign_type)
select 'Brand Refresh 2026', 'Design', 'review', '2026-06-23',
  'Cross-product visual identity rollout for 200+ Pigment surfaces.',
  array['Design system', 'In-app'], 'Brand awareness'
where not exists (select 1 from public.campaigns where name = 'Brand Refresh 2026');

insert into public.campaigns (name, owner, status, updated_at, summary, channels, campaign_type)
select 'APJ Expansion', 'Field', 'draft', '2026-06-22',
  'Enterprise trial go-to-market for APJ field teams.',
  array['Field events', 'Email'], 'Lead generation'
where not exists (select 1 from public.campaigns where name = 'APJ Expansion');

insert into public.campaigns (name, owner, status, updated_at, summary, channels, campaign_type)
select 'Acrobat AI Upsell', 'Document Cloud', 'live', '2026-06-21',
  'Document Cloud AI tier upgrade for existing subscribers.',
  array['In-app', 'Email', 'Paid social'], 'Product launch'
where not exists (select 1 from public.campaigns where name = 'Acrobat AI Upsell');

insert into public.campaigns (name, owner, status, updated_at, summary, channels, campaign_type)
select 'Firefly Holiday Push', 'Creative Cloud', 'review', '2026-06-20',
  'Holiday generative-AI awareness and trial activation.',
  array['Social', 'Email', 'Web'], 'Brand awareness'
where not exists (select 1 from public.campaigns where name = 'Firefly Holiday Push');

insert into public.campaigns (name, owner, status, updated_at, summary, channels, campaign_type)
select 'Enterprise Onboarding', 'Experience Cloud', 'draft', '2026-06-19',
  'Experience Cloud admin onboarding for new enterprise tenants.',
  array['Email', 'In-app', 'Sales enablement'], 'Lead generation'
where not exists (select 1 from public.campaigns where name = 'Enterprise Onboarding');
