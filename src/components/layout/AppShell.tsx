/** AppShell.tsx — Shared responsive frame for the mock authenticated app. */

'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ROUTES } from '@/lib/constants/routes';
import { MOCK_CURRENT_USER } from '@/mocks';

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.APP_HOME]: 'Home',
  [ROUTES.APP_MY_EVENTS]: 'My Events',
  [ROUTES.APP_CREATE]: 'Create an event',
  [ROUTES.APP_CAMPUS]: 'Campus',
  [ROUTES.APP_PROFILE]: 'Your profile',
  [ROUTES.APP_INBOX]: 'Inbox',
};

/** Supplies the desktop sidebar, mobile tabs, page title, and notification entry. */
export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? (pathname.includes('/event/') ? 'Event workspace' : 'Evently');

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar user={MOCK_CURRENT_USER} notificationCount={2} />
      <div className="md:ml-[var(--sidebar-width)]">
        <TopBar title={title} notificationCount={2} />
        <main className="mx-auto w-full max-w-[var(--content-max-width)] px-[var(--space-4)] py-[var(--space-6)] pb-28 md:px-[var(--space-8)] md:pb-[var(--space-10)]">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}