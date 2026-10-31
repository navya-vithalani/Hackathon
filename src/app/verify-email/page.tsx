import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/AuthShell'
import { VerifyEmailForm } from '@/components/auth/AuthForms'
import { getSafeRedirectPath } from '@/lib/auth/redirect'

export const metadata: Metadata = { title: 'Verify your email' }

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<'/verify-email'>) {
  const params = await searchParams
  const email = Array.isArray(params.email) ? params.email[0] : params.email
  const redirectValue = Array.isArray(params.next) ? params.next[0] : params.next

  return (
    <AuthShell title="Check your inbox" description="One quick click and you’ll be right where the good stuff happens.">
      <VerifyEmailForm email={email ?? ''} next={getSafeRedirectPath(redirectValue)} />
    </AuthShell>
  )
}
