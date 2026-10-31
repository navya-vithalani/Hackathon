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

import { createClient } from '@/services/supabase/client'
import type { Institution, InstitutionProvider } from '@/types'

const searchCache = new Map<string, Promise<InstitutionSearchResult[]>>()

export interface InstitutionSearchResult {
  place_id: string
  name: string
  address: string
  provider: InstitutionProvider
  city?: string
  state?: string
  country?: string
  lat?: number
  lng?: number
}

function normalizePhotonResult(item: Record<string, unknown>): InstitutionSearchResult | null {
  const props = (item.properties ?? {}) as Record<string, unknown>
  const geometry = (item.geometry ?? {}) as { coordinates?: number[] }
  const coordinates = geometry.coordinates ?? []
  const name = typeof props.name === 'string' ? props.name : ''
  const rawType = typeof props.osm_value === 'string' ? props.osm_value.toLowerCase() : ''
  const allowed = new Set(['school', 'college', 'university', 'campus', 'academy'])

  if (!name || !allowed.has(rawType)) {
    return null
  }

  const city = typeof props.city === 'string' ? props.city : undefined
  const state = typeof props.state === 'string' ? props.state : undefined
  const country = typeof props.country === 'string' ? props.country : undefined

  return {
    place_id:
      typeof props.osm_id === 'number'
        ? `osm/${String(props.osm_id)}`
        : `osm/${String(props.osm_id ?? name)}`,
    name,
    address: [city, state, country].filter(Boolean).join(', '),
    provider: 'osm',
    city,
    state,
    country,
    lat: coordinates[1],
    lng: coordinates[0],
  }
}

export async function searchInstitutions(
  query: string
): Promise<InstitutionSearchResult[]> {
  const trimmed = query.trim()

  if (trimmed.length < 3) {
    return []
  }

  const cacheKey = trimmed.toLowerCase()
  const cached = searchCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const request = fetch(`/api/institutions/search?q=${encodeURIComponent(trimmed)}`, {
    method: 'GET',
    cache: 'no-store',
  })
    .then(async (response) => {
      if (!response.ok) {
        return []
      }

      const json = (await response.json()) as { results?: Record<string, unknown>[] }
      const results = Array.isArray(json.results) ? json.results : []

      return results
        .map((item) => normalizePhotonResult(item))
        .filter((item): item is InstitutionSearchResult => Boolean(item))
        .slice(0, 8)
    })
    .catch(() => [])

  searchCache.set(cacheKey, request)
  return request
}

export async function resolveInstitution(
  institution: Pick<Institution, 'name' | 'provider' | 'address'> & {
    external_id?: string
    place_id?: string
    city?: string
    state?: string
    country?: string
    lat?: number
    lng?: number
  }
): Promise<Institution> {
  const supabase = createClient()

  const payload = {
    name: institution.name,
    address: institution.address,
    place_id: institution.place_id ?? institution.external_id ?? institution.name,
    provider: institution.provider,
    verified: institution.provider !== 'manual',
    city: institution.city ?? '',
    state: institution.state ?? '',
    country: institution.country ?? '',
    lat: institution.lat ?? null,
    lng: institution.lng ?? null,
  }

  const { data, error } = await supabase
    .from('institutions')
    .upsert(payload, { onConflict: 'place_id' })
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    address: data.address ?? '',
    place_id: data.place_id,
    provider: data.provider,
    verified: Boolean(data.verified),
  }
}

export async function getOrCreateInstitution(
  placeId: string,
  provider: InstitutionProvider
): Promise<Institution> {
  return resolveInstitution({
    name: placeId,
    address: 'Resolved from provider',
    provider,
    place_id: placeId,
    external_id: placeId,
  })
}

export async function createManualInstitution(
  name: string,
  address: string
): Promise<Institution> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('institutions')
    .upsert(
      {
        name,
        address,
        place_id: `manual:${name.toLowerCase().replace(/\s+/g, '-')}`,
        provider: 'manual',
        verified: false,
      },
      { onConflict: 'place_id' }
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    address: data.address,
    place_id: data.place_id,
    provider: 'manual',
    verified: false,
  }
}

export async function getInstitutionById(id: string): Promise<Institution | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    name: data.name,
    address: data.address ?? '',
    place_id: data.place_id,
    provider: data.provider,
    verified: Boolean(data.verified),
  }
}
