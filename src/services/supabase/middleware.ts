/**
 * middleware.ts — Supabase session refresh helper for Next.js middleware.
 * Call updateSession() from src/middleware.ts on every request so that
 * short-lived access tokens are silently refreshed and written back to the
 * response cookies before any server component runs.
 *
 * If this is skipped, logged-in users will appear as logged-out to server
 * components after the access token expires (~60 min).
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ---------- Session Refresh ----------

/**
 * Reads the Supabase session from the request cookies, refreshes the
 * access token if it has expired, and writes the updated tokens back to
 * the response cookies.
 *
 * Also performs basic auth-guard redirects:
 * - Unauthenticated requests to `/app/*` are redirected to `/login`.
 * - Authenticated requests to `/login` or `/signup` are redirected to `/app/home`.
 *
 * @param request - The incoming NextRequest from middleware.
 * @returns A NextResponse with refreshed session cookies set.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  // Start with a pass-through response so we can attach cookies to it.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write cookies to both the request (for downstream server components)
          // and the response (so the browser receives the refreshed tokens).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not write any code between createServerClient and
  // supabase.auth.getUser() — the token refresh happens here.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ---------- Auth guard: protect /app/* routes ----------
  const isAppRoute = pathname.startsWith('/app')
  const isAuthRoute =
    pathname.startsWith('/login') || pathname.startsWith('/signup')

  if (isAppRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && user) {
    const homeUrl = request.nextUrl.clone()
    homeUrl.pathname = '/app/home'
    return NextResponse.redirect(homeUrl)
  }

  return supabaseResponse
}
