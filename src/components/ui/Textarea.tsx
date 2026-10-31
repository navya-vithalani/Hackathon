/**
 * Textarea.tsx — Multi-line text input with label, hint, and error state.
 * API mirrors Input.tsx but renders a <textarea> element.
 * Vertically resizable by default. Rows defaults to 4.
 */

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label rendered above the textarea. */
  label?: string;
  /** Helper text shown below the textarea. Hidden when `error` is set. */
  hint?: string;
  /** Validation error message. Replaces hint and changes border to danger. */
  error?: string;
  /** Wrapping container className override. */
  containerClassName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Labelled multi-line textarea with optional hint and error messaging.
 * Passes all native `<textarea>` attributes through.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, hint, error, id, rows = 4, className, containerClassName, ...props },
    ref,
  ) => {
    const textareaId =
      id ?? (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={cn('flex flex-col gap-[var(--space-1)]', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
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

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
              ? `${textareaId}-hint`
              : undefined
          }
          aria-invalid={!!error}
          className={cn(
            'w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)]',
            'px-[var(--space-4)] py-[var(--space-3)]',
            'text-base text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)]',
            'resize-y transition-colors duration-[var(--duration-base)]',
            'border-[var(--color-border-strong)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent',
            error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />

        {error ? (
          <p
            id={`${textareaId}-error`}
            role="alert"
            className="text-sm text-[var(--color-danger)]"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${textareaId}-hint`}
            className="text-sm text-[var(--color-text-subtle)]"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
