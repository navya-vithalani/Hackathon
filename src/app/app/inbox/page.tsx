import NotificationList from './NotificationList';
import { MOCK_NOTIFICATIONS } from '@/mocks';

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--color-border)] pb-6"><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Updates for you</p><h1 className="font-heading text-3xl font-semibold">Inbox</h1><p className="mt-2 text-sm text-[var(--color-text-muted)]">Registration updates, campus notes, and event messages.</p></header>
      <NotificationList initialNotifications={MOCK_NOTIFICATIONS} />
    </div>
  );
}