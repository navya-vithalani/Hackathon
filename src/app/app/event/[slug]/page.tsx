import { notFound } from 'next/navigation';
import EventWorkspace from './EventWorkspace';
import { MOCK_BROADCASTS, MOCK_EVENT_MEMBERS, MOCK_EVENTS, MOCK_REGISTRATIONS } from '@/mocks';

export default async function AppEventPage({ params }: PageProps<'/app/event/[slug]'>) {
  const { slug } = await params;
  const event = MOCK_EVENTS.find((item) => item.slug === slug && item.status === 'published');
  if (!event) notFound();

  return (
    <EventWorkspace
      event={event}
      members={MOCK_EVENT_MEMBERS.filter((member) => member.event_id === event.id)}
      broadcasts={MOCK_BROADCASTS.filter((broadcast) => broadcast.event_id === event.id)}
      registrations={MOCK_REGISTRATIONS.filter((registration) => registration.event_id === event.id)}
    />
  );
}