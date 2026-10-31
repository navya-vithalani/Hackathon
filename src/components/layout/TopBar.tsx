/**
 * TopBar.tsx — App top bar.
 * Left: back button (optional) or page title / logo.
 * Right: notification bell + optional action slots.
 * Height: var(--nav-height). Sticky top with backdrop blur.
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/constants/routes';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopBarProps {
  /** Page title shown in the centre/left area. */
  title?: string;
  /** Show a back-chevron on the left that calls router.back(). */
  showBack?: boolean;
  /** Extra action nodes (icon buttons etc.) shown at the right before the bell. */
  actions?: ReactNode;
  /** Notification badge count on the bell icon. 0 hides the badge. */
  notificationCount?: number;
  /** Additional className for the root element. */
  className?: string;
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function NotifBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      aria-label={`${count} unread notifications`}
      className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-[var(--radius-pill)] bg-[var(--color-danger)] text-[var(--color-text-inverse)] text-[10px] font-bold leading-none px-1"
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Sticky top app bar shared by all authenticated pages.
 * On mobile it renders the page title; on desktop it supplements the sidebar.
 */
export function TopBar({
  title,
  showBack = false,
  actions,
  notificationCount = 0,
  className,
}: TopBarProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-sticky)]',
        'flex items-center gap-[var(--space-3)]',
        'h-[var(--nav-height)] px-[var(--space-4)]',
        'bg-[var(--color-surface)]/80 backdrop-blur-md',
        'border-b border-[var(--color-border)]',
        className,
      )}
    >
      {/* Left area */}
      {showBack ? (
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex items-center justify-center rounded-[var(--radius-md)] -ml-2 p-2 text-[var(--color-text)] hover:bg-[var(--color-hover-overlay)] transition-colors"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
      ) : (
        /* Logo — visible on mobile; sidebar carries it on desktop */
        <Link
          href={ROUTES.APP_HOME}
          aria-label="Evently home"
          className="flex items-center gap-2 md:hidden font-heading font-bold text-lg text-[var(--color-text)]"
        >
          Evently
        </Link>
      )}

      {/* Title */}
      {title && (
        <h1 className="flex-1 text-base font-semibold text-[var(--color-text)] truncate">
          {title}
        </h1>
      )}

      {/* Spacer when no title */}
      {!title && <span className="flex-1" aria-hidden="true" />}

      {/* Right actions */}
      {actions}

      {/* Notification bell */}
      <Link
        href={ROUTES.APP_INBOX}
        aria-label={`Inbox${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
        className="relative flex items-center justify-center rounded-[var(--radius-md)] p-2 text-[var(--color-text)] hover:bg-[var(--color-hover-overlay)] transition-colors"
      >
        <Bell size={20} aria-hidden="true" />
        <NotifBadge count={notificationCount} />
      </Link>
    </header>
  );
}
