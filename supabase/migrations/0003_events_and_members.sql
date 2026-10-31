-- 0003_events_and_members.sql
-- Events and event_members tables.
-- event_members tracks organizers and volunteers.
-- Participants are derived from registrations (not stored here).

create table events (
  id                      uuid primary key default uuid_generate_v4(),
  slug                    text unique not null,
  owner_id                uuid not null references profiles(id) on delete cascade,
  title                   text not null,
  description_structured  jsonb,
  type                    event_type not null default 'other',
  mode                    event_mode not null default 'offline',
  venue                   text,
  starts_at               timestamptz not null,
  ends_at                 timestamptz not null,
  cost_amount             numeric(10,2) not null default 0,
  payment_qr_url          text,
  registration_mode       registration_mode not null default 'direct',
  screening_criteria      jsonb,
  eligibility             jsonb not null default '{"type":"open"}'::jsonb,
  capacity                integer,
  cover_url               text,
  status                  event_status not null default 'draft',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint ends_after_starts check (ends_at > starts_at),
  constraint valid_cost check (cost_amount >= 0)
);

-- Event members: organizers and volunteers
-- Participants are derived from registrations table
create table event_members (
  event_id    uuid not null references events(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,
  role        event_role not null,
  added_at    timestamptz not null default now(),
  primary key (event_id, profile_id)
);

-- Indexes
create index idx_events_owner on events(owner_id);
create index idx_events_status on events(status);
create index idx_events_starts_at on events(starts_at);
create index idx_event_members_profile on event_members(profile_id);
