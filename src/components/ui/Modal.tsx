/**
 * Modal.tsx — Dialog overlay component.
 * Uses a fixed-positioned div with a backdrop for universal browser support.
 * Props: open, onClose, title, children.
 * Closes on backdrop click and Escape key. Traps scroll when open.
 * Focus is moved to the dialog on open.
 */

'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModalProps {
  /** Controls visibility. */
  open: boolean;
  /** Called when the user closes the dialog (backdrop click or Escape). */
  onClose: () => void;
  /** Dialog heading rendered in the header bar. */
  title?: string;
  /** Max-width variant for the dialog panel. */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Dialog body. */
  children?: React.ReactNode;
  /** Additional className for the panel itself. */
  className?: string;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  full: 'max-w-[95vw] max-h-[95dvh]',
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Accessible dialog overlay. Traps scroll, manages Escape handling,
 * and animates in/out via framer-motion. Content is passed as children.
 */
export function Modal({ open, onClose, title, size = 'md', children, className }: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll while open
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus the panel when it opens
  React.useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        // Backdrop
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-[var(--space-4)]"
          style={{ backgroundColor: 'rgba(76, 18, 17, 0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden="true"
        >
          {/* Panel — stop propagation so clicks inside don't close the modal */}
          <motion.div
            key="modal-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            tabIndex={-1}
            className={cn(
              'relative w-full rounded-[var(--radius-xl)] bg-[var(--color-surface)]',
              'shadow-[var(--shadow-lg)] outline-none',
              'flex flex-col overflow-hidden',
              sizeClasses[size],
              className,
            )}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-[var(--space-5)] py-[var(--space-4)] border-b border-[var(--color-border)]">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-[var(--color-text)]"
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="rounded-[var(--radius-md)] p-1 text-[var(--color-text-subtle)] hover:bg-[var(--color-hover-overlay)] hover:text-[var(--color-text)] transition-colors"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Close button without title */}
            {!title && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute top-3 right-3 z-10 rounded-[var(--radius-md)] p-1 text-[var(--color-text-subtle)] hover:bg-[var(--color-hover-overlay)] transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-[var(--space-5)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
