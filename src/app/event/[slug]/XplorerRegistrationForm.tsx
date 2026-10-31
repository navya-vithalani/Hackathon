'use client';

import { useState } from 'react';
import { Check, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function XplorerRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);

  function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <div>
      <form onSubmit={submitRegistration} className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
          Your name
          <input required name="name" autoComplete="name" placeholder="e.g. Alex Sharma" className="min-h-12 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none transition-shadow focus-visible:shadow-[var(--shadow-focus)]" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
          Email address
          <input required type="email" name="email" autoComplete="email" placeholder="you@college.edu" className="min-h-12 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none transition-shadow focus-visible:shadow-[var(--shadow-focus)]" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
          College
          <input required name="college" autoComplete="organization" defaultValue="Gatik Jr. College" className="min-h-12 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none transition-shadow focus-visible:shadow-[var(--shadow-focus)]" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
          Grade / year
          <input required name="grade" placeholder="e.g. Grade 12" className="min-h-12 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none transition-shadow focus-visible:shadow-[var(--shadow-focus)]" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
          Team name <span className="font-normal text-[var(--color-text-subtle)]">Optional</span>
          <input name="team" placeholder="Flying solo? Leave this blank" className="min-h-12 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none transition-shadow focus-visible:shadow-[var(--shadow-focus)]" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
          Your build vibe
          <select name="experience" defaultValue="curious" className="min-h-12 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus-visible:shadow-[var(--shadow-focus)]">
            <option value="curious">Curious beginner</option>
            <option value="some">I’ve tried a few projects</option>
            <option value="builder">I build things regularly</option>
          </select>
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 sm:col-span-2">
          <p className="max-w-sm text-xs leading-relaxed text-[var(--color-text-subtle)]">Demo form only. Nothing is sent to a server or saved.</p>
          <Button type="submit" size="lg"><Send size={16} aria-hidden="true" /> Join the build</Button>
        </div>
      </form>

      {submitted && (
        <div role="status" aria-live="polite" className="ai-result fixed bottom-5 right-5 z-[var(--z-toast)] flex max-w-[calc(100vw-2.5rem)] items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--color-success)] bg-[var(--color-surface)] p-4 text-[var(--color-text)] shadow-[var(--shadow-lg)]">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)]"><Check size={18} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><strong className="block text-sm">You’re on the Xplorer list!</strong><span className="mt-1 block text-xs text-[var(--color-text-subtle)]">Demo confirmation only — no details were sent or stored.</span></span>
          <button type="button" aria-label="Dismiss confirmation" onClick={() => setSubmitted(false)} className="grid size-8 shrink-0 place-items-center rounded-full text-[var(--color-text-subtle)] hover:bg-[var(--color-hover-overlay)]"><X size={16} /></button>
        </div>
      )}
    </div>
  );
}
