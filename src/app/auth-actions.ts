'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getSafeRedirectPath } from '@/lib/auth/redirect'
import { createClient } from '@/services/supabase/server'
import { isSupabaseConfigured } from '@/services/supabase/config'

export interface AuthActionState {
  error?: string
  success?: string
}

const emailSchema = z.string().trim().email('Enter a valid email address.')

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.'),
  redirectTo: z.string().optional(),
})

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.').max(80, 'Name is too long.'),
  email: emailSchema,
  password: z.string().min(8, 'Use a password with at least 8 characters.'),
  accountType: z.enum(['student', 'staff']),
  redirectTo: z.string().optional(),
})

function getConnectionError(error: unknown): string {
  const detail = error instanceof Error ? ` ${error.message}` : ''
  return `Could not contact Supabase authentication.${detail} Check your connection and Supabase configuration.`
}

async function getCallbackUrl(next: string): Promise<string> {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  const requestHeaders = await headers()
  const requestOrigin = requestHeaders.get('origin')
  const baseUrl = configuredUrl || requestOrigin

  if (!baseUrl) {
    throw new Error('Set NEXT_PUBLIC_APP_URL to enable email verification links.')
  }

  const origin = new URL(baseUrl)
  if (origin.protocol !== 'https:' && !(origin.protocol === 'http:' && origin.hostname === 'localhost')) {
    throw new Error('The app URL must use HTTPS.')
  }

  const callback = new URL('/auth/callback', origin.origin)
  callback.searchParams.set('next', getSafeRedirectPath(next))
  return callback.toString()
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check your details and try again.' }
  }
  if (!isSupabaseConfigured()) {
    return { error: 'Authentication is not available yet. Add the Supabase URL and public key to the app configuration.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })
    if (error) return { error: error.message }
  } catch (error) {
    return { error: getConnectionError(error) }
  }

  redirect(getSafeRedirectPath(parsed.data.redirectTo))
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    accountType: formData.get('accountType'),
    redirectTo: formData.get('redirectTo') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check your details and try again.' }
  }
  if (!isSupabaseConfigured()) {
    return { error: 'Authentication is not available yet. Add the Supabase URL and public key to the app configuration.' }
  }

  const redirectTo = getSafeRedirectPath(parsed.data.redirectTo)
  let emailRedirectTo: string
  try {
    emailRedirectTo = await getCallbackUrl(redirectTo)
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Could not prepare the verification link.',
    }
  }

  let hasSession = false
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.fullName,
          account_type: parsed.data.accountType,
        },
        emailRedirectTo,
      },
    })
    if (error) return { error: error.message }
    hasSession = Boolean(data.session)
  } catch (error) {
    return { error: getConnectionError(error) }
  }

  if (hasSession) {
    redirect(redirectTo)
  }

  const verificationUrl = new URLSearchParams({
    email: parsed.data.email,
    next: redirectTo,
  })
  redirect(`/verify-email?${verificationUrl.toString()}`)
}

export async function resendVerificationEmail(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = z.object({
    email: emailSchema,
    next: z.string().optional(),
  }).safeParse({
    email: formData.get('email'),
    next: formData.get('next') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Enter a valid email address.' }
  }
  if (!isSupabaseConfigured()) {
    return { error: 'Authentication is not available yet. Add the Supabase URL and public key to the app configuration.' }
  }

  let emailRedirectTo: string
  try {
    emailRedirectTo = await getCallbackUrl(getSafeRedirectPath(parsed.data.next))
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Could not prepare the verification link.',
    }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: parsed.data.email,
      options: { emailRedirectTo },
    })
    if (error) return { error: error.message }
  } catch (error) {
    return { error: getConnectionError(error) }
  }

  return { success: 'A fresh verification link is on its way.' }
}

export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = z.object({ email: emailSchema }).safeParse({
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Enter a valid email address.' }
  }
  if (!isSupabaseConfigured()) {
    return { error: 'Authentication is not available yet. Add the Supabase URL and public key to the app configuration.' }
  }

  let redirectTo: string
  try {
    redirectTo = await getCallbackUrl('/reset-password')
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Could not prepare the password reset link.',
    }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo })
    if (error) return { error: error.message }
  } catch (error) {
    return { error: getConnectionError(error) }
  }

  return { success: 'If an account exists for that email, a password reset link is on its way.' }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(`Could not sign out: ${error.message}`)
  redirect('/login?message=signed-out')
}
