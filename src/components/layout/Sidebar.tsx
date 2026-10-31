/**
 * Sidebar.tsx — Desktop/tablet left sidebar (shown at md+).
 * Contains: app logo, main nav items, inbox bell, user avatar + name at bottom.
 * Fixed left, hover/focus expandable icon rail. Hidden on mobile.
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
        'app-sidebar group/sidebar hidden md:flex flex-col',
        'fixed left-0 top-0 bottom-0 z-[var(--z-sticky)]',
        'w-[var(--sidebar-collapsed-width)] hover:w-[var(--sidebar-width)] focus-within:w-[var(--sidebar-width)]',
        'overflow-hidden transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-standard)]',
        'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
        'pt-[env(safe-area-inset-top,0px)]',
      )}
    >
      {/* Logo */}
      <div className="flex h-[var(--nav-height)] shrink-0 items-center justify-center border-b border-[var(--color-border)] px-[var(--space-3)] group-hover/sidebar:justify-start group-hover/sidebar:px-[var(--space-5)] group-focus-within/sidebar:justify-start group-focus-within/sidebar:px-[var(--space-5)]">
        <Link
          href={ROUTES.APP_HOME}
          className="flex items-center gap-2 whitespace-nowrap font-heading text-xl font-bold text-[var(--color-text)] transition-opacity hover:opacity-80"
          aria-label="hivai home"
          title="hivai home"
        >
          <Hexagon size={19} className="shrink-0 text-[var(--color-secondary)]" aria-hidden="true" />
          <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-[var(--duration-slow)] group-hover/sidebar:max-w-[8rem] group-hover/sidebar:opacity-100 group-focus-within/sidebar:max-w-[8rem] group-focus-within/sidebar:opacity-100">hivai</span>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto py-[var(--space-4)] px-[var(--space-3)]" aria-label="Primary">
        <ul className="flex flex-col gap-1 list-none p-0 m-0">
          {allItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isInbox = item.href === INBOX_NAV.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className={cn(
                    'flex items-center justify-center gap-[var(--space-3)] rounded-[var(--radius-md)] group-hover/sidebar:justify-start group-focus-within/sidebar:justify-start',
                    'px-[var(--space-3)] py-[var(--space-2)] min-h-[44px]',
                    'text-sm font-medium transition-colors duration-[var(--duration-base)]',
                    isActive
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-hover-overlay)]',
                  )}
                >
                  <Icon className="shrink-0" size={18} aria-hidden="true" strokeWidth={isActive ? 2.25 : 1.75} />
                  <span className="max-w-0 flex-1 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-[var(--duration-slow)] group-hover/sidebar:max-w-[12rem] group-hover/sidebar:opacity-100 group-focus-within/sidebar:max-w-[12rem] group-focus-within/sidebar:opacity-100">{item.label}</span>

                  {/* Notification badge on Inbox */}
                  {isInbox && notificationCount > 0 && (
                    <span className="hidden min-w-[20px] h-5 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-danger)] px-1 text-xs font-bold text-[var(--color-text-inverse)] group-hover/sidebar:inline-flex group-focus-within/sidebar:inline-flex">
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
            aria-current={pathname === ROUTES.APP_PROFILE || pathname.startsWith(`${ROUTES.APP_PROFILE}/`) ? 'page' : undefined}
            aria-label={`Profile: ${user.full_name}`}
            title={user.full_name}
            className={cn(
              'flex items-center justify-center gap-[var(--space-3)] rounded-[var(--radius-md)] group-hover/sidebar:justify-start group-focus-within/sidebar:justify-start',
              'px-[var(--space-3)] py-[var(--space-2)] min-h-[44px]',
              'transition-colors duration-[var(--duration-base)]',
              pathname === ROUTES.APP_PROFILE || pathname.startsWith(`${ROUTES.APP_PROFILE}/`)
                ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
                : 'hover:bg-[var(--color-hover-overlay)]',
            )}
          >
            <Avatar
              src={user.avatar_url}
              name={user.full_name}
              size="md"
            />
            <span className="max-w-0 flex-1 overflow-hidden text-sm font-medium text-[var(--color-text)] opacity-0 transition-all duration-[var(--duration-slow)] group-hover/sidebar:max-w-[12rem] group-hover/sidebar:opacity-100 group-focus-within/sidebar:max-w-[12rem] group-focus-within/sidebar:opacity-100 truncate">
              {user.full_name}
            </span>
          </Link>
        </div>
      )}
    </aside>
  );
}
