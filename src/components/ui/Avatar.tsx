/**
 * Avatar.tsx — User avatar with fallback initials.
 * Sizes: sm (24px), md (32px), lg (40px), xl (64px).
 * Shows image if src provided, else a colored circle with derived initials.
 * Fallback uses maroon background with cream text.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// ─── Variant Definitions ──────────────────────────────────────────────────────

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-pill)] select-none font-semibold',
  {
    variants: {
      size: {
        sm: 'w-6 h-6 text-[10px]',
        md: 'w-8 h-8 text-xs',
        lg: 'w-10 h-10 text-sm',
        xl: 'w-16 h-16 text-xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract up to 2 uppercase initials from a display name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  /** Image URL — renders an <img> when provided. */
  src?: string;
  /** User display name — used for alt text and initial generation. */
  name?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Circular user avatar. Shows a photo when `src` is supplied,
 * otherwise renders the user's initials on a maroon background.
 */
export function Avatar({ src, name = '', size, className, ...props }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <span
      className={cn(avatarVariants({ size }), className)}
      title={name || undefined}
      aria-label={name || 'User avatar'}
      {...props}
    >
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span
          className="flex w-full h-full items-center justify-center bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)]"
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </span>
  );
}
