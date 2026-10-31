/**
 * lib/constants/roles.ts — Event role constants and capability definitions.
 *
 * The canonical source of truth for what each per-event role can do.
 * Import ROLE_CAPABILITIES in permissions.ts to enforce role-based access.
 * Never hardcode role strings in components — import from here.
 */

import type { EventRole } from '@/types'

// ---------- Role Labels (display strings) ----------

export const ROLE_LABELS: Record<EventRole, string> = {
  owner: 'Owner',
  organizer: 'Organizer',
  volunteer: 'Volunteer',
  participant: 'Participant',
}

// ---------- Ordered list (highest privilege first) ----------

/** Roles in descending order of privilege. */
export const ROLE_ORDER: EventRole[] = ['owner', 'organizer', 'volunteer', 'participant']

// ---------- Capability Definitions ----------

/**
 * Set of actions gated by per-event role.
 * Add a new capability here whenever you add a gated UI element or server action.
 * The permissions.ts `can()` function reads from this map.
 */
export const ROLE_CAPABILITIES: Record<string, EventRole[]> = {
  /** View the event page. */
  view_event: ['participant', 'volunteer', 'organizer', 'owner'],

  /** Read broadcasts and event chat (only messages in own audience). */
  read_broadcasts: ['participant', 'volunteer', 'organizer', 'owner'],

  /** Post a broadcast. */
  post_broadcast: ['volunteer', 'organizer', 'owner'],

  /** Scan QR codes to check in attendees. */
  check_in: ['volunteer', 'organizer', 'owner'],

  /** View the registrations list and AI screening results. */
  view_registrations: ['organizer', 'owner'],

  /** Accept, reject, or waitlist applicants. */
  manage_registrations: ['organizer', 'owner'],

  /** Edit event details. */
  edit_event: ['organizer', 'owner'],

  /** Manage event team (add/remove/change roles). */
  manage_team: ['owner'],

  /** Delete the event. */
  delete_event: ['owner'],

  /** Publish or unpublish the event. */
  publish_event: ['organizer', 'owner'],

  /** View the Settings tab. */
  view_settings: ['owner'],
}
