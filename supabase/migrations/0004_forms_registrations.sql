-- 0004_forms_registrations.sql
-- Form fields for event registration forms and registrations.
-- form_fields defines the organizer-created registration form schema per event.
-- registrations stores each applicant's submission and lifecycle status.

create table form_fields (
  id          uuid primary key default uuid_generate_v4(),
  event_id    uuid not null references events(id) on delete cascade,
  label       text not null,
  type        text not null check (type in ('short_text','long_text','number','dropdown','checkbox','file')),
  options     jsonb,
  required    boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create table registrations (
  id                uuid primary key default uuid_generate_v4(),
  event_id          uuid not null references events(id) on delete cascade,
  profile_id        uuid not null references profiles(id) on delete cascade,
  answers           jsonb not null default '{}'::jsonb,
  payment_status    payment_status,
  payment_proof_url text,
  status            registration_status not null default 'submitted',
  checked_in_at     timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique(event_id, profile_id)
);

-- Indexes
create index idx_form_fields_event on form_fields(event_id, position);
create index idx_registrations_event on registrations(event_id);
create index idx_registrations_profile on registrations(profile_id);
create index idx_registrations_status on registrations(status);
