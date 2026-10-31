/**
 * EmptyState.tsx — Empty list/section placeholder.
 * Shows an icon, title, description, and optional CTA button.
 * Props: icon, title, description, action (button config).
 * Used in event feeds, inbox, search results, etc.
 */

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Emoji string or a React SVG/icon node shown above the title. */
  icon?: React.ReactNode;
  /** Short headline. */
  title: string;
  /** Supporting description text. */
  description?: string;
  /** Optional CTA button configuration. */
  action?: EmptyStateAction;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Centred empty-state card. Drop into any list/feed area when there is
 * nothing to display. Pass an emoji or icon, a title, and optionally a CTA.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-[var(--space-3)] text-center',
        'py-[var(--space-16)] px-[var(--space-6)]',
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          className="flex items-center justify-center text-4xl select-none"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>

      {description && (
        <p className="max-w-sm text-base text-[var(--color-text-subtle)] leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <Button
          variant={action.variant ?? 'primary'}
          size="md"
          onClick={action.onClick}
          className="mt-[var(--space-2)]"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
