/**
 * Input.tsx — Text input with label, hint text, and error state.
 * Presentational only — works as controlled (value + onChange) or uncontrolled.
 * Label renders above the input. Error message renders below in danger color.
 * Hint text renders below in muted color (hidden when error is present).
 * Focus ring uses --color-focus-ring.
 */

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible label rendered above the input. */
  label?: string;
  /** Helper text shown below the input. Hidden when `error` is set. */
  hint?: string;
  /** Validation error message. Replaces hint and changes border to danger. */
  error?: string;
  /** Wrapping container className override. */
  containerClassName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Labelled text input with optional hint and error messaging.
 * Passes all native `<input>` attributes through.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className, containerClassName, ...props }, ref) => {
    // Generate a stable id from label when none is provided
    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={cn('flex flex-col gap-[var(--space-1)]', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[var(--color-text)]"
          >
            {label}
            {props.required && (
              <span aria-hidden="true" className="ml-1 text-[var(--color-danger)]">
                *
              </span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          aria-invalid={!!error}
          className={cn(
            // Base
            'w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)]',
            'text-base text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)]',
            'transition-colors duration-[var(--duration-base)]',
            // Default border
            'border-[var(--color-border-strong)]',
            // Focus
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent',
            // Error state border override
            error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
            // Disabled
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />

        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-sm text-[var(--color-danger)]"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${inputId}-hint`}
            className="text-sm text-[var(--color-text-subtle)]"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
