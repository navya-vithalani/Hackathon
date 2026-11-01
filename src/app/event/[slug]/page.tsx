import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CalendarDays, Hexagon, MapPin, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { EVENT_TYPE_LABELS } from '@/lib/constants/eventTypes';
import { ROUTES } from '@/lib/constants/routes';
import { MOCK_EVENTS } from '@/mocks';
import styles from '../../discovery.module.css';
import XplorerEventShowcase from './XplorerEventShowcase';

export async function generateMetadata({ params }: PageProps<'/event/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const event = MOCK_EVENTS.find((item) => item.slug === slug && item.status === 'published');
  if (!event) return { title: 'Event not found' };
  const description = event.description_structured?.summary ?? `${event.title} campus event details.`;
  return {
    title: event.title,
    description,
    openGraph: { type: 'article', title: event.title, description, siteName: 'hivai' },
  };
}

export function generateStaticParams() {
  return MOCK_EVENTS.filter((event) => event.status === 'published').map(({ slug }) => ({ slug }));
}

export default async function EventPage({ params }: PageProps<'/event/[slug]'>) {
  const { slug } = await params;
  const event = MOCK_EVENTS.find((item) => item.slug === slug && item.status === 'published');

  if (!event) notFound();

  const eventDate = new Date(event.starts_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  const endDate = new Date(event.ends_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <main className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <Link className={styles.backLink} href={ROUTES.APP_HOME}><ArrowLeft size={16} /> Back to home</Link>
        <Link href={ROUTES.APP_HOME} className={styles.brand}><span className={styles.brandMark}><Hexagon size={18} aria-hidden="true" /></span><span>hivai</span></Link>
        <Link href={ROUTES.APP_HOME}>Home <ArrowUpRight size={15} /></Link>
      </header>

      {event.slug === 'xplorer-2026' ? (
        <XplorerEventShowcase event={event} />
      ) : (
        <article className={styles.detailContent}>
          <div className={styles.detailArtwork} data-type={event.type}>
            <p>{EVENT_TYPE_LABELS[event.type]} · {event.mode === 'online' ? 'Online' : 'In person'}</p>
            <h1>{event.title}</h1>
          </div>

          <div className={styles.detailBody}>
            <div>
              <p className={styles.detailSummary}>{event.description_structured?.summary}</p>
              {event.description_structured?.schedule.length ? (
                <section className={styles.detailSection}>
                  <h2>Schedule</h2>
                  <ul>
                    {event.description_structured.schedule.map((item) => (
                      <li key={`${item.time}-${item.title}`}><strong>{item.time}</strong> · {item.title}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {event.description_structured?.rules.length ? (
                <section className={styles.detailSection}>
                  <h2>Good to know</h2>
                  <ul>{event.description_structured.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
                </section>
              ) : null}
            </div>

            <aside className={styles.detailFacts} aria-label="Event information">
              <div className={styles.detailFact}>
                <CalendarDays size={18} />
                <div><strong>{eventDate}</strong><span>{eventDate === endDate ? 'One day event' : `Through ${endDate}`}</span></div>
              </div>
              <div className={styles.detailFact}>
                <MapPin size={18} />
                <div><strong>{event.mode === 'online' ? 'Online event' : event.venue}</strong><span>{event.mode === 'online' ? 'Joining details shared by organizers' : 'Hosted by ' + (event.owner?.institution?.name ?? 'the campus community')}</span></div>
              </div>
              <div className={styles.detailFact}>
                <Users size={18} />
                <div><strong>{event.capacity ? `${event.capacity} places` : 'Open attendance'}</strong><span>{event.cost_amount === 0 ? 'Free to attend' : `₹${event.cost_amount} per person`}</span></div>
              </div>
            </aside>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
            <p className="text-sm text-[var(--color-text-subtle)]">Want to get involved? Sign in to explore this event.</p>
            <Link className="inline-flex min-h-[44px] items-center gap-2 bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-accent-contrast)] no-underline" href={ROUTES.APP_EVENT(event.slug)}>Sign in to hivai <ArrowUpRight size={16} /></Link>
          </div>
        </article>
      )}
    </main>
  );
}