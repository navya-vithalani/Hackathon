/**
 * src/lib/permissions.ts — Pure role-based permission functions.
 * No Supabase, no React. Safe to import anywhere including server components and API routes.
 * Uses EventRole from @/types to determine what a user can do within an event.
 */

import type { EventRole } from '@/types';

// ─── Action Definitions ───────────────────────────────────────────────────────

type Action =
  | 'view_event'
  | 'scan_checkin'
  | 'post_broadcast'
  | 'view_registrations'
  | 'edit_event'
  | 'accept_reject'
  | 'manage_roles'
  | 'delete_event';

/**
 * Permission matrix.
 * Each action lists the minimum roles that are allowed to perform it.
 * Roles not listed → denied.
 */
const PERMISSIONS: Record<Action, EventRole[]> = {
  // Any registered member can view the event detail page
  view_event:          ['owner', 'organizer', 'volunteer', 'participant'],

  // Volunteers and above can scan QR codes at the venue
  scan_checkin:        ['owner', 'organizer', 'volunteer'],

  // Organizers and above can send broadcasts
  post_broadcast:      ['owner', 'organizer'],

  // Organizers and above can see the registrations list
  view_registrations:  ['owner', 'organizer'],

  // Organizers and above can edit event details
  edit_event:          ['owner', 'organizer'],

  // Organizers and above can accept or reject screened applications
  accept_reject:       ['owner', 'organizer'],

  // Only the owner can add/remove team members and change roles
  manage_roles:        ['owner'],

  // Only the owner can delete the event
  delete_event:        ['owner'],
};

// ─── Exported Functions ───────────────────────────────────────────────────────

/**
 * Returns true if the given role is permitted to perform `action`.
 * Passing `null` (unauthenticated / non-member) always returns false.
 *
 * @example can('organizer', 'post_broadcast') → true
 * @example can('volunteer', 'delete_event')   → false
 * @example can(null, 'view_event')            → false
 */
export function can(role: EventRole | null, action: Action): boolean {
  if (!role) return false;
  const allowed = PERMISSIONS[action];
  return allowed?.includes(role) ?? false;
}

/**
 * Returns true if the role grants organizing-level access (owner or organizer).
 * Useful for showing/hiding management UI sections.
 */
export function isOrganizer(role: EventRole | null): boolean {
  return role === 'owner' || role === 'organizer';
}

/**
 * Returns true if the role is volunteer (strictly — not owner or organizer).
 * Use when showing volunteer-specific UI (e.g. check-in scanner without edit controls).
 */
export function isVolunteer(role: EventRole | null): boolean {
  return role === 'volunteer';
}

/**
 * Returns true if the role can perform any event management action
 * (i.e., is owner, organizer, or volunteer — anything above participant).
 */
export function canManageEvent(role: EventRole | null): boolean {
  return role === 'owner' || role === 'organizer' || role === 'volunteer';
}
