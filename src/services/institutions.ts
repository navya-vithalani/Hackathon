/**
 * institutions.ts — Institution search and caching service.
 *
 * Provider-agnostic interface for searching educational institutions.
 * All feature code calls searchInstitutions() and getOrCreateInstitution() from here.
 *
 * Current provider hierarchy:
 *   1. Google Places API (preferred — consistent IDs, verified data).
 *   2. Photon / OpenStreetMap (fallback when Google billing is unavailable).
 *   3. Manual entry (flagged `unverified: true`).
 *
 * To swap providers, change the function bodies here — no feature code changes needed.
 *
 * Step 2: replace every stub body with real API calls and Supabase cache logic.
 */

import type { Institution, InstitutionProvider } from '@/types'

// ---------- Search Result ----------

/**
 * A lightweight result row returned by institution search.
 * Contains just enough data to display a suggestion in the picker UI.
 * Call getOrCreateInstitution() to persist the full record.
 */
export interface InstitutionSearchResult {
  /** Provider-specific identifier (e.g. Google place_id or OSM ID). */
  place_id: string
  /** Display name of the institution. */
  name: string
  /** Human-readable address string. */
  address: string
  /** Which external service returned this result. */
  provider: InstitutionProvider
}

// ---------- Service Functions ----------

/**
 * Searches for educational institutions matching the given query string.
 *
 * Results come from the active provider (Google Places → OSM → manual).
 * The function returns lightweight suggestion objects; call
 * getOrCreateInstitution() to get or create the full DB record.
 *
 * Search is restricted to educational establishment types where the
 * provider supports type filtering.
 *
 * @param query - Partial name or address to search for (min 2 characters).
 * @returns Array of matching InstitutionSearchResult objects.
 */
export async function searchInstitutions(
  query: string
): Promise<InstitutionSearchResult[]> {
  void query
  throw new Error('Not implemented — wire up institution provider in Step 2')
}

/**
 * Fetches full place details from the provider and upserts a matching row
 * in the `institutions` Supabase table, then returns the canonical record.
 *
 * Upsert logic:
 *   1. Check if a row with this `place_id` already exists → return it.
 *   2. Otherwise fetch details from the provider and INSERT a new row.
 *
 * This ensures the same physical school always maps to a single `institutions`
 * row regardless of how many users sign up from it.
 *
 * @param placeId  - The provider-specific place identifier.
 * @param provider - Which provider issued the placeId.
 * @returns The canonical Institution record.
 */
export async function getOrCreateInstitution(
  placeId: string,
  provider: InstitutionProvider
): Promise<Institution> {
  void placeId
  void provider
  throw new Error('Not implemented — wire up institution provider in Step 2')
}

/**
 * Creates a manual (unverified) institution entry.
 *
 * Used when the user cannot find their school in search results and
 * clicks "Add my institution manually". The record is flagged
 * `verified: false` and queued for admin review (roadmap).
 *
 * @param name    - The institution name as entered by the user.
 * @param address - The institution address as entered by the user.
 * @returns The newly created (unverified) Institution record.
 */
export async function createManualInstitution(
  name: string,
  address: string
): Promise<Institution> {
  void name
  void address
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Retrieves an institution by its internal database UUID.
 *
 * Used during profile hydration to join institution details onto a profile.
 *
 * @param id - The institution's UUID in the `institutions` table.
 * @returns The Institution or null if not found.
 */
export async function getInstitutionById(
  id: string
): Promise<Institution | null> {
  void id
  throw new Error('Not implemented — wire up Supabase in Step 2')
}
