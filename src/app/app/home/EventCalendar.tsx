'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { EVENT_TYPE_LABELS } from '@/lib/constants/eventTypes';
import { ROUTES } from '@/lib/constants/routes';
import type { Event, EventType } from '@/types';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EVENT_DOTS: Record<EventType, string> = {
  sports: 'bg-[var(--color-success)]',
  hackathon: 'bg-[var(--color-secondary)]',
  mun: 'bg-[var(--color-info)]',
  cultural: 'bg-[var(--color-warning)]',
  workshop: 'bg-[var(--color-accent-dark)]',
  other: 'bg-[var(--color-text-subtle)]',
};

const EVENT_CHIPS: Record<EventType, string> = {
  sports: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  hackathon: 'bg-[var(--color-danger-bg)] text-[var(--color-secondary)]',
  mun: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
  cultural: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  workshop: 'bg-[var(--color-surface-alt)] text-[var(--color-accent-dark)]',
  other: 'bg-[var(--color-surface-alt)] text-[var(--color-text-subtle)]',
};

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getEventDateKey(event: Event) {
  return getDateKey(new Date(event.starts_at));
}

function formatSelectedDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default function EventCalendar({ events }: { events: Event[] }) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const todayKey = getDateKey(now);
    const currentMonthEvents = events
      .filter((event) => {
        const date = new Date(event.starts_at);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      })
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    const firstUpcomingEvent = currentMonthEvents.find((event) => getEventDateKey(event) >= todayKey);
    const initialEvent = firstUpcomingEvent ?? currentMonthEvents[0];
    return initialEvent ? getEventDateKey(initialEvent) : todayKey;
  });

  const monthEvents = useMemo(
    () => events.filter((event) => {
      const date = new Date(event.starts_at);
      return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
    }),
    [events, month],
  );
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, Event[]>();
    for (const event of monthEvents) {
      const key = getEventDateKey(event);
      grouped.set(key, [...(grouped.get(key) ?? []), event]);
    }
    return grouped;
  }, [monthEvents]);

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leadingDays = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const cellCount = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const todayKey = getDateKey(new Date());
  const selectedEvents = eventsByDate.get(selectedDate) ?? [];
  const featuredEvent = events.find((event) => event.slug === 'xplorer-2026');
  const monthLabel = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(month);

  function changeMonth(offset: number) {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    setMonth(nextMonth);
    const firstEvent = events.find((event) => {
      const date = new Date(event.starts_at);
      return date.getFullYear() === nextMonth.getFullYear() && date.getMonth() === nextMonth.getMonth();
    });
    setSelectedDate(firstEvent ? getEventDateKey(firstEvent) : getDateKey(nextMonth));
  }

  function goToToday() {
    const now = new Date();
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(getDateKey(now));
  }

  return (
    <section aria-labelledby="calendar-title" className="home-calendar mt-[var(--space-8)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
      <header className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden bg-[var(--color-surface-dark)] px-5 py-5 text-[var(--color-text-inverse)] sm:px-7 sm:py-6">
        <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 size-56 rounded-full border border-white/10 shadow-[0_0_0_28px_rgba(255,255,255,0.03),0_0_0_56px_rgba(255,255,255,0.025)]" />
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-white/10 text-[var(--color-accent-light)]"><CalendarDays size={21} /></span>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light)]"><Sparkles size={13} /> The campus calendar</p>
            <h2 id="calendar-title" className="mt-1 font-heading text-xl font-semibold text-[var(--color-text-inverse)]">Find your next moment</h2>
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <button type="button" onClick={goToToday} className="rounded-[var(--radius-md)] px-3 text-sm font-semibold text-[var(--color-text-inverse)] transition-colors hover:bg-white/10">Today</button>
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" className="grid size-10 place-items-center rounded-[var(--radius-md)] border border-white/25 transition-colors hover:bg-white/10"><ArrowLeft size={17} /></button>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Next month" className="grid size-10 place-items-center rounded-[var(--radius-md)] border border-white/25 transition-colors hover:bg-white/10"><ArrowRight size={17} /></button>
        </div>
      </header>

      {featuredEvent && (
        <Link
          href={ROUTES.EVENT_PUBLIC(featuredEvent.slug)}
          className="group relative flex min-h-28 items-center gap-4 overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4 text-inherit no-underline sm:px-7"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-28 bg-cover bg-center opacity-30 transition-transform duration-[var(--duration-slow)] group-hover:scale-110 sm:w-44"
            style={featuredEvent.cover_url ? { backgroundImage: `url("${featuredEvent.cover_url}")` } : undefined}
          />
          <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-surface-dark)] text-[var(--color-accent-light)] shadow-[var(--shadow-sm)]"><Sparkles size={21} /></span>
          <span className="relative z-10 min-w-0 flex-1">
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-secondary)]">Just happened · 31 October</span>
            <span className="mt-1 block truncate font-heading text-lg font-semibold">{featuredEvent.title}</span>
            <span className="mt-0.5 block text-xs text-[var(--color-text-subtle)]">Gatik Jr. College · the overnight buildathon to remember</span>
          </span>
          <span className="relative z-10 hidden items-center gap-1 text-xs font-bold text-[var(--color-secondary)] sm:inline-flex">See the story <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold">{monthLabel}</h3>
            <span className="rounded-full bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--color-secondary)]">{monthEvents.length} happenings</span>
          </div>
          <div role="grid" aria-label={`Events calendar for ${monthLabel}`} className="grid grid-cols-7">
            {WEEKDAYS.map((day) => (
              <div key={day} role="columnheader" className="pb-2 text-center text-xs font-semibold text-[var(--color-text-subtle)]">{day}</div>
            ))}
            {Array.from({ length: cellCount }, (_, index) => {
              const day = index - leadingDays + 1;
              if (day < 1 || day > daysInMonth) {
                return <div key={`empty-${index}`} role="gridcell" aria-hidden="true" className="min-h-14 border-t border-[var(--color-border)] sm:min-h-[76px]" />;
              }

              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const dateKey = getDateKey(date);
              const dayEvents = eventsByDate.get(dateKey) ?? [];
              const isSelected = selectedDate === dateKey;
              const isToday = todayKey === dateKey;

              return (
                <div key={dateKey} role="gridcell" className="min-h-14 border-t border-[var(--color-border)] p-0.5 sm:min-h-[76px] sm:p-1">
                  <button
                    type="button"
                    aria-label={`${formatSelectedDate(date)}${dayEvents.length ? `, ${dayEvents.length} ${dayEvents.length === 1 ? 'event' : 'events'}: ${dayEvents.map((event) => event.title).join(', ')}` : ', no events'}`}
                    aria-pressed={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`group flex h-full min-h-12 w-full flex-col items-center justify-start gap-1 rounded-[var(--radius-md)] p-1 text-sm transition-all duration-[var(--duration-base)] sm:items-start sm:p-2 ${isSelected ? 'bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)]' : 'hover:bg-[var(--color-surface-alt)]'} ${isToday && !isSelected ? 'font-bold text-[var(--color-secondary)] ring-1 ring-[var(--color-accent-dark)]' : ''} ${dayEvents.length && !isSelected ? 'ring-1 ring-inset ring-[var(--color-border)]' : ''}`}
                  >
                    <span>{day}</span>
                    <span aria-hidden="true" className="flex min-h-1.5 flex-wrap justify-center gap-1 sm:justify-start">
                      {dayEvents.slice(0, 4).map((event) => (
                        <span key={event.id} className={`size-1.5 rounded-full ${isSelected ? 'bg-[var(--color-accent-light)]' : EVENT_DOTS[event.type]}`} />
                      ))}
                    </span>
                    {dayEvents[0] && (
                      <span className={`hidden max-w-full truncate rounded px-1.5 py-0.5 text-[9px] font-semibold leading-tight md:block ${isSelected ? 'bg-white/10 text-[var(--color-text-inverse)]' : EVENT_CHIPS[dayEvents[0].type]}`}>
                        {dayEvents[0].title}
                      </span>
                    )}
                    {dayEvents.length > 1 && <span className={`hidden text-[9px] md:block ${isSelected ? 'text-white/70' : 'text-[var(--color-text-subtle)]'}`}>+{dayEvents.length - 1} more</span>}
                  </button>
                </div>
              );
            })}
          </div>
          <div aria-label="Event types" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--color-border)] pt-4">
            {(['hackathon', 'cultural', 'sports', 'workshop', 'mun'] as EventType[]).map((type) => (
              <span key={type} className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]">
                <span className={`size-2 rounded-full ${EVENT_DOTS[type]}`} />{EVENT_TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        </div>

        <aside aria-live="polite" aria-label="Selected date events" className="border-t border-[var(--color-border)] bg-[linear-gradient(155deg,var(--color-surface-alt),var(--color-surface))] p-5 sm:p-6 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Your selected day</p>
          <h3 className="mt-1 font-heading text-xl font-semibold">{formatSelectedDate(new Date(`${selectedDate}T12:00:00`))}</h3>
          {selectedEvents.length ? (
            <ul className="mt-4 space-y-3">
              {selectedEvents.map((event) => (
                <li key={event.id} className="calendar-event rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-transform duration-[var(--duration-base)] hover:-translate-y-0.5">
                  <Link href={event.slug === 'xplorer-2026' ? ROUTES.EVENT_PUBLIC(event.slug) : ROUTES.APP_EVENT(event.slug)} className="group block text-inherit no-underline">
                    <span className="flex items-center gap-2 text-xs font-semibold text-[var(--color-secondary)]">
                      <span className={`size-2 rounded-full ${EVENT_DOTS[event.type]}`} />{EVENT_TYPE_LABELS[event.type]}
                    </span>
                    <span className="mt-2 block text-sm font-semibold group-hover:text-[var(--color-secondary)]">{event.title}</span>
                    <span className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]"><MapPin size={13} />{event.mode === 'online' ? 'Online' : event.venue ?? 'Location to be announced'}</span>
                    <span className="mt-1 block text-xs text-[var(--color-text-subtle)]">{new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(event.starts_at))}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-4">
              <p className="text-sm font-semibold">A little breathing room.</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-subtle)]">Nothing on this date yet. Pick a day with a dot or explore the event feed below.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
