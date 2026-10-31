import { NextResponse, type NextRequest } from 'next/server'
import { getSafeRedirectPath } from '@/lib/auth/redirect'
import { isSupabaseConfigured } from '@/services/supabase/config'
import { createClient } from '@/services/supabase/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = getSafeRedirectPath(request.nextUrl.searchParams.get('next'))

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL('/login?error=configuration', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=verification', request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/login?error=verification', request.url))
  }

  return NextResponse.redirect(new URL(next, request.url))
}
