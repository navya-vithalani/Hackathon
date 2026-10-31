/**
 * Button.tsx — Base button component.
 * Presentational only. Variants: primary, secondary, ghost, danger, outline.
 * Sizes: sm, md, lg. States: loading (spinner), disabled.
 * Minimum 44px tap target enforced via min-h. Uses CSS variable-based styling only.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// ─── Variant Definitions ──────────────────────────────────────────────────────

const buttonVariants = cva(
  // Base styles
  [
    'relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)]',
    'font-semibold leading-none whitespace-nowrap select-none',
    'transition-colors duration-[var(--duration-base)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-dark)]',
        secondary:
          'bg-[var(--color-secondary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-secondary-light)]',
        ghost:
          'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-hover-overlay)]',
        danger:
          'bg-[var(--color-danger)] text-[var(--color-text-inverse)] hover:opacity-90',
        outline:
          'border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-hover-overlay)]',
      },
      size: {
        sm: 'min-h-[44px] h-9 px-3 text-sm',
        md: 'min-h-[44px] h-11 px-4 text-base',
        lg: 'min-h-[44px] h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows an animated spinner; keeps button text visible at reduced opacity. */
  loading?: boolean;
  /**
   * When true, renders as the child element instead of a <button>.
   * Useful for rendering a Next.js <Link> with button styles.
   * Child must accept className and other HTML attributes.
   */
  asChild?: boolean;
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="absolute animate-spin"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M16 9A7 7 0 0 0 9 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Base interactive button. Use `variant` to control visual weight and `size`
 * for tap target sizing. Pass `loading` to show a spinner while async work runs.
 * Pass `asChild` to delegate rendering to a child element (e.g. a Next.js Link).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled = false,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        { className: cn(classes, (children.props as React.HTMLAttributes<HTMLElement>).className) },
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Spinner />}
        <span className={cn('inline-flex items-center gap-2', loading && 'opacity-0')}>
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
