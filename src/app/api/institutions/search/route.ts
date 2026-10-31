import { NextResponse, type NextRequest } from 'next/server'

const PHOTON_BASE = 'https://photon.komoot.io/api/'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (query.length < 3) {
    return NextResponse.json({ results: [] }, { status: 200 })
  }

  const params = new URLSearchParams({
    q: query,
    limit: '8',
    lang: 'en',
  })

  const tags = ['amenity:school', 'amenity:college', 'amenity:university', 'amenity:academy']
  tags.forEach((tag) => params.append('osm_tag', tag))

  const response = await fetch(`${PHOTON_BASE}?${params.toString()}`, {
    headers: {
      'User-Agent': 'hivai/1.0 (campus events platform; local request)',
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return NextResponse.json({ results: [] }, { status: 200 })
  }

  const payload = (await response.json()) as { features?: Array<Record<string, unknown>> }
  const features = Array.isArray(payload.features) ? payload.features : []

  const results = features
    .map((feature) => {
      const props = (feature.properties ?? {}) as Record<string, unknown>
      const geometry = (feature.geometry ?? {}) as { coordinates?: number[] }
      const coords = geometry.coordinates ?? []
      const osmId = props.osm_id ?? props.osmtype ?? 'unknown'
      const name = typeof props.name === 'string' ? props.name : ''
      const city = typeof props.city === 'string' ? props.city : undefined
      const state = typeof props.state === 'string' ? props.state : undefined
      const country = typeof props.country === 'string' ? props.country : undefined

      return {
        provider: 'osm',
        place_id: `osm/${String(osmId)}`,
        name,
        address: [city, state, country].filter(Boolean).join(', '),
        city,
        state,
        country,
        lat: coords[1],
        lng: coords[0],
      }
    })
    .filter((result) => result.name.length > 0)
    .slice(0, 8)

  return NextResponse.json({ results })
}
