import type { Metadata } from 'next'
import { getSafeRedirectPath } from '@/lib/auth/redirect'
import { AuthShell } from '@/components/auth/AuthShell'
import { LoginForm } from '@/components/auth/AuthForms'

export const metadata: Metadata = { title: 'Sign in' }

const AUTH_ERRORS: Record<string, string> = {
  configuration: 'Sign-in is not configured yet. Add the Supabase URL and public key to the app environment.',
  verification: 'That verification link is invalid or has expired. Request a fresh one and try again.',
  'auth-unavailable': 'Could not reach the authentication service. Check your connection and try again.',
}

const AUTH_NOTICES: Record<string, string> = {
  'signed-out': 'You have been signed out.',
  'password-updated': 'Your password has been updated. Sign in with your new password.',
}

export default async function LoginPage({
  searchParams,
}: PageProps<'/login'>) {
  const params = await searchParams
  const errorKey = Array.isArray(params.error) ? params.error[0] : params.error
  const messageKey = Array.isArray(params.message) ? params.message[0] : params.message
  const redirectValue = Array.isArray(params.redirectTo) ? params.redirectTo[0] : params.redirectTo

  return (
    <AuthShell title="Welcome back" description="Sign in to pick up where your campus story left off.">
      <LoginForm
        redirectTo={getSafeRedirectPath(redirectValue)}
        error={errorKey ? AUTH_ERRORS[errorKey] : undefined}
        notice={messageKey ? AUTH_NOTICES[messageKey] : undefined}
      />
    </AuthShell>
  )
}
