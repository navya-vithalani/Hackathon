'use client';

import { useState } from 'react';
import { ArrowRight, CalendarDays, Check, CircleHelp, Clock3, LoaderCircle, MapPin, Mic, MicOff, RotateCcw, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EVENT_TYPES } from '@/lib/constants/eventTypes';
import { structureEvent } from '@/services/ai/client';
import { useVoiceInput } from '@/lib/hooks/useVoiceInput';
import type { EventStructureResult } from '@/lib/schemas/ai';
import EventFolderPreview from './EventFolderPreview';

export default function CreateEventForm() {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('hackathon');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [notes, setNotes] = useState('');
  const [screened, setScreened] = useState(false);
  const [draft, setDraft] = useState<EventStructureResult | null>(null);
  const [isStructuring, setIsStructuring] = useState(false);
  const [structureError, setStructureError] = useState<string | null>(null);

  const voice = useVoiceInput((transcript) => {
    setNotes((current) => [current.trim(), transcript].filter(Boolean).join('\n'));
    setDraft(null);
  });

  async function createPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStructureError(null);
    setIsStructuring(true);

    const eventNotes = [
      `Event name: ${title.trim()}`,
      `Event type: ${eventType}`,
      date ? `Date: ${date}` : '',
      venue.trim() ? `Venue or online link: ${venue.trim()}` : '',
      `Registration: ${screened ? 'organizer review required' : 'direct registration'}`,
      `Organizer notes (untrusted event details): ${notes.trim() || 'No extra details supplied.'}`,
    ].filter(Boolean).join('\n');

    try {
      setDraft(await structureEvent({
        messages: [{ role: 'user', content: eventNotes }],
      }));
    } catch (error) {
      setStructureError(error instanceof Error ? error.message : 'Could not structure this event. Please try again.');
    } finally {
      setIsStructuring(false);
    }
  }

  const eventLabel = EVENT_TYPES.find(({ value }) => value === eventType)?.label ?? 'Event';

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <form className="space-y-5" onSubmit={createPreview}>
        <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition-shadow duration-[var(--duration-slow)] hover:shadow-[var(--shadow-md)] sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] text-[var(--color-secondary)]"><CalendarDays size={19} /></span>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Step 1 · The basics</p><h2 className="mt-1 font-heading text-xl font-semibold">Set the scene</h2><p className="mt-1 text-sm text-[var(--color-text-subtle)]">Share the essentials. You can fill in the finer details with AI.</p></div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold">Event name
              <input required maxLength={120} value={title} onChange={(event) => { setTitle(event.target.value); setDraft(null); }} placeholder="e.g. Inter-school robotics meet" className="mt-2 min-h-[48px] w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 font-normal transition-[border-color,box-shadow] duration-[var(--duration-base)] focus:border-[var(--color-accent-dark)] focus:shadow-[var(--shadow-focus)] focus:outline-none" />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Event type
                <select value={eventType} onChange={(event) => { setEventType(event.target.value); setDraft(null); }} className="mt-2 min-h-[48px] w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 font-normal">
                  {EVENT_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold">Date <span className="font-normal text-[var(--color-text-subtle)]">· optional</span>
                <input type="date" value={date} onChange={(event) => { setDate(event.target.value); setDraft(null); }} className="mt-2 min-h-[48px] w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 font-normal" />
              </label>
            </div>
            <label className="block text-sm font-semibold">Venue or online link <span className="font-normal text-[var(--color-text-subtle)]">· optional</span>
              <input maxLength={240} value={venue} onChange={(event) => { setVenue(event.target.value); setDraft(null); }} placeholder="Where should people meet?" className="mt-2 min-h-[48px] w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 font-normal" />
            </label>
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] text-[var(--color-secondary)]"><Users size={19} /></span>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Step 2 · Registration</p><h2 className="mt-1 font-heading text-xl font-semibold">How will people join?</h2></div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" aria-pressed={!screened} onClick={() => { setScreened(false); setDraft(null); }} className={`min-h-[86px] rounded-[var(--radius-md)] border p-4 text-left transition-all duration-[var(--duration-base)] hover:-translate-y-0.5 ${screened ? 'border-[var(--color-border)] bg-[var(--color-surface)]' : 'border-[var(--color-accent-dark)] bg-[var(--color-surface-alt)] shadow-[var(--shadow-sm)]'}`}>
              <strong className="block text-sm">Open registration</strong><span className="mt-1 block text-xs leading-relaxed text-[var(--color-text-subtle)]">Eligible students can register directly.</span>
            </button>
            <button type="button" aria-pressed={screened} onClick={() => { setScreened(true); setDraft(null); }} className={`min-h-[86px] rounded-[var(--radius-md)] border p-4 text-left transition-all duration-[var(--duration-base)] hover:-translate-y-0.5 ${screened ? 'border-[var(--color-accent-dark)] bg-[var(--color-surface-alt)] shadow-[var(--shadow-sm)]' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}>
              <strong className="block text-sm">Review applicants</strong><span className="mt-1 block text-xs leading-relaxed text-[var(--color-text-subtle)]">Organizers review people before accepting.</span>
            </button>
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] text-[var(--color-secondary)]"><Mic size={19} /></span>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Step 3 · Your idea</p><h2 className="mt-1 font-heading text-xl font-semibold">Tell us what you’re planning</h2><p className="mt-1 text-sm text-[var(--color-text-subtle)]">Type a rough idea, or dictate for up to 25 seconds.</p></div>
          </div>
          <label htmlFor="event-notes" className="sr-only">Event details and notes</label>
          <textarea id="event-notes" value={notes} onChange={(event) => { setNotes(event.target.value); setDraft(null); }} rows={6} maxLength={4000} placeholder="What will happen? Who is it for? Any schedule, rules, or prizes you already know?" className="w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed transition-[border-color,box-shadow] duration-[var(--duration-base)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-accent-dark)] focus:shadow-[var(--shadow-focus)] focus:outline-none" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-text-subtle)]">{notes.length}/4000 characters</p>
            <Button type="button" variant={voice.isRecording ? 'danger' : 'outline'} size="sm" disabled={voice.isTranscribing} onClick={voice.isRecording ? voice.stop : voice.start}>
              {voice.isRecording ? <><MicOff size={16} /> Stop recording</> : voice.isTranscribing ? <><LoaderCircle className="animate-spin" size={16} /> Transcribing…</> : <><Mic size={16} /> Speak your idea</>}
            </Button>
          </div>
          {voice.isRecording && <p className="voice-recording mt-3 flex items-center gap-2 text-sm font-medium text-[var(--color-danger)]" role="status"><span className="size-2 rounded-full bg-[var(--color-danger)]" />Recording… select stop when you’re done.</p>}
          {voice.error && <p className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning-bg)] p-3 text-sm text-[var(--color-text)]" role="alert">{voice.error}</p>}
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-subtle)]">Microphone access is optional. Your voice clip is sent securely to the server for transcription and is not saved by this draft screen.</p>
        </section>

        {structureError && <p className="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger-bg)] p-4 text-sm text-[var(--color-danger)]" role="alert">{structureError}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-sm text-xs leading-relaxed text-[var(--color-text-subtle)]">AI gives you an editable starting point. Check the details before sharing.</p>
          <Button type="submit" size="lg" loading={isStructuring} disabled={!title.trim() || !notes.trim() || voice.isRecording || voice.isTranscribing}>
            {isStructuring ? <><LoaderCircle className="animate-spin" size={18} /> Shaping your event…</> : <><Sparkles size={18} /> Structure my event <ArrowRight size={17} /></>}
          </Button>
        </div>
      </form>

      <aside aria-label="Live event preview" className="h-fit overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] xl:sticky xl:top-24">
        <EventFolderPreview
          title={title}
          eventType={eventType}
          eventLabel={eventLabel}
          date={date}
          venue={venue}
        />
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] p-3"><span className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]"><CalendarDays size={14} /> Date</span><strong className="mt-1 block truncate text-sm">{date || 'To be decided'}</strong></div>
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] p-3"><span className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]"><MapPin size={14} /> Location</span><strong className="mt-1 block truncate text-sm">{venue || 'To be decided'}</strong></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium">{eventLabel}</span>
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium">{screened ? 'Organizer review' : 'Direct registration'}</span>
          </div>
          {isStructuring && <div className="ai-result space-y-3" role="status" aria-live="polite"><div className="flex items-center gap-2 text-sm font-semibold"><LoaderCircle className="animate-spin text-[var(--color-secondary)]" size={18} /> Building your event outline</div><div className="h-3 animate-pulse rounded-full bg-[var(--color-surface-alt)]" /><div className="h-3 w-4/5 animate-pulse rounded-full bg-[var(--color-surface-alt)]" /><div className="h-3 w-3/5 animate-pulse rounded-full bg-[var(--color-surface-alt)]" /></div>}
          {draft && !isStructuring ? (
            <div className="ai-result space-y-5" role="status">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-success)]"><Check size={17} /> AI outline ready to review</div>
              <section><h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Event overview</h3><p className="mt-2 text-sm leading-relaxed">{draft.structured.summary || draft.reply}</p></section>
              {draft.structured.schedule.length > 0 && <section><h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]"><Clock3 size={14} /> Suggested schedule</h3><ul className="mt-2 space-y-2">{draft.structured.schedule.map((item, index) => <li key={`${item.title}-${index}`} className="flex gap-3 text-sm"><span className="min-w-16 font-semibold text-[var(--color-secondary)]">{item.time || 'TBD'}</span><span>{item.title}{item.description ? <span className="block text-xs text-[var(--color-text-subtle)]">{item.description}</span> : null}</span></li>)}</ul></section>}
              {draft.structured.rules.length > 0 && <section><h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Good to know</h3><ul className="mt-2 list-inside list-disc space-y-1 text-sm">{draft.structured.rules.slice(0, 5).map((rule, index) => <li key={`${rule}-${index}`}>{rule}</li>)}</ul></section>}
              {draft.structured.prizes.length > 0 && <section><h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Prizes</h3><ul className="mt-2 space-y-1 text-sm">{draft.structured.prizes.slice(0, 3).map((prize, index) => <li key={`${prize}-${index}`}>✦ {prize}</li>)}</ul></section>}
              {draft.open_questions.length > 0 && <section className="rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning-bg)] p-3"><h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide"><CircleHelp size={15} /> A few things to confirm</h3><ul className="mt-2 space-y-1 text-sm">{draft.open_questions.map((question, index) => <li key={`${question}-${index}`}>• {question}</li>)}</ul></section>}
              <Button type="button" variant="outline" size="sm" onClick={() => { setDraft(null); setStructureError(null); }}><RotateCcw size={15} /> Refine my notes</Button>
            </div>
          ) : !isStructuring ? (
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] p-4">
              <div className="flex items-start gap-3"><span className="mt-0.5 text-[var(--color-secondary)]"><Sparkles size={18} /></span><div><h3 className="text-sm font-semibold">Your AI event outline will appear here</h3><p className="mt-1 text-xs leading-relaxed text-[var(--color-text-subtle)]">Add a name and a few notes, then we’ll suggest a summary, schedule, rules, and questions to finish.</p></div></div>
            </div>
          ) : null}
          <div className="border-t border-[var(--color-border)] pt-4">
            <p className="text-xs leading-relaxed text-[var(--color-text-subtle)]">AI helps shape the draft. Always verify dates, venue, rules, and eligibility before publishing.</p>
            <Button type="button" size="sm" className="mt-3 w-full" disabled><Check size={15} /> Save and publish <span className="text-xs font-normal opacity-75">· coming next</span></Button>
          </div>
        </div>
      </aside>
    </div>
  );
}