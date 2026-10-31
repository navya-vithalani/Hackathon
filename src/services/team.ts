/**
 * team.ts — Event team/member management service.
 *
 * Handles adding, changing, and removing per-event team members.
 * The ONLY layer that touches the `event_members` table.
 *
 * Called from hooks/useTeam.ts and server actions.
 * Never imported directly in components.
 *
 * Step 2: replace every stub body with a real Supabase query.
 */

import type { EventMember, EventRole, Profile } from '@/types'

// ---------- Service Functions ----------

/**
 * Returns all team members for a given event, with their profile data joined.
 *
 * Ordered by role priority (owner → organizer → volunteer) then by name.
 * RLS ensures only event organizers/owners can call this.
 *
 * @param eventId - The event UUID.
 * @returns Array of EventMember objects with nested Profile.
 */
export async function getEventMembers(eventId: string): Promise<EventMember[]> {
  void eventId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Adds a user to an event's team with the specified role.
 *
 * Throws if:
 * - The profile is already a member of this event.
 * - The caller tries to add a second 'owner' (there can only be one).
 *
 * @param eventId   - The event UUID.
 * @param profileId - The UUID of the profile to add.
 * @param role      - The role to assign ('organizer' | 'volunteer').
 * @returns The newly created EventMember.
 */
export async function addMember(
  eventId: string,
  profileId: string,
  role: 'organizer' | 'volunteer'
): Promise<EventMember> {
  void eventId
  void profileId
  void role
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Changes the role of an existing event team member.
 *
 * Cannot be used to change the owner role — use a dedicated transfer-ownership
 * flow for that (roadmap).
 *
 * @param eventId   - The event UUID.
 * @param profileId - The UUID of the member whose role should change.
 * @param role      - The new EventRole value.
 * @returns The updated EventMember.
 */
export async function updateMemberRole(
  eventId: string,
  profileId: string,
  role: EventRole
): Promise<EventMember> {
  void eventId
  void profileId
  void role
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Removes a team member from an event.
 *
 * The owner cannot remove themselves; this is enforced by RLS.
 *
 * @param eventId   - The event UUID.
 * @param profileId - The UUID of the member to remove.
 */
export async function removeMember(
  eventId: string,
  profileId: string
): Promise<void> {
  void eventId
  void profileId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Searches for profiles by name or email to populate the "Add member" picker.
 *
 * Returns at most 10 results. The query is matched against full_name (ilike)
 * and email (exact, via auth.users join).
 *
 * @param query - Partial name or email string (min 2 characters).
 * @returns Array of matching Profile objects.
 */
export async function searchProfiles(query: string): Promise<Profile[]> {
  void query
  throw new Error('Not implemented — wire up Supabase in Step 2')
}
