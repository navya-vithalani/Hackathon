/**
 * Badge.tsx — Small status/label chip.
 * Variants: accent (gold), secondary (brick), success, danger, warning, neutral, outline.
 * Inline-level element; pairs well with text and inside cards.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// ─── Variant Definitions ──────────────────────────────────────────────────────

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-pill)] px-[var(--space-3)] py-[var(--space-1)] text-xs font-semibold leading-none whitespace-nowrap select-none',
  {
    variants: {
      variant: {
        accent:
          'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]',
        secondary:
          'bg-[var(--color-secondary)] text-[var(--color-text-inverse)]',
        success:
          'bg-[var(--color-success-bg)] text-[var(--color-success)]',
        danger:
          'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
        warning:
          'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
        neutral:
          'bg-[var(--color-surface-alt)] text-[var(--color-text-subtle)]',
        outline:
          'border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)]',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Small inline chip for statuses, labels, and counts.
 * Use `variant` to convey semantic meaning (success, danger, etc.).
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
