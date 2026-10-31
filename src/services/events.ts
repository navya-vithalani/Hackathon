/**
 * events.ts — Events service.
 *
 * The ONLY layer that reads or writes the `events` and related Supabase tables.
 * All event CRUD, feed queries, and publish logic live here.
 *
 * Called from hooks/useEvents.ts — never imported directly in components.
 *
 * Step 2: replace every stub body with a real Supabase query using
 * `createClient()` from @/services/supabase/server (server actions / route
 * handlers) or @/services/supabase/client (browser hooks).
 */

import type {
  Event,
  EventType,
  EventMode,
  EventStatus,
  RegistrationMode,
  EventEligibility,
  ScreeningCriteria,
  EventStructured,
} from '@/types'

// ---------- Filter Interface ----------

/**
 * Optional filter bag passed to getEligibleEvents().
 * All fields are optional — omitting a field means "no filter on that dimension".
 */
export interface EventFilters {
  /** Narrow to a specific event category (hackathon, MUN, sports, …). */
  type?: EventType
  /** Narrow to online or offline events. */
  mode?: EventMode
  /** When true, show only free (cost_amount = 0) events. */
  free?: boolean
  /** Show only events starting on or after this ISO date string. */
  dateFrom?: string
  /** Show only events ending on or before this ISO date string. */
  dateTo?: string
  /** When true, show only events the user has already registered for. */
  registered?: boolean
  /** Free-text search against event title and summary. */
  query?: string
}

// ---------- Create/Update Payload ----------

/**
 * All fields required to create a new event.
 * Mirrors the `events` table columns; `id`, `slug`, `status`, and `created_at`
 * are generated server-side and must NOT be included here.
 */
export interface CreateEventData {
  /** Title / display name of the event. */
  title: string
  /** Prose or AI-structured description. */
  description_structured?: EventStructured
  type: EventType
  mode: EventMode
  /** Physical address or online link, depending on mode. */
  venue?: string
  /** ISO datetime string for when the event starts. */
  starts_at: string
  /** ISO datetime string for when the event ends. */
  ends_at: string
  /** Cost in smallest currency unit (0 = free). */
  cost_amount: number
  /** URL of the organizer's payment QR image, if cost_amount > 0. */
  payment_qr_url?: string
  registration_mode: RegistrationMode
  /** Organizer-defined AI screening criteria; required when registration_mode = 'screened'. */
  screening_criteria?: ScreeningCriteria
  /** Eligibility rules that determine who sees this event. */
  eligibility: EventEligibility
  /** Max number of accepted registrations. undefined = unlimited. */
  capacity?: number
  /** URL of the uploaded cover image. */
  cover_url?: string
  /** id of the owner profile. */
  owner_id: string
}

// ---------- Service Functions ----------

/**
 * Returns events the given user is eligible for, applying optional filters.
 *
 * Eligibility is enforced both in the query predicate (fast path) and by
 * Supabase RLS (security boundary). The feed excludes draft events unless
 * the user is the owner or an organizer of that event.
 *
 * @param userId  - The authenticated user's profile id.
 * @param filters - Optional filter constraints.
 * @returns Promise resolving to a list of eligible published events.
 */
export async function getEligibleEvents(
  userId: string,
  filters?: EventFilters
): Promise<Event[]> {
  void userId
  void filters
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Fetches a single event by its URL slug.
 *
 * Returns null when no published event with the given slug exists (so callers
 * can render a 404 page without throwing).
 *
 * @param slug - The URL-safe event identifier (e.g. 'code-storm-2025').
 * @returns The event or null.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  void slug
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Returns all events owned by the given user.
 * Used on the My Events → Organizing tab.
 *
 * @param userId - The authenticated user's profile id.
 * @returns List of events where owner_id = userId.
 */
export async function getEventsByOwner(userId: string): Promise<Event[]> {
  void userId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Returns all events the user is connected to, grouped by role.
 *
 * - `participating`: events where the user has a registration row.
 * - `organizing`:    events where the user is owner or organizer in event_members.
 * - `volunteering`:  events where the user is a volunteer in event_members.
 *
 * @param userId - The authenticated user's profile id.
 * @returns An object with three event arrays.
 */
export async function getMyEvents(userId: string): Promise<{
  participating: Event[]
  organizing: Event[]
  volunteering: Event[]
}> {
  void userId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Creates a new event row (initially in 'draft' status) and an event_members
 * row for the owner. Generates a unique slug from the event title.
 *
 * @param data - CreateEventData payload.
 * @returns The newly created Event.
 */
export async function createEvent(data: CreateEventData): Promise<Event> {
  void data
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Partially updates an existing event.
 *
 * Only the fields present in `data` are written; others are left unchanged.
 * Throws if the event does not exist or the caller lacks permission (enforced
 * by RLS — no application-layer check needed here).
 *
 * @param id   - The event UUID.
 * @param data - Partial event fields to update.
 * @returns The updated Event.
 */
export async function updateEvent(
  id: string,
  data: Partial<Event>
): Promise<Event> {
  void id
  void data
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Deletes an event and all associated data (cascade via FK constraints).
 * Only the owner is permitted (enforced by RLS).
 *
 * @param id - The event UUID.
 */
export async function deleteEvent(id: string): Promise<void> {
  void id
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Transitions an event from 'draft' to 'published' status.
 * Validates that required fields are present before publishing.
 *
 * @param id - The event UUID.
 * @returns The published Event.
 */
export async function publishEvent(id: string): Promise<Event> {
  void id
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Closes an event (transitions status to 'closed').
 * A closed event is visible but no longer accepting registrations.
 *
 * @param id - The event UUID.
 * @returns The updated Event with status 'closed'.
 */
export async function closeEvent(id: string): Promise<Event> {
  void id
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Returns the current published status of an event.
 * Lightweight helper used by the publish button to show correct state.
 *
 * @param id - The event UUID.
 * @returns The EventStatus value.
 */
export async function getEventStatus(id: string): Promise<EventStatus> {
  void id
  throw new Error('Not implemented — wire up Supabase in Step 2')
}
