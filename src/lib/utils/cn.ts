/**
 * cn.ts — className merge utility.
 * Combines clsx (conditional class joining) and tailwind-merge (dedup Tailwind classes).
 * Use everywhere className props are composed.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
