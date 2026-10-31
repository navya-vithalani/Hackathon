/**
 * Card.tsx — Surface container component.
 * Variants: default (white surface, card shadow, card radius), flat (no shadow), dark (maroon bg).
 * Subcomponents: CardHeader, CardBody, CardFooter for structured layouts.
 * Purely presentational — no state or data fetching.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// ─── Variant Definitions ──────────────────────────────────────────────────────

const cardVariants = cva(
  'flex flex-col rounded-[var(--radius-card)] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-surface)] shadow-[var(--shadow-card)] border border-[var(--color-border)]',
        flat:
          'bg-[var(--color-surface)] border border-[var(--color-border)]',
        dark:
          'bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] border-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

// ─── Card ─────────────────────────────────────────────────────────────────────

/** Top-level surface container. */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

// ─── CardHeader ───────────────────────────────────────────────────────────────

/** Top section of a Card — typically holds title and subtitle. */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1 p-[var(--space-5)]', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// ─── CardBody ─────────────────────────────────────────────────────────────────

/** Main content section of a Card. */
export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 px-[var(--space-5)] py-[var(--space-4)]', className)}
    {...props}
  />
));
CardBody.displayName = 'CardBody';

// ─── CardFooter ───────────────────────────────────────────────────────────────

/** Bottom section of a Card — typically holds actions or metadata. */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center p-[var(--space-5)] pt-0 gap-[var(--space-3)]',
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
