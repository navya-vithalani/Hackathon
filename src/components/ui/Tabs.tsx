/**
 * Tabs.tsx — Tab navigation bar.
 * Variants: underline (horizontal scrollable indicator line), pill (rounded chips).
 * Fully controlled: caller passes `value` and `onChange`.
 * Renders only the tab bar — content (children) is slotted below.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  value: string;
  label: string;
  /** Optional badge count shown beside the label. */
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  /** Currently active tab value. */
  value: string;
  /** Fired when the user clicks a different tab. */
  onChange: (value: string) => void;
  tabs: TabItem[];
  variant?: 'underline' | 'pill';
  className?: string;
  /** Content rendered below the tab bar. */
  children?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Scrollable horizontal tab bar. Pass `variant="pill"` for rounded chip tabs,
 * or `variant="underline"` (default) for a classic indicator-line style.
 * Content area below is a simple children slot — wrap with conditional rendering in the parent.
 */
export function Tabs({
  value,
  onChange,
  tabs,
  variant = 'underline',
  className,
  children,
}: TabsProps) {
  const isUnderline = variant === 'underline';

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Tab bar */}
      <div
        role="tablist"
        className={cn(
          'flex items-center gap-[var(--space-1)] overflow-x-auto',
          'scrollbar-none [-webkit-overflow-scrolling:touch]',
          isUnderline
            ? 'border-b border-[var(--color-border)] pb-0'
            : 'p-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)]',
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.value === value;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.value)}
              className={cn(
                'relative inline-flex items-center gap-1.5 whitespace-nowrap',
                'text-sm font-medium transition-colors duration-[var(--duration-base)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]',
                'disabled:pointer-events-none disabled:opacity-40 cursor-pointer',
                isUnderline
                  ? cn(
                      'px-[var(--space-4)] py-[var(--space-3)] rounded-t-[var(--radius-sm)]',
                      isActive
                        ? 'text-[var(--color-text)] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:rounded-t after:bg-[var(--color-accent)]'
                        : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text)]',
                    )
                  : cn(
                      'px-[var(--space-4)] py-[var(--space-2)] rounded-[var(--radius-pill)] min-h-[36px]',
                      isActive
                        ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] shadow-[var(--shadow-sm)]'
                        : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text)] hover:bg-[var(--color-hover-overlay)]',
                    ),
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center rounded-[var(--radius-pill)] text-xs font-semibold leading-none px-1.5 min-w-[18px] h-[18px]',
                    isActive && !isUnderline
                      ? 'bg-[var(--color-accent-contrast)] text-[var(--color-accent)]'
                      : 'bg-[var(--color-surface-alt)] text-[var(--color-text-subtle)]',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {children && (
        <div role="tabpanel" className="flex-1">
          {children}
        </div>
      )}
    </div>
  );
}
