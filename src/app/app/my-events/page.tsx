import { AppEventCard } from '@/components/events/AppEventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_ORGANIZING_EVENTS, MOCK_PARTICIPATING_EVENTS, MOCK_VOLUNTEERING_EVENTS } from '@/mocks';
import type { Event } from '@/types';

const groups: { title: string; description: string; events: Event[] }[] = [
  { title: 'Participating', description: 'Events you have joined.', events: MOCK_PARTICIPATING_EVENTS },
  { title: 'Organizing', description: 'Events you help bring to life.', events: MOCK_ORGANIZING_EVENTS },
  { title: 'Volunteering', description: 'Events where you are on the volunteer team.', events: MOCK_VOLUNTEERING_EVENTS },
];

export default function MyEventsPage() {
  return (
    <div className="space-y-[var(--space-10)]">
      <header className="border-b border-[var(--color-border)] pb-[var(--space-6)]">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Your event roles</p>
        <h1 className="font-heading text-3xl font-semibold">My Events</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">One place for everything you attend, organize, and support.</p>
      </header>
      {groups.map((group) => (
        <section key={group.title} aria-labelledby={`group-${group.title}`}>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div><h2 id={`group-${group.title}`} className="font-heading text-xl font-semibold">{group.title}</h2><p className="mt-1 text-xs text-[var(--color-text-subtle)]">{group.description}</p></div>
            <span className="text-xs text-[var(--color-text-subtle)]">{group.events.length}</span>
          </div>
          {group.events.length ? (
            <div className="grid grid-cols-1 gap-[var(--space-5)] lg:grid-cols-2">
              {group.events.map((event) => <AppEventCard key={event.id} event={event} registered={group.title === 'Participating'} />)}
            </div>
          ) : (
            <EmptyState title="Nothing here yet" description="When you join or volunteer for an event, it will appear here." className="border border-dashed border-[var(--color-border)] py-[var(--space-8)]" />
          )}
        </section>
      ))}
    </div>
  );
}