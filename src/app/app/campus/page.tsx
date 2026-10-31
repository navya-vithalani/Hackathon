import Link from 'next/link';
import { ArrowRight, Bell, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { AppEventCard } from '@/components/events/AppEventCard';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/lib/constants/routes';
import { formatDate } from '@/lib/utils/date';
import { MOCK_ANNOUNCEMENTS, MOCK_EVENTS, MOCK_INSTITUTION } from '@/mocks';

export default function CampusPage() {
  const campusEvents = MOCK_EVENTS.filter((event) => event.status === 'published' && event.mode === 'offline');

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Your community</p><h1 className="font-heading text-3xl font-semibold">Campus</h1><p className="mt-2 text-sm text-[var(--color-text-muted)]">{MOCK_INSTITUTION.name}</p></div>
        <Badge variant="success">Verified institution</Badge>
      </header>

      <section aria-labelledby="campus-events-title">
        <div className="mb-4 flex items-end justify-between gap-3"><div><h2 id="campus-events-title" className="font-heading text-xl font-semibold">Around your campus</h2><p className="mt-1 text-xs text-[var(--color-text-subtle)]">Events hosted by your community.</p></div><Link href={ROUTES.APP_HOME} className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-[var(--color-secondary)]">All events <ArrowRight size={15} /></Link></div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">{campusEvents.slice(0, 2).map((event) => <AppEventCard key={event.id} event={event} />)}</div>
      </section>

      <section aria-labelledby="announcements-title">
        <div className="mb-4 flex items-center gap-2"><Bell size={18} className="text-[var(--color-secondary)]" /><h2 id="announcements-title" className="font-heading text-xl font-semibold">From your staff</h2></div>
        <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {MOCK_ANNOUNCEMENTS.map((announcement) => (
            <article key={announcement.id} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div><h3 className="text-sm font-semibold">{announcement.title}</h3><p className="mt-1 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">{announcement.body}</p><p className="mt-2 text-xs text-[var(--color-text-subtle)]">{announcement.author?.full_name ?? 'Campus staff'} · {formatDate(announcement.created_at)}</p></div>
              <Badge variant="neutral">Announcement</Badge>
            </article>
          ))}
        </div>
      </section>

      <Card variant="dark" className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4"><Lightbulb size={24} className="shrink-0 text-[var(--color-accent)]" /><div><h2 className="font-heading text-xl font-semibold">A small idea can change your campus.</h2><p className="mt-1 text-sm opacity-80">Share suggestions anonymously and follow what happens next.</p></div></div>
        <Link href={ROUTES.APP_CAMPUS_IDEAS} className="inline-flex min-h-[44px] items-center gap-2 self-start font-semibold text-[var(--color-text-inverse)] sm:self-auto">Open idea board <ArrowRight size={16} /></Link>
      </Card>
    </div>
  );
}