import type { Metadata } from 'next'
import { ViewTransition } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { SignupForm } from '@/components/auth/AuthForms'
import { getSafeRedirectPath } from '@/lib/auth/redirect'

export const metadata: Metadata = { title: 'Create your account' }

export default async function SignupPage({
  searchParams,
}: PageProps<'/signup'>) {
  const params = await searchParams
  const redirectValue = Array.isArray(params.redirectTo) ? params.redirectTo[0] : params.redirectTo

  return (
    <ViewTransition
      enter={{ 'hive-enter': 'hive-arrive', default: 'none' }}
      exit={{ 'hive-enter': 'hive-depart', default: 'none' }}
      default="none"
    >
      <AuthShell title="Your next thing starts here" description="Join your campus hive and find the people, plans, and ideas you’ve been looking for.">
        <SignupForm redirectTo={getSafeRedirectPath(redirectValue)} />
      </AuthShell>
    </ViewTransition>
  )
}
