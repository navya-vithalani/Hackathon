import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/AuthShell'
import { ResetPasswordForm } from '@/components/auth/AuthForms'

export const metadata: Metadata = { title: 'Choose a new password' }

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Choose a new password" description="Make it at least 8 characters so your account stays yours.">
      <ResetPasswordForm />
    </AuthShell>
  )
}
