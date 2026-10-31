'use client';

import { useState } from 'react';
import { Check, Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EVENT_TYPES } from '@/lib/constants/eventTypes';

/** Local-only event creation preview; it does not publish to a backend. */
export default function CreateEventForm() {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('hackathon');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [notes, setNotes] = useState('');
  const [screened, setScreened] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);

  function createPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPreviewReady(true);
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
      <form className="space-y-6" onSubmit={createPreview}>
        <section className="space-y-4 border-b border-[var(--color-border)] pb-6">
          <div><h2 className="font-heading text-xl font-semibold">The essentials</h2><p className="mt-1 text-sm text-[var(--color-text-subtle)]">Start with the details people need to decide.</p></div>
          <label className="block text-sm font-semibold">Event name
            <input required value={title} onChange={(event) => { setTitle(event.target.value); setPreviewReady(false); }} placeholder="e.g. Inter-school robotics meet" className="mt-2 min-h-[48px] w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 font-normal" />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Event type
              <select value={eventType} onChange={(event) => setEventType(event.target.value)} className="mt-2 min-h-[48px] w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 font-normal">
                {EVENT_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold">Date
              <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 min-h-[48px] w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 font-normal" />
            </label>
          </div>
          <label className="block text-sm font-semibold">Venue or online link
            <input required value={venue} onChange={(event) => setVenue(event.target.value)} placeholder="Where should people meet?" className="mt-2 min-h-[48px] w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 font-normal" />
          </label>
        </section>

        <section className="space-y-4 border-b border-[var(--color-border)] pb-6">
          <div><h2 className="font-heading text-xl font-semibold">Who can join?</h2><p className="mt-1 text-sm text-[var(--color-text-subtle)]">Choose how registrations are handled.</p></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" aria-pressed={!screened} onClick={() => setScreened(false)} className={`min-h-[76px] border p-4 text-left ${screened ? 'border-[var(--color-border)] bg-[var(--color-surface)]' : 'border-[var(--color-accent-dark)] bg-[var(--color-surface-alt)]'}`}>
              <strong className="block text-sm">Open registration</strong><span className="mt-1 block text-xs text-[var(--color-text-subtle)]">Anyone eligible can join.</span>
            </button>
            <button type="button" aria-pressed={screened} onClick={() => setScreened(true)} className={`min-h-[76px] border p-4 text-left ${screened ? 'border-[var(--color-accent-dark)] bg-[var(--color-surface-alt)]' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}>
              <strong className="block text-sm">With selection</strong><span className="mt-1 block text-xs text-[var(--color-text-subtle)]">Review applicants before accepting.</span>
            </button>
          </div>
          <label className="block text-sm font-semibold">The event in your words
            <textarea value={notes} onChange={(event) => { setNotes(event.target.value); setPreviewReady(false); }} rows={5} placeholder="What will happen? Who is it for? What should people bring?" className="mt-2 w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-4 font-normal" />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)]"><Mic size={15} /> Voice input is not connected in this preview.</p>
            <Button type="submit"><Sparkles size={16} /> Build a draft preview</Button>
          </div>
        </section>
      </form>

      <aside className="h-fit border border-[var(--color-border)] bg-[var(--color-surface)] p-5 xl:sticky xl:top-24">
        <div className="flex items-center gap-2 text-[var(--color-secondary)]"><Sparkles size={17} /><p className="text-xs font-bold uppercase tracking-wide">Event structuring assistant</p></div>
        {previewReady ? (
          <div className="mt-5 space-y-4" role="status">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-success)]"><Check size={17} /> Draft preview ready</div>
            <h2 className="font-heading text-2xl font-semibold">{title}</h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{notes || `${title} is a ${eventType} at ${venue} on ${date}.`}</p>
            <dl className="space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-[var(--color-text-subtle)]">Date</dt><dd>{date}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[var(--color-text-subtle)]">Venue</dt><dd className="text-right">{venue}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[var(--color-text-subtle)]">Registration</dt><dd>{screened ? 'Selection' : 'Open'}</dd></div>
            </dl>
            <p className="text-xs text-[var(--color-text-subtle)]">This is a local preview. Publishing and AI structuring need the live services.</p>
          </div>
        ) : (
          <div className="mt-5 border-l-2 border-[var(--color-accent)] pl-4">
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">Tell us the idea as you have it. We’ll shape it into a clear event draft for organizers and students to review.</p>
            <p className="mt-3 text-xs text-[var(--color-text-subtle)]">Fill in the basics, then build a preview.</p>
          </div>
        )}
      </aside>
    </div>
  );
}