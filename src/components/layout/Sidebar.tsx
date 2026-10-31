/**
 * Sidebar.tsx — Desktop/tablet left sidebar (shown at md+).
 * Contains: app logo, main nav items, inbox bell, user avatar + name at bottom.
 * Fixed left, width var(--sidebar-width). Hidden on mobile.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { MAIN_NAV, INBOX_NAV } from '@/lib/constants/nav';
import { ROUTES } from '@/lib/constants/routes';
import { Avatar } from '@/components/ui/Avatar';
import { Hexagon } from 'lucide-react';
import type { Profile } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarProps {
  /** Currently authenticated user's profile for the footer avatar. */
  user?: Pick<Profile, 'full_name' | 'avatar_url'>;
  /** Notification count for the Inbox badge. */
  notificationCount?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Desktop sidebar navigation. Hidden on screens narrower than md.
 * Receives the current user for the bottom avatar section.
 */
export function Sidebar({ user, notificationCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const allItems = [...MAIN_NAV, INBOX_NAV];

  return (
    <aside
      aria-label="Sidebar navigation"
      className={cn(
        'hidden md:flex flex-col',
        'fixed left-0 top-0 bottom-0 z-[var(--z-sticky)]',
        'w-[var(--sidebar-width)]',
        'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
        'pt-[env(safe-area-inset-top,0px)]',
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-[var(--nav-height)] px-[var(--space-5)] shrink-0 border-b border-[var(--color-border)]">
        <Link
          href={ROUTES.APP_HOME}
          className="font-heading font-bold text-xl text-[var(--color-text)] hover:opacity-80 transition-opacity"
          aria-label="hivai home"
        >
          <span className="flex items-center gap-2"><Hexagon size={19} className="text-[var(--color-secondary)]" aria-hidden="true" /> hivai</span>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto py-[var(--space-4)] px-[var(--space-3)]" aria-label="Primary">
        <ul className="flex flex-col gap-1 list-none p-0 m-0">
          {allItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const isInbox = item.href === INBOX_NAV.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)]',
                    'px-[var(--space-3)] py-[var(--space-2)] min-h-[44px]',
                    'text-sm font-medium transition-colors duration-[var(--duration-base)]',
                    isActive
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-hover-overlay)]',
                  )}
                >
                  <Icon size={18} aria-hidden="true" strokeWidth={isActive ? 2.25 : 1.75} />
                  <span className="flex-1">{item.label}</span>

                  {/* Notification badge on Inbox */}
                  {isInbox && notificationCount > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 rounded-[var(--radius-pill)] bg-[var(--color-danger)] text-[var(--color-text-inverse)] text-xs font-bold px-1">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      {user && (
        <div className="shrink-0 border-t border-[var(--color-border)] p-[var(--space-3)]">
          <Link
            href={ROUTES.APP_PROFILE}
            className={cn(
              'flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)]',
              'px-[var(--space-3)] py-[var(--space-2)] min-h-[44px]',
              'hover:bg-[var(--color-hover-overlay)] transition-colors',
            )}
          >
            <Avatar
              src={user.avatar_url}
              name={user.full_name}
              size="md"
            />
            <span className="flex-1 text-sm font-medium text-[var(--color-text)] truncate">
              {user.full_name}
            </span>
          </Link>
        </div>
      )}
    </aside>
  );
}
