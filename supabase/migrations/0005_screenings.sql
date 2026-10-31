-- 0005_screenings.sql
-- AI screening results for screened-registration events.
-- Transcript, score, AI summary per registration.
-- Populated exclusively by the server-side AI pipeline (service role).
-- Accessible to: the applicant (own only) and the event organizers/owner.

create table screenings (
  id              uuid primary key default uuid_generate_v4(),
  registration_id uuid unique not null references registrations(id) on delete cascade,
  transcript      jsonb not null default '[]'::jsonb,
  score           integer check (score >= 0 and score <= 100),
  strengths       text[] not null default '{}',
  concerns        text[] not null default '{}',
  summary         text,
  recommendation  text,
  created_at      timestamptz not null default now()
);

create index idx_screenings_registration on screenings(registration_id);
