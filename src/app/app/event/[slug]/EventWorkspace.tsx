'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, MapPin, Send, Settings2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { EVENT_TYPE_LABELS } from '@/lib/constants/eventTypes';
import { ROUTES } from '@/lib/constants/routes';
import { formatDate } from '@/lib/utils/date';
import type { Broadcast, Event, EventMember, EventRole, Registration } from '@/types';

interface EventWorkspaceProps {
  event: Event;
  members: EventMember[];
  broadcasts: Broadcast[];
  registrations: Registration[];
}

const roleOptions = [
  { value: 'participant', label: 'Participant' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'owner', label: 'Owner' },
];

/** Role-aware workspace preview for overview, messages, people, and event operations. */
export default function EventWorkspace({ event, members, broadcasts, registrations }: EventWorkspaceProps) {
  const [role, setRole] = useState<EventRole>(event.member_role ?? 'participant');
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState(broadcasts);
  const [draftMessage, setDraftMessage] = useState('');
  const [checkedIn, setCheckedIn] = useState<string[]>([]);
  const organizer = role === 'owner' || role === 'organizer';
  const canCheckIn = organizer || role === 'volunteer';

  const tabs: TabItem[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'chat', label: 'Chat / broadcasts', count: messages.length },
    { value: 'people', label: 'People', count: members.length },
    ...(organizer ? [{ value: 'registrations', label: 'Registrations', count: registrations.length }] : []),
    ...(canCheckIn ? [{ value: 'checkin', label: 'Check-in' }] : []),
    ...(role === 'owner' ? [{ value: 'settings', label: 'Settings' }] : []),
  ];

  function changeRole(value: string) {
    setRole(value as EventRole);
    setActiveTab('overview');
  }

  function postMessage(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const body = draftMessage.trim();
    if (!body) return;
    setMessages((current) => [{ id: `local-${Date.now()}`, event_id: event.id, author_id: 'user-1', audience: 'everyone', body, created_at: new Date().toISOString() }, ...current]);
    setDraftMessage('');
  }

  return (
    <div className="space-y-6">
      <Link href={ROUTES.APP_MY_EVENTS} className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--color-secondary)]"><ArrowLeft size={16} /> My Events</Link>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">{EVENT_TYPE_LABELS[event.type]} workspace</p><h1 className="font-heading text-3xl font-semibold">{event.title}</h1><div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--color-text-subtle)]"><span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{formatDate(event.starts_at)}</span><span className="inline-flex items-center gap-1.5"><MapPin size={14} />{event.mode === 'online' ? 'Online' : event.venue}</span></div></div>
        <Select aria-label="Preview event role" value={role} onChange={(eventChange) => changeRole(eventChange.target.value)} options={roleOptions} containerClassName="min-w-[180px]" />
      </header>

      <Tabs value={activeTab} onChange={setActiveTab} tabs={tabs}>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-5 pt-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(250px,0.7fr)]">
            <Card variant="flat" className="p-5"><Badge variant="success">{event.registration_mode === 'screened' ? 'Selection event' : 'Open registration'}</Badge><h2 className="mt-4 font-heading text-xl font-semibold">About this event</h2><p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{event.description_structured?.summary}</p>{event.description_structured?.schedule.length ? <div className="mt-5 border-t border-[var(--color-border)] pt-4"><h3 className="text-sm font-semibold">Schedule</h3><ul className="mt-3 space-y-2">{event.description_structured.schedule.map((item) => <li className="flex gap-3 text-sm" key={`${item.time}-${item.title}`}><span className="w-24 shrink-0 font-mono text-xs text-[var(--color-text-subtle)]">{item.time}</span><span>{item.title}</span></li>)}</ul></div> : null}</Card>
            <div className="space-y-3"><Card variant="flat" className="p-5"><p className="text-xs text-[var(--color-text-subtle)]">Your role</p><p className="mt-1 font-heading text-xl font-semibold capitalize">{role}</p><p className="mt-2 text-xs text-[var(--color-text-subtle)]">Role preview is local and does not change permissions on a live account.</p></Card><Card variant="flat" className="p-5"><div className="flex items-center gap-2 text-[var(--color-secondary)]"><Users size={17} /><h2 className="text-sm font-semibold text-[var(--color-text)]">Event crew</h2></div><p className="mt-2 text-sm text-[var(--color-text-muted)]">{members.length} team members and {registrations.length} sample registrations.</p></Card></div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-3xl space-y-5 pt-6"><form onSubmit={postMessage} className="flex flex-col gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row"><label className="sr-only" htmlFor="broadcast-message">Write a message</label><input id="broadcast-message" value={draftMessage} onChange={(eventChange) => setDraftMessage(eventChange.target.value)} placeholder="Share an event update..." className="min-h-[44px] min-w-0 flex-1 bg-transparent px-2 outline-none" /><Button type="submit" disabled={!draftMessage.trim()}><Send size={15} /> Send</Button></form><div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">{messages.map((message) => <article key={message.id} className="py-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold">{message.author?.full_name ?? 'You / Event team'}</p><time className="text-xs text-[var(--color-text-subtle)]">{formatDate(message.created_at)}</time></div><p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{message.body}</p><Badge variant="neutral" className="mt-2">{message.audience.replace('_', ' ')}</Badge></article>)}</div></div>
        )}

        {activeTab === 'people' && (
          <div className="max-w-2xl divide-y divide-[var(--color-border)] border-y border-[var(--color-border)] pt-2">{members.map((member) => <div key={`${member.event_id}-${member.profile_id}`} className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-semibold">{member.profile?.full_name ?? 'Event member'}</p><p className="mt-1 text-xs text-[var(--color-text-subtle)]">{member.profile?.institution?.name}</p></div><Badge variant="outline">{member.role}</Badge></div>)}{organizer && <Button variant="outline" className="my-4"><Users size={15} /> Invite a team member</Button>}</div>
        )}

        {activeTab === 'registrations' && organizer && (
          <div className="overflow-x-auto pt-6"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead><tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-subtle)]"><th className="p-3">Applicant</th><th className="p-3">Status</th><th className="p-3">Screening</th><th className="p-3">Recommendation</th></tr></thead><tbody>{registrations.map((registration) => <tr key={registration.id} className="border-b border-[var(--color-border)]"><td className="p-3 font-medium">{registration.profile?.full_name ?? 'Applicant'}</td><td className="p-3"><Badge variant={registration.status === 'accepted' ? 'success' : 'warning'}>{registration.status}</Badge></td><td className="p-3">{registration.screening ? `${registration.screening.score}/100` : 'Not screened'}</td><td className="p-3">{registration.screening?.recommendation ?? 'Review'}</td></tr>)}</tbody></table>{!registrations.length && <p className="py-8 text-center text-sm text-[var(--color-text-subtle)]">No sample registrations yet.</p>}</div>
        )}

        {activeTab === 'checkin' && canCheckIn && (
          <div className="max-w-2xl space-y-4 pt-6"><Card variant="flat" className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-heading text-lg font-semibold">Registration check-in</h2><p className="mt-1 text-sm text-[var(--color-text-muted)]">Camera scanning is not enabled. Mark a sample attendee below.</p></div><Badge variant="warning">Manual preview</Badge></Card>{registrations.map((registration) => {const checked = checkedIn.includes(registration.id); return <div key={registration.id} className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] py-3"><div><p className="text-sm font-semibold">{registration.profile?.full_name ?? 'Attendee'}</p><p className="text-xs text-[var(--color-text-subtle)]">{registration.id}</p></div><Button size="sm" variant={checked ? 'outline' : 'primary'} onClick={() => setCheckedIn((current) => checked ? current.filter((id) => id !== registration.id) : [...current, registration.id])}>{checked ? 'Checked in' : 'Check in'}</Button></div>;})}</div>
        )}

        {activeTab === 'settings' && role === 'owner' && <div className="max-w-xl space-y-4 pt-6"><Card variant="flat" className="p-5"><div className="flex items-center gap-2"><Settings2 size={18} /><h2 className="font-heading text-lg font-semibold">Event settings</h2></div><p className="mt-2 text-sm text-[var(--color-text-muted)]">Manage visibility, eligibility, and team access for this event.</p><div className="mt-4 flex flex-wrap gap-2"><Badge variant="success">Published</Badge><Badge variant="outline">{event.capacity ?? 'No'} capacity</Badge><Badge variant="neutral">{event.eligibility.type.replace('_', ' ')}</Badge></div></Card><Link href={ROUTES.EVENT_PUBLIC(event.slug)} className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--color-secondary)]">View public event page ↗</Link></div>}
      </Tabs>
    </div>
  );
}