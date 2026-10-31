'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, MailOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Notification } from '@/types';

/** Local read-state controls for the preview notification inbox. */
export default function NotificationList({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  function markAllRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }

  function markRead(id: string) {
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
  }

  if (!notifications.length) return <EmptyState icon={<MailOpen size={24} />} title="You are all caught up" description="New event updates and campus announcements will appear here." />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm text-[var(--color-text-subtle)]">{unreadCount} unread</p><Button variant="ghost" size="sm" disabled={!unreadCount} onClick={markAllRead}>Mark all read</Button></div>
      <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {notifications.map((notification) => (
          <article key={notification.id} className={`flex gap-4 py-5 ${notification.read ? 'opacity-70' : ''}`}>
            <span aria-hidden="true" className={`mt-2 size-2 shrink-0 rounded-full ${notification.read ? 'bg-[var(--color-border-strong)]' : 'bg-[var(--color-accent-dark)]'}`} />
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge variant="neutral">{notification.type.replace('_', ' ')}</Badge><time className="text-xs text-[var(--color-text-subtle)]" dateTime={notification.created_at}>{new Date(notification.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</time></div><h2 className="mt-2 text-sm font-semibold">{notification.title}</h2><p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{notification.body}</p><div className="mt-2 flex gap-4"><Link className="inline-flex min-h-[40px] items-center text-xs font-semibold text-[var(--color-secondary)]" href={notification.link ?? '/app/home'} onClick={() => markRead(notification.id)}>Open update</Link>{!notification.read && <button className="inline-flex min-h-[40px] items-center gap-1 text-xs text-[var(--color-text-subtle)]" type="button" onClick={() => markRead(notification.id)}><Check size={13} /> Mark read</button>}</div></div>
          </article>
        ))}
      </div>
    </div>
  );
}