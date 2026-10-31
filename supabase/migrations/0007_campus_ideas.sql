-- 0007_campus_ideas.sql
-- Anonymous ideas board scoped to an institution.
-- author_id is stored but NEVER returned to clients (see RLS / view in 0008).
-- Supports upvotes, staff replies, reporting, and staff moderation (hidden flag).

create table ideas (
  id              uuid primary key default uuid_generate_v4(),
  institution_id  uuid not null references institutions(id) on delete cascade,
  author_id       uuid not null references profiles(id) on delete cascade,
  body            text not null,
  status          idea_status not null default 'new',
  upvote_count    integer not null default 0,
  hidden          boolean not null default false,
  created_at      timestamptz not null default now()
);

create table idea_votes (
  idea_id     uuid not null references ideas(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (idea_id, profile_id)
);

create table idea_replies (
  id          uuid primary key default uuid_generate_v4(),
  idea_id     uuid not null references ideas(id) on delete cascade,
  author_id   uuid not null references profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);

create table idea_reports (
  id          uuid primary key default uuid_generate_v4(),
  idea_id     uuid not null references ideas(id) on delete cascade,
  reporter_id uuid not null references profiles(id) on delete cascade,
  reason      text not null,
  created_at  timestamptz not null default now()
);

create index idx_ideas_institution on ideas(institution_id, created_at desc);

-- Function to increment upvote count atomically (avoids race conditions).
-- Inserts a vote row; if already voted, does nothing. Then recomputes the count.
create or replace function vote_on_idea(p_idea_id uuid, p_profile_id uuid)
returns void language plpgsql security definer as $$
begin
  insert into idea_votes (idea_id, profile_id) values (p_idea_id, p_profile_id)
  on conflict do nothing;
  update ideas set upvote_count = (
    select count(*) from idea_votes where idea_id = p_idea_id
  ) where id = p_idea_id;
end;
$$;
