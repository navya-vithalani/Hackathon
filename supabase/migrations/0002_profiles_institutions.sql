-- 0002_profiles_institutions.sql
-- Creates institutions and profiles tables.
-- profiles.id mirrors auth.users.id. A trigger auto-creates a profile on signup.

-- Institutions (deduped by place_id)
create table institutions (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  address     text,
  place_id    text unique not null,
  provider    institution_provider not null default 'manual',
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- User profiles (one per auth.users row)
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text not null,
  account_type    account_type not null,
  institution_id  uuid references institutions(id),
  grade           text,
  stream          text,
  designation     text,
  avatar_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-create profile row on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, account_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'account_type', 'student')::account_type
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
create index idx_profiles_institution on profiles(institution_id);
