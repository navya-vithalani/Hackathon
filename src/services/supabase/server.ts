/**
 * server.ts — Supabase server client.
 * Uses cookies for session management. Import in server components and route handlers.
 * Never import in client components — use client.ts there.
 *
 * Usage:
 *   import { createClient } from '@/services/supabase/server'
 *   const supabase = await createClient()
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/services/supabase/config'

// ---------- Server Client Factory ----------

/**
 * Creates a Supabase client for server-side use (server components, route handlers,
 * server actions). Reads the session from the request cookies so the correct user
 * identity is available without an extra round-trip.
 *
 * Must be called inside a request context (Server Component, Route Handler, or
 * Server Action) — not at module level — because it reads `cookies()`.
 *
 * Reads credentials from:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * @returns A Promise that resolves to a configured SupabaseClient.
 */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()
  const { url, anonKey } = getSupabaseConfig()

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        /**
         * Read a cookie by name from the incoming request.
         * @param name - Cookie name.
         * @returns The cookie value, or undefined if absent.
         */
        getAll() {
          return cookieStore.getAll()
        },
        /**
         * Write cookies produced by Supabase (e.g. access-token refresh) back
         * to the response. In Server Components this is a no-op; in Route
         * Handlers the cookies are added to the NextResponse automatically.
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // setAll is called from a Server Component — cookies cannot be
            // mutated there. The middleware handles token refreshes.
          }
        },
      },
    }
  )
}
