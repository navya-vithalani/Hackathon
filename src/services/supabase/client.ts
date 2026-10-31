/**
 * client.ts — Supabase browser client.
 * Import this in client-side hooks and components.
 * Never import in server components or route handlers — use server.ts there.
 *
 * Usage:
 *   import { createClient } from '@/services/supabase/client'
 *   const supabase = createClient()
 */

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// ---------- Client Factory ----------

/**
 * Creates a Supabase client configured for browser (client component) use.
 *
 * Reads credentials from:
 *   - NEXT_PUBLIC_SUPABASE_URL   — your Supabase project URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY — the public anon/safe key
 *
 * Call inside a component or hook body, not at module level, so that
 * environment variables are guaranteed to be loaded.
 *
 * @returns A configured SupabaseClient instance.
 */
export function createClient(): SupabaseClient {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
