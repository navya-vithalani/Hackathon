/** AppEventCard.tsx — Presentational event summary used inside the app shell. */

import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EVENT_TYPE_LABELS, EVENT_TYPES } from '@/lib/constants/eventTypes';
import { ROUTES } from '@/lib/constants/routes';
import { formatDate } from '@/lib/utils/date';
import type { Event } from '@/types';

interface AppEventCardProps {
  event: Event;
  registered?: boolean;
}

/** Renders event metadata and a link into its app workspace. */
export function AppEventCard({ event, registered = false }: AppEventCardProps) {
  const typeIcon = EVENT_TYPES.find(({ value }) => value === event.type)?.icon;
  const isXplorer = event.slug === 'xplorer-2026';

  return (
    <Card variant="flat" className={`event-preview-card group min-w-0 overflow-hidden bg-[var(--color-surface)] transition-all duration-[var(--duration-slow)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] ${isXplorer ? 'shadow-[var(--shadow-lg)]' : ''}`}>
      <div
        className={`relative flex min-h-[190px] items-end justify-between gap-4 bg-[var(--color-surface-dark)] bg-cover bg-center px-[var(--space-5)] py-5 text-[var(--color-text-inverse)] ${isXplorer ? 'min-h-[205px] px-6 py-5 sm:px-7' : ''}`}
        style={event.cover_url ? {
          backgroundImage: `linear-gradient(0deg, rgba(35, 10, 10, .93) 0%, rgba(35, 10, 10, .66) 52%, rgba(35, 10, 10, .22) 100%), url("${event.cover_url}")`,
        } : undefined}
      >
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-light)]">
            {isXplorer ? 'Gatik Jr. College · 24-hour buildathon' : EVENT_TYPE_LABELS[event.type]}
          </p>
          <h3 className={`max-w-[30ch] font-heading font-semibold leading-tight ${isXplorer ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>
            {event.title}
          </h3>
          {isXplorer && <p className="mt-2 max-w-[42ch] text-xs leading-relaxed text-white/80">Big ideas. Tiny first steps. One unforgettable night.</p>}
        </div>
        {isXplorer ? (
          <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">Featured</span>
        ) : <span aria-hidden="true" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/30 bg-black/20 text-xl text-white backdrop-blur-sm">{typeIcon}</span>}
      </div>
      <div className="flex flex-col gap-4 p-[var(--space-5)]">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--color-text-subtle)]">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{formatDate(event.starts_at)}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{event.mode === 'online' ? 'Online' : event.venue}</span>
          {isXplorer && <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />24 hours · team or solo</span>}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant={registered ? 'success' : 'neutral'}>{registered ? 'Registered' : event.mode === 'online' ? 'Online' : 'In person'}</Badge>
            <Badge variant={event.cost_amount === 0 ? 'outline' : 'warning'}>{event.cost_amount === 0 ? 'Free' : `₹${event.cost_amount}`}</Badge>
          </div>
          <Link className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-[var(--color-secondary)]" href={isXplorer ? ROUTES.EVENT_PUBLIC(event.slug) : ROUTES.APP_EVENT(event.slug)}>
            {isXplorer ? 'Explore' : 'Open'} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}