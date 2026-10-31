/** AppShell.tsx — Shared responsive frame for authenticated pages. */

'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { ROUTES } from '@/lib/constants/routes';
import type { Profile } from '@/types';

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.APP_HOME]: 'Home',
  [ROUTES.APP_MY_EVENTS]: 'My Events',
  [ROUTES.APP_CREATE]: 'Create an event',
  [ROUTES.APP_CAMPUS]: 'Campus',
  [ROUTES.APP_PROFILE]: 'Your profile',
  [ROUTES.APP_PROFILE_ID]: 'Digital campus ID',
  [ROUTES.APP_INBOX]: 'Inbox',
};

/** Supplies the desktop sidebar, mobile tabs, page title, and notification entry. */
export function AppShell({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: Pick<Profile, 'full_name' | 'avatar_url'>;
}>) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? (pathname.startsWith('/app/event/') ? 'Event workspace' : 'hivai');

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-[var(--space-4)] focus:top-[var(--space-4)] focus:z-[var(--z-tooltip)] focus:rounded-[var(--radius-md)] focus:bg-[var(--color-surface)] focus:px-[var(--space-4)] focus:py-[var(--space-3)] focus:text-[var(--color-text)] focus:shadow-[var(--shadow-lg)]"
      >
        Skip to content
      </a>
      <Sidebar user={user} />
      <div className="app-shell-content md:ml-[var(--sidebar-collapsed-width)] md:transition-[margin] md:duration-[var(--duration-slow)] md:ease-[var(--ease-standard)]">
        <TopBar title={title} actions={<SignOutButton />} />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[var(--content-max-width)] px-[var(--space-4)] py-[var(--space-6)] pb-28 outline-none md:px-[var(--space-8)] md:pb-[var(--space-10)]">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}