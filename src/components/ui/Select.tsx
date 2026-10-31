/**
 * Select.tsx — Native select wrapper with label, hint, and error state.
 * API and visual styling mirrors Input.tsx but wraps a <select> element.
 * Presentational only — controlled or uncontrolled.
 */

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Visible label rendered above the select. */
  label?: string;
  /** Helper text shown below the select. Hidden when `error` is set. */
  hint?: string;
  /** Validation error message. Replaces hint and changes border to danger. */
  error?: string;
  /** Options list as structured data (alternative to passing <option> children). */
  options?: SelectOption[];
  /** Wrapping container className override. */
  containerClassName?: string;
  /** Placeholder option shown when no value is selected. */
  placeholder?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Labelled select with optional hint and error messaging.
 * Pass `options` for a data-driven list, or children (<option> / <optgroup>) for full control.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      id,
      options,
      placeholder,
      className,
      containerClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const selectId =
      id ?? (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={cn('flex flex-col gap-[var(--space-1)]', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
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

        {/* Wrapper positions the chevron icon */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-describedby={
              error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            aria-invalid={!!error}
            className={cn(
              'w-full appearance-none rounded-[var(--radius-md)] border bg-[var(--color-surface)]',
              'px-[var(--space-4)] py-[var(--space-3)] pr-[var(--space-10)]',
              'text-base text-[var(--color-text)]',
              'transition-colors duration-[var(--duration-base)]',
              'border-[var(--color-border-strong)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent',
              error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Chevron indicator */}
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]"
            size={16}
          />
        </div>

        {error ? (
          <p
            id={`${selectId}-error`}
            role="alert"
            className="text-sm text-[var(--color-danger)]"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={`${selectId}-hint`} className="text-sm text-[var(--color-text-subtle)]">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
