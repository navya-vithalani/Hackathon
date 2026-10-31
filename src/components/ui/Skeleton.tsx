/**
 * Skeleton.tsx — Loading placeholder with shimmer animation.
 * Variants: text (pill shape, 1-line height), card (rectangle), avatar (circle).
 * Uses framer-motion for a smooth shimmer sweep across the cream/gold palette.
 */

'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// ─── Variant Definitions ──────────────────────────────────────────────────────

const skeletonVariants = cva('overflow-hidden relative', {
  variants: {
    variant: {
      text:   'h-4 w-full rounded-[var(--radius-pill)]',
      card:   'h-48 w-full rounded-[var(--radius-card)]',
      avatar: 'rounded-[var(--radius-pill)]',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    { variant: 'avatar', size: 'sm', className: 'w-6 h-6' },
    { variant: 'avatar', size: 'md', className: 'w-8 h-8' },
    { variant: 'avatar', size: 'lg', className: 'w-10 h-10' },
  ],
  defaultVariants: { variant: 'text', size: 'md' },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Width override — e.g. "60%" or "120px". Useful for text variant short lines. */
  width?: string;
  /** Height override — useful for custom card heights. */
  height?: string;
}

// ─── Shimmer overlay ─────────────────────────────────────────────────────────

const shimmerTransition = {
  duration: 1.4,
  repeat: Infinity,
  ease: 'linear' as const,
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Animated loading placeholder. Use `variant` to pick the shape and `width`/`height`
 * to size text lines or custom card heights.
 */
export function Skeleton({ variant, size, className, width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        skeletonVariants({ variant, size }),
        'bg-[var(--color-surface-alt)]',
        className,
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
      role="presentation"
      {...props}
    >
      {/* Shimmer sweep */}
      <motion.span
        className="absolute inset-0 block"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--color-accent-light) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          opacity: 0.5,
        }}
        animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
        transition={shimmerTransition}
      />
    </div>
  );
}

// ─── Convenience Compound ─────────────────────────────────────────────────────

/** Renders N stacked text skeleton lines of varying widths for a paragraph placeholder. */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  const widths = ['100%', '85%', '70%', '60%', '90%'];
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={widths[i % widths.length]} />
      ))}
    </div>
  );
}
