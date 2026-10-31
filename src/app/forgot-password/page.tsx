import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/AuthShell'
import { ForgotPasswordForm } from '@/components/auth/AuthForms'

export const metadata: Metadata = { title: 'Reset your password' }

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Let’s get you back in" description="Enter the email on your account and we’ll send you a secure password reset link.">
      <ForgotPasswordForm />
    </AuthShell>
  )
}
