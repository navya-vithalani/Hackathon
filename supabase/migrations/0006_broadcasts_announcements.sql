-- 0006_broadcasts_announcements.sql
-- Event broadcasts (per-event messages to specific audiences)
-- and institution announcements (staff → institution members).
-- Broadcasts are delivered via Supabase Realtime; audience is enforced by RLS.

create table broadcasts (
  id                    uuid primary key default uuid_generate_v4(),
  event_id              uuid not null references events(id) on delete cascade,
  author_id             uuid not null references profiles(id) on delete cascade,
  audience              broadcast_audience not null,
  audience_profile_ids  uuid[],
  body                  text not null,
  created_at            timestamptz not null default now()
);

create table announcements (
  id              uuid primary key default uuid_generate_v4(),
  institution_id  uuid not null references institutions(id) on delete cascade,
  author_id       uuid not null references profiles(id) on delete cascade,
  title           text not null,
  body            text not null,
  created_at      timestamptz not null default now()
);

create index idx_broadcasts_event on broadcasts(event_id, created_at desc);
create index idx_announcements_institution on announcements(institution_id, created_at desc);
