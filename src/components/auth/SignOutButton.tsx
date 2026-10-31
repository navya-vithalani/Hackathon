'use client'

import { LogOut } from 'lucide-react'
import { signOut } from '@/app/auth-actions'
import styles from '@/app/auth.module.css'

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button className={styles.signOut} type="submit" aria-label="Sign out">
        <LogOut size={17} aria-hidden="true" />
        <span>Sign out</span>
      </button>
    </form>
  )
}
