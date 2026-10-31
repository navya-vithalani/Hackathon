'use client'

import { useActionState, useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import {
  requestPasswordReset,
  resendVerificationEmail,
  signIn,
  signUp,
  type AuthActionState,
} from '@/app/auth-actions'
import { createClient } from '@/services/supabase/client'
import styles from '@/app/auth.module.css'

const INITIAL_STATE: AuthActionState = {}

function ActionMessage({ state }: { state: AuthActionState }) {
  if (state.error) return <p className={styles.error} role="alert">{state.error}</p>
  if (state.success) return <p className={styles.success} role="status">{state.success}</p>
  return null
}

export function LoginForm({
  redirectTo,
  notice,
  error,
}: {
  redirectTo: string
  notice?: string
  error?: string
}) {
  const [state, formAction, isPending] = useActionState(signIn, INITIAL_STATE)

  return (
    <form className={styles.form} action={formAction}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {notice && <p className={styles.success} role="status">{notice}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <label className={styles.field}>
        <span>Email address</span>
        <input className={styles.input} name="email" type="email" autoComplete="email" placeholder="you@school.edu" required />
      </label>
      <label className={styles.field}>
        <span className={styles.labelRow}>
          Password
          <Link href="/forgot-password">Forgot password?</Link>
        </span>
        <input className={styles.input} name="password" type="password" autoComplete="current-password" placeholder="Your password" required />
      </label>
      <ActionMessage state={state} />
      <button className={styles.submit} type="submit" disabled={isPending}>
        {isPending ? <LoaderCircle className={styles.spinner} size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
        {isPending ? 'Signing you in…' : 'Sign in'}
      </button>
      <p className={styles.switch}>
        New to hivai? <Link href="/signup">Create an account</Link>
      </p>
    </form>
  )
}

export function SignupForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, isPending] = useActionState(signUp, INITIAL_STATE)

  return (
    <form className={styles.form} action={formAction}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className={styles.field}>
        <span>Your name</span>
        <input className={styles.input} name="fullName" type="text" autoComplete="name" placeholder="How should we call you?" minLength={2} maxLength={80} required />
      </label>
      <label className={styles.field}>
        <span>Email address</span>
        <input className={styles.input} name="email" type="email" autoComplete="email" placeholder="you@school.edu" required />
      </label>
      <label className={styles.field}>
        <span>I’m joining as</span>
        <select className={styles.input} name="accountType" defaultValue="student">
          <option value="student">Student</option>
          <option value="staff">Staff / educator</option>
        </select>
      </label>
      <label className={styles.field}>
        <span>Password</span>
        <input className={styles.input} name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required />
      </label>
      <ActionMessage state={state} />
      <button className={styles.submit} type="submit" disabled={isPending}>
        {isPending ? <LoaderCircle className={styles.spinner} size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
        {isPending ? 'Creating your account…' : 'Create account'}
      </button>
      <p className={styles.switch}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </form>
  )
}

export function VerifyEmailForm({
  email,
  next,
}: {
  email: string
  next: string
}) {
  const [state, formAction, isPending] = useActionState(resendVerificationEmail, INITIAL_STATE)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!state.success) return
    const startCooldown = window.setTimeout(() => setCooldown(45), 0)
    const timer = window.setInterval(() => {
      setCooldown((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => {
      window.clearTimeout(startCooldown)
      window.clearInterval(timer)
    }
  }, [state])

  return (
    <form className={styles.form} action={formAction}>
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="next" value={next} />
      <p className={styles.info}>
        We sent a verification link to <strong>{email || 'your email address'}</strong>. Open it to finish creating your account.
      </p>
      <ActionMessage state={state} />
      <button className={styles.submit} type="submit" disabled={isPending || cooldown > 0 || !email}>
        {isPending ? <LoaderCircle className={styles.spinner} size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
        {isPending ? 'Sending…' : cooldown > 0 ? `Try again in ${cooldown}s` : 'Resend verification email'}
      </button>
      <p className={styles.switch}><Link href="/login">Back to sign in</Link></p>
    </form>
  )
}

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, INITIAL_STATE)

  return (
    <form className={styles.form} action={formAction}>
      <label className={styles.field}>
        <span>Email address</span>
        <input className={styles.input} name="email" type="email" autoComplete="email" placeholder="you@school.edu" required />
      </label>
      <ActionMessage state={state} />
      <button className={styles.submit} type="submit" disabled={isPending}>
        {isPending ? <LoaderCircle className={styles.spinner} size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
        {isPending ? 'Sending…' : 'Send reset link'}
      </button>
      <p className={styles.switch}><Link href="/login">Back to sign in</Link></p>
    </form>
  )
}

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Use a password with at least 8 characters.')
      return
    }

    setIsPending(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
        return
      }
      router.replace('/app/home')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not update your password.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>New password</span>
        <input className={styles.input} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.submit} type="submit" disabled={isPending}>
        {isPending ? <LoaderCircle className={styles.spinner} size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
        {isPending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  )
}
