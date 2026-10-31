import Link from 'next/link'
import { Hexagon, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from '@/app/auth.module.css'

interface AuthShellProps {
  title: string
  description: string
  children: ReactNode
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="hivai home">
          <span className={styles.brandMark}><Hexagon size={21} strokeWidth={2.2} /></span>
          <span>hivai</span>
        </Link>
        <Link className={styles.backLink} href="/">Back to discover</Link>
      </header>

      <div className={styles.content}>
        <section className={styles.intro}>
          <p className={styles.kicker}><Sparkles size={14} /> YOUR CAMPUS, CONNECTED</p>
          <h1>Find your hive.<br /><em>Make it happen.</em></h1>
          <p className={styles.introText}>
            Meet your people, find your next big idea, and make campus life feel a little closer.
          </p>
          <div className={styles.honeycomb} aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
          </div>
          <p className={styles.note}>A little more connection. A lot more happening.</p>
        </section>

        <section className={styles.card} aria-labelledby="auth-title">
          <p className={styles.cardEyebrow}>WELCOME TO HIVAI</p>
          <h2 id="auth-title">{title}</h2>
          <p className={styles.cardDescription}>{description}</p>
          {children}
        </section>
      </div>

      <footer className={styles.footer}>
        <span>Made for the people who make campus.</span>
        <span>hivai · find your people</span>
      </footer>
    </main>
  )
}
