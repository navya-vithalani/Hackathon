/**
 * BottomNav.tsx — Mobile bottom tab bar (hidden at md+).
 * 5 tabs: Home, My Events, Create, Campus, Profile.
 * Active tab is highlighted with the accent color.
 * Minimum 44px tap targets. iOS home-indicator padding via env(safe-area-inset-bottom).
 * Fixed at the bottom with a blurred background.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { MAIN_NAV } from '@/lib/constants/nav';

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Mobile-only fixed bottom navigation bar.
 * Reads the current path to highlight the active tab.
 * Hidden at the md breakpoint in favour of the sidebar.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[var(--z-sticky)]',
        'flex items-stretch md:hidden',
        'h-[var(--bottom-nav-height)]',
        'border-t border-[var(--color-border)]',
        // Frosted glass background
        'bg-[var(--color-surface)]/80 backdrop-blur-md',
        // iOS home indicator clearance
        'pb-[env(safe-area-inset-bottom,0px)]',
      )}
    >
      {MAIN_NAV.map((item) => {
        const Icon    = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center gap-1',
              'min-h-[44px] text-xs font-medium transition-colors duration-[var(--duration-base)]',
              isActive
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text)]',
            )}
          >
            <Icon
              size={22}
              aria-hidden="true"
              strokeWidth={isActive ? 2.25 : 1.75}
            />
            <span className="leading-none">{item.label}</span>

            {/* Active dot indicator */}
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute top-1.5 inset-x-0 mx-auto w-1 h-1 rounded-[var(--radius-pill)] bg-[var(--color-accent)]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
