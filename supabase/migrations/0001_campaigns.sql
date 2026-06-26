-- Pigment Studio — campaigns table (the data behind the Campaigns surface).
create type campaign_status as enum ('draft', 'live', 'review');

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner text not null,
  status campaign_status not null default 'draft',
  updated_at date not null default current_date
);

alter table public.campaigns enable row level security;

-- Demo only: allow anonymous read so the public Campaigns page renders without auth.
create policy "Public read campaigns"
  on public.campaigns for select
  to anon, authenticated
  using (true);

insert into public.campaigns (name, owner, status, updated_at) values
  ('Summer Launch',        'Growth',           'live',   '2026-06-24'),
  ('Brand Refresh 2026',   'Design',           'review', '2026-06-23'),
  ('APJ Expansion',        'Field',            'draft',  '2026-06-22'),
  ('Acrobat AI Upsell',    'Document Cloud',   'live',   '2026-06-21'),
  ('Firefly Holiday Push', 'Creative Cloud',   'review', '2026-06-20'),
  ('Enterprise Onboarding','Experience Cloud', 'draft',  '2026-06-19');
