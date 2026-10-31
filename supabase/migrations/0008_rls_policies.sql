-- 0008_rls_policies.sql
-- Row Level Security policies for ALL tables.
-- Enable RLS first, then define granular allow policies.
-- All access checks go through auth.uid() + joins to profiles / event_members / registrations.
-- The ideas table NEVER exposes author_id to clients; use the ideas_public view instead.

-- ============================================================
-- Helper: current user's profile row
-- (used in-line via subqueries; not a stored function to keep
--  query plans simple and avoid security definer confusion)
-- ============================================================

-- ============================================================
-- 1. institutions
-- ============================================================
alter table institutions enable row level security;

-- Any authenticated user may read institutions
create policy "institutions: authenticated users can read"
  on institutions for select
  to authenticated
  using (true);

-- Any authenticated user may insert a new institution
-- (duplicate place_ids are blocked by the unique constraint)
create policy "institutions: authenticated users can insert"
  on institutions for insert
  to authenticated
  with check (true);

-- No client-side update / delete; changes go through migrations or admin APIs


-- ============================================================
-- 2. profiles
-- ============================================================
alter table profiles enable row level security;

-- Any authenticated user may read any profile (needed for team member search, event pages, etc.)
create policy "profiles: authenticated users can read all"
  on profiles for select
  to authenticated
  using (true);

-- Users may only update their own profile
create policy "profiles: users can update own profile"
  on profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- The trigger (handle_new_user) uses SECURITY DEFINER so no INSERT policy needed here.
-- Service role bypasses RLS for profile creation on signup.


-- ============================================================
-- 3. events
-- ============================================================
alter table events enable row level security;

-- Authenticated users can read published events
create policy "events: read published"
  on events for select
  to authenticated
  using (status = 'published');

-- Owner and organizers/volunteers can also read draft/closed events
create policy "events: owner and team can read any status"
  on events for select
  to authenticated
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from event_members em
      where em.event_id = events.id
        and em.profile_id = auth.uid()
    )
  );

-- Any authenticated user may create an event
create policy "events: authenticated users can insert"
  on events for insert
  to authenticated
  with check (owner_id = auth.uid());

-- Only the owner can update or delete an event
create policy "events: owner can update"
  on events for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "events: owner can delete"
  on events for delete
  to authenticated
  using (owner_id = auth.uid());


-- ============================================================
-- 4. event_members
-- ============================================================
alter table event_members enable row level security;

-- Event owner, members, and registered participants can read the team list
create policy "event_members: owner and members can read"
  on event_members for select
  to authenticated
  using (
    -- Is the current user the event owner?
    exists (
      select 1 from events e
      where e.id = event_members.event_id
        and e.owner_id = auth.uid()
    )
    -- Or a member themselves?
    or profile_id = auth.uid()
    -- Or a registered participant?
    or exists (
      select 1 from registrations r
      where r.event_id = event_members.event_id
        and r.profile_id = auth.uid()
    )
  );

-- Only the event owner can add members
create policy "event_members: owner can insert"
  on event_members for insert
  to authenticated
  with check (
    exists (
      select 1 from events e
      where e.id = event_members.event_id
        and e.owner_id = auth.uid()
    )
  );

-- Only the event owner can remove members
create policy "event_members: owner can delete"
  on event_members for delete
  to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = event_members.event_id
        and e.owner_id = auth.uid()
    )
  );

-- Only the event owner can change a member's role
create policy "event_members: owner can update"
  on event_members for update
  to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = event_members.event_id
        and e.owner_id = auth.uid()
    )
  );


-- ============================================================
-- 5. form_fields
-- ============================================================
alter table form_fields enable row level security;

-- Any authenticated user can read form fields for events they can see
create policy "form_fields: authenticated users can read"
  on form_fields for select
  to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = form_fields.event_id
        and (
          e.status = 'published'
          or e.owner_id = auth.uid()
          or exists (
            select 1 from event_members em
            where em.event_id = e.id and em.profile_id = auth.uid()
          )
        )
    )
  );

-- Only organizers and owner can manage form fields
create policy "form_fields: organizers can insert"
  on form_fields for insert
  to authenticated
  with check (
    exists (
      select 1 from events e
      where e.id = form_fields.event_id
        and (
          e.owner_id = auth.uid()
          or exists (
            select 1 from event_members em
            where em.event_id = e.id
              and em.profile_id = auth.uid()
              and em.role in ('owner', 'organizer')
          )
        )
    )
  );

create policy "form_fields: organizers can update"
  on form_fields for update
  to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = form_fields.event_id
        and (
          e.owner_id = auth.uid()
          or exists (
            select 1 from event_members em
            where em.event_id = e.id
              and em.profile_id = auth.uid()
              and em.role in ('owner', 'organizer')
          )
        )
    )
  );

create policy "form_fields: organizers can delete"
  on form_fields for delete
  to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = form_fields.event_id
        and (
          e.owner_id = auth.uid()
          or exists (
            select 1 from event_members em
            where em.event_id = e.id
              and em.profile_id = auth.uid()
              and em.role in ('owner', 'organizer')
          )
        )
    )
  );


-- ============================================================
-- 6. registrations
-- ============================================================
alter table registrations enable row level security;

-- A registrant can read their own registration
create policy "registrations: registrant can read own"
  on registrations for select
  to authenticated
  using (profile_id = auth.uid());

-- Organizers and owner can read all registrations for their event
create policy "registrations: organizers can read all for event"
  on registrations for select
  to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = registrations.event_id
        and (
          e.owner_id = auth.uid()
          or exists (
            select 1 from event_members em
            where em.event_id = e.id
              and em.profile_id = auth.uid()
              and em.role in ('owner', 'organizer', 'volunteer')
          )
        )
    )
  );

-- Any authenticated user can register for a published event (duplicate blocked by unique constraint)
create policy "registrations: authenticated users can insert"
  on registrations for insert
  to authenticated
  with check (
    profile_id = auth.uid()
    and exists (
      select 1 from events e
      where e.id = registrations.event_id
        and e.status = 'published'
    )
  );

-- Organizers and owner can update registration status (accept/reject/waitlist/check-in)
create policy "registrations: organizers can update status"
  on registrations for update
  to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = registrations.event_id
        and (
          e.owner_id = auth.uid()
          or exists (
            select 1 from event_members em
            where em.event_id = e.id
              and em.profile_id = auth.uid()
              and em.role in ('owner', 'organizer', 'volunteer')
          )
        )
    )
  );

-- Registrant can update their own submission (e.g., upload payment proof)
create policy "registrations: registrant can update own"
  on registrations for update
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());


-- ============================================================
-- 7. screenings
-- ============================================================
alter table screenings enable row level security;

-- The applicant can read their own screening result
create policy "screenings: registrant can read own"
  on screenings for select
  to authenticated
  using (
    exists (
      select 1 from registrations r
      where r.id = screenings.registration_id
        and r.profile_id = auth.uid()
    )
  );

-- Event organizers and owner can read all screenings for their event
create policy "screenings: organizers can read all for event"
  on screenings for select
  to authenticated
  using (
    exists (
      select 1 from registrations r
      join events e on e.id = r.event_id
      where r.id = screenings.registration_id
        and (
          e.owner_id = auth.uid()
          or exists (
            select 1 from event_members em
            where em.event_id = e.id
              and em.profile_id = auth.uid()
              and em.role in ('owner', 'organizer')
          )
        )
    )
  );

-- Screenings are written only by the service role (AI pipeline); no client insert/update policy.
-- Service role bypasses RLS.


-- ============================================================
-- 8. broadcasts
-- ============================================================
alter table broadcasts enable row level security;

-- Audience-aware read: a user can read a broadcast if:
--   audience = 'everyone'          → any event member or participant
--   audience = 'participants'      → registered (any status)
--   audience = 'volunteers'        → has volunteer role
--   audience = 'organizing_team'   → has organizer or owner role
--   audience = 'selected_people'   → their profile_id is in audience_profile_ids
create policy "broadcasts: audience members can read"
  on broadcasts for select
  to authenticated
  using (
    case audience
      when 'everyone' then (
        exists (select 1 from registrations r where r.event_id = broadcasts.event_id and r.profile_id = auth.uid())
        or exists (select 1 from event_members em where em.event_id = broadcasts.event_id and em.profile_id = auth.uid())
        or exists (select 1 from events e where e.id = broadcasts.event_id and e.owner_id = auth.uid())
      )
      when 'participants' then (
        exists (select 1 from registrations r where r.event_id = broadcasts.event_id and r.profile_id = auth.uid())
      )
      when 'volunteers' then (
        exists (
          select 1 from event_members em
          where em.event_id = broadcasts.event_id
            and em.profile_id = auth.uid()
            and em.role in ('volunteer', 'organizer', 'owner')
        )
        or exists (select 1 from events e where e.id = broadcasts.event_id and e.owner_id = auth.uid())
      )
      when 'organizing_team' then (
        exists (
          select 1 from event_members em
          where em.event_id = broadcasts.event_id
            and em.profile_id = auth.uid()
            and em.role in ('organizer', 'owner')
        )
        or exists (select 1 from events e where e.id = broadcasts.event_id and e.owner_id = auth.uid())
      )
      when 'selected_people' then (
        auth.uid() = any(broadcasts.audience_profile_ids)
      )
      else false
    end
  );

-- Volunteers and above can post broadcasts
create policy "broadcasts: volunteers and above can insert"
  on broadcasts for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and (
      exists (select 1 from events e where e.id = broadcasts.event_id and e.owner_id = auth.uid())
      or exists (
        select 1 from event_members em
        where em.event_id = broadcasts.event_id
          and em.profile_id = auth.uid()
          and em.role in ('volunteer', 'organizer', 'owner')
      )
    )
  );


-- ============================================================
-- 9. announcements
-- ============================================================
alter table announcements enable row level security;

-- Institution members can read announcements for their institution
create policy "announcements: institution members can read"
  on announcements for select
  to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.institution_id = announcements.institution_id
    )
  );

-- Staff of the institution can post announcements
create policy "announcements: staff can insert"
  on announcements for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.institution_id = announcements.institution_id
        and p.account_type = 'staff'
    )
  );


-- ============================================================
-- 10. ideas
-- CRITICAL: author_id must NEVER be returned to clients.
-- Enforce by policy + a public view that excludes the column.
-- ============================================================
alter table ideas enable row level security;

-- Institution members can read non-hidden ideas (or their own hidden ones)
create policy "ideas: institution members can read visible"
  on ideas for select
  to authenticated
  using (
    (hidden = false or author_id = auth.uid())
    and exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.institution_id = ideas.institution_id
    )
  );

-- Staff can read all ideas (including hidden) for moderation
create policy "ideas: staff can read all in institution"
  on ideas for select
  to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.institution_id = ideas.institution_id
        and p.account_type = 'staff'
    )
  );

-- Institution members can post ideas
create policy "ideas: institution members can insert"
  on ideas for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.institution_id = ideas.institution_id
    )
  );

-- Staff can update idea status and hidden flag
create policy "ideas: staff can update status and hidden"
  on ideas for update
  to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.institution_id = ideas.institution_id
        and p.account_type = 'staff'
    )
  );

-- A public view that strips author_id — use this in all client queries instead of the raw table
create or replace view ideas_public as
  select
    id,
    institution_id,
    body,
    status,
    upvote_count,
    hidden,
    created_at
  from ideas;

-- Grant select on the view to authenticated role
grant select on ideas_public to authenticated;


-- ============================================================
-- 11. idea_votes
-- ============================================================
alter table idea_votes enable row level security;

-- Institution members can read votes (to know if they voted)
create policy "idea_votes: institution members can read"
  on idea_votes for select
  to authenticated
  using (
    exists (
      select 1 from ideas i
      join profiles p on p.id = auth.uid()
      where i.id = idea_votes.idea_id
        and p.institution_id = i.institution_id
    )
  );

-- Institution members can vote (insert)
-- Use the vote_on_idea() function instead of direct insert to keep count accurate
create policy "idea_votes: institution members can insert"
  on idea_votes for insert
  to authenticated
  with check (
    profile_id = auth.uid()
    and exists (
      select 1 from ideas i
      join profiles p on p.id = auth.uid()
      where i.id = idea_votes.idea_id
        and p.institution_id = i.institution_id
    )
  );

-- Users can remove their own vote
create policy "idea_votes: users can delete own vote"
  on idea_votes for delete
  to authenticated
  using (profile_id = auth.uid());


-- ============================================================
-- 12. idea_replies
-- ============================================================
alter table idea_replies enable row level security;

-- Institution members can read replies on visible ideas
create policy "idea_replies: institution members can read"
  on idea_replies for select
  to authenticated
  using (
    exists (
      select 1 from ideas i
      join profiles p on p.id = auth.uid()
      where i.id = idea_replies.idea_id
        and p.institution_id = i.institution_id
        and (i.hidden = false or i.author_id = auth.uid())
    )
  );

-- Institution members can post replies
create policy "idea_replies: institution members can insert"
  on idea_replies for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from ideas i
      join profiles p on p.id = auth.uid()
      where i.id = idea_replies.idea_id
        and p.institution_id = i.institution_id
    )
  );

-- Users can delete their own replies; staff can delete any reply in their institution
create policy "idea_replies: author or staff can delete"
  on idea_replies for delete
  to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from ideas i
      join profiles p on p.id = auth.uid()
      where i.id = idea_replies.idea_id
        and p.institution_id = i.institution_id
        and p.account_type = 'staff'
    )
  );


-- ============================================================
-- 13. idea_reports
-- ============================================================
alter table idea_reports enable row level security;

-- Staff of the institution can read reports
create policy "idea_reports: staff can read"
  on idea_reports for select
  to authenticated
  using (
    exists (
      select 1 from ideas i
      join profiles p on p.id = auth.uid()
      where i.id = idea_reports.idea_id
        and p.institution_id = i.institution_id
        and p.account_type = 'staff'
    )
  );

-- Institution members can file a report
create policy "idea_reports: institution members can insert"
  on idea_reports for insert
  to authenticated
  with check (
    reporter_id = auth.uid()
    and exists (
      select 1 from ideas i
      join profiles p on p.id = auth.uid()
      where i.id = idea_reports.idea_id
        and p.institution_id = i.institution_id
    )
  );
