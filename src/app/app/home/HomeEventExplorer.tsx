'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { AppEventCard } from '@/components/events/AppEventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { EVENT_TYPES } from '@/lib/constants/eventTypes';
import { MOCK_REGISTRATIONS } from '@/mocks';
import type { Event, EventType } from '@/types';

interface HomeEventExplorerProps {
  events: Event[];
}

/** Search and filter controls for the app's eligible-event feed. */
export default function HomeEventExplorer({ events }: HomeEventExplorerProps) {
  const [query, setQuery] = useState('');
  const [campus, setCampus] = useState('all');
  const [type, setType] = useState<EventType | 'all'>('all');
  const [mode, setMode] = useState<'all' | 'online' | 'offline'>('all');
  const [price, setPrice] = useState<'all' | 'free' | 'paid'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [registeredOnly, setRegisteredOnly] = useState(false);
  const registeredEventIds = MOCK_REGISTRATIONS.map(({ event_id }) => event_id);
  const campuses = Array.from(
    new Map(
      events.flatMap((event) => {
        const institution = event.owner?.institution;
        return institution ? [[institution.id, institution.name] as const] : [];
      }),
    ),
    ([id, name]) => ({ id, name }),
  );

  const filteredEvents = events.filter((event) => {
    const text = `${event.title} ${event.venue ?? ''} ${event.owner?.institution?.name ?? ''} ${event.description_structured?.summary ?? ''}`.toLowerCase();
    const registered = registeredEventIds.includes(event.id);
    const eventDate = event.starts_at.slice(0, 10);
    return text.includes(query.trim().toLowerCase())
      && (type === 'all' || event.type === type)
      && (campus === 'all' || event.owner?.institution?.id === campus)
      && (mode === 'all' || event.mode === mode)
      && (price === 'all' || (price === 'free' ? event.cost_amount === 0 : event.cost_amount > 0))
      && (!startDate || eventDate >= startDate)
      && (!endDate || eventDate <= endDate)
      && (!registeredOnly || registered);
  });

  return (
    <section aria-labelledby="feed-title" className="mt-[var(--space-8)]">
      <div className="mb-[var(--space-5)] flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">For your campus</p>
          <h2 id="feed-title" className="mt-1 font-heading text-2xl font-semibold">Events worth showing up for</h2>
        </div>
        <span className="text-sm text-[var(--color-text-subtle)]">{filteredEvents.length} events</span>
      </div>

      <div className="mb-[var(--space-5)] grid grid-cols-1 gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-7">
        <label className="flex min-h-[44px] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 sm:col-span-2 lg:col-span-1">
          <Search size={16} className="shrink-0 text-[var(--color-text-subtle)]" />
          <span className="sr-only">Search events</span>
          <input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-subtle)]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-text-muted)]">
          Campus
          <select className="min-h-[44px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]" value={campus} onChange={(event) => setCampus(event.target.value)}>
            <option value="all">All campuses</option>
            {campuses.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-text-muted)]">
          Type
          <select className="min-h-[44px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]" value={type} onChange={(event) => setType(event.target.value as EventType | 'all')}>
            <option value="all">All types</option>
            {EVENT_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-text-muted)]">
          Format
          <select className="min-h-[44px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value="all">Online or in person</option><option value="online">Online</option><option value="offline">In person</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-text-muted)]">
          Cost
          <select className="min-h-[44px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]" value={price} onChange={(event) => setPrice(event.target.value as typeof price)}>
            <option value="all">Any price</option><option value="free">Free</option><option value="paid">Paid</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-text-muted)]">
          From
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="min-h-[44px] min-w-0 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-text-muted)]">
          To
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="min-h-[44px] min-w-0 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]" />
        </label>
        <label className="flex min-h-[44px] items-center gap-2 text-sm text-[var(--color-text-muted)] sm:col-span-2 lg:col-span-5">
          <input className="size-4 accent-[var(--color-secondary)]" type="checkbox" checked={registeredOnly} onChange={(event) => setRegisteredOnly(event.target.checked)} />
          Show only events I’m registered for
        </label>
      </div>

      {filteredEvents.length ? (
        <div className="grid grid-cols-1 gap-[var(--space-5)] lg:grid-cols-2">
          {filteredEvents.map((event) => <AppEventCard key={event.id} event={event} registered={registeredEventIds.includes(event.id)} />)}
        </div>
      ) : (
        <EmptyState icon={<Search size={24} />} title="No events found" description="Try adjusting your filters to see more campus events." action={{ label: 'Clear filters', onClick: () => { setQuery(''); setCampus('all'); setType('all'); setMode('all'); setPrice('all'); setStartDate(''); setEndDate(''); setRegisteredOnly(false); }, variant: 'outline' }} />
      )}
    </section>
  );
}