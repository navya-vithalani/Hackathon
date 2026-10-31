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

  return (
    <Card variant="flat" className="min-w-0 bg-[var(--color-surface)]">
      <div className="flex min-h-[112px] items-center justify-between gap-4 bg-[var(--color-surface-dark)] px-[var(--space-5)] text-[var(--color-text-inverse)]">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-light)]">
            {EVENT_TYPE_LABELS[event.type]}
          </p>
          <h3 className="max-w-[30ch] font-heading text-xl font-semibold leading-tight">
            {event.title}
          </h3>
        </div>
        <span aria-hidden="true" className="text-3xl">{typeIcon}</span>
      </div>
      <div className="flex flex-col gap-4 p-[var(--space-5)]">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--color-text-subtle)]">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{formatDate(event.starts_at)}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{event.mode === 'online' ? 'Online' : event.venue}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant={registered ? 'success' : 'neutral'}>{registered ? 'Registered' : event.mode === 'online' ? 'Online' : 'In person'}</Badge>
            <Badge variant={event.cost_amount === 0 ? 'outline' : 'warning'}>{event.cost_amount === 0 ? 'Free' : `₹${event.cost_amount}`}</Badge>
          </div>
          <Link className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-[var(--color-secondary)]" href={ROUTES.APP_EVENT(event.slug)}>
            Open <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}