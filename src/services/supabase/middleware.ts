/**
 * middleware.ts — Supabase session refresh helper for Next.js Proxy.
 * Call updateSession() from src/proxy.ts on auth and protected routes so that
 * short-lived access tokens are silently refreshed and written back to the
 * response cookies before any server component runs.
 *
 * If this is skipped, logged-in users will appear as logged-out to server
 * components after the access token expires (~60 min).
 */

import { createServerClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { getSafeRedirectPath } from '@/lib/auth/redirect'
import { getSupabaseConfig, isSupabaseConfigured } from '@/services/supabase/config'

// ---------- Session Refresh ----------

/**
 * Reads the Supabase session from the request cookies, refreshes the
 * access token if it has expired, and writes the updated tokens back to
 * the response cookies.
 *
 * Also performs basic auth-guard redirects:
 * - Unauthenticated requests to `/app/*` are redirected to `/login`.
 * - Authenticated requests to `/login` or `/signup` return to the requested app page.
 *
 * @param request - The incoming NextRequest from middleware.
 * @returns A NextResponse with refreshed session cookies set.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  // Start with a pass-through response so we can attach cookies to it.
  let supabaseResponse = NextResponse.next({ request })
  const { pathname } = request.nextUrl
  const isAppRoute = pathname === '/app' || pathname.startsWith('/app/')
  const isAuthRoute =
    pathname === '/login' || pathname.startsWith('/login/') ||
    pathname === '/signup' || pathname.startsWith('/signup/')

  if (!isSupabaseConfigured()) {
    if (isAppRoute || pathname === '/onboarding') {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.search = ''
      loginUrl.searchParams.set('error', 'configuration')
      loginUrl.searchParams.set(
        'redirectTo',
        getSafeRedirectPath(`${pathname}${request.nextUrl.search}`),
      )
      return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
  }

  if (!isAppRoute && !isAuthRoute) {
    return supabaseResponse
  }

  const { url, anonKey } = getSupabaseConfig()

  const supabase = createServerClient(
    url,
    anonKey,
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
  let user: User | null = null
  try {
    const result = await supabase.auth.getUser()
    user = result.data.user
  } catch {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = ''
    loginUrl.searchParams.set('error', 'auth-unavailable')

    if (isAppRoute) {
      loginUrl.searchParams.set(
        'redirectTo',
        getSafeRedirectPath(`${pathname}${request.nextUrl.search}`),
      )
    }

    return NextResponse.redirect(loginUrl)
  }

  // ---------- Auth guard: protect /app/* routes ----------
  if (isAppRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = ''
    loginUrl.searchParams.set(
      'redirectTo',
      getSafeRedirectPath(`${pathname}${request.nextUrl.search}`),
    )
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && user) {
    const redirectTo = getSafeRedirectPath(
      request.nextUrl.searchParams.get('redirectTo') ??
        request.nextUrl.searchParams.get('next'),
    )
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return supabaseResponse
}
