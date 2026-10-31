/**
 * src/lib/utils/formatting.ts — General-purpose string and number formatting utilities.
 * Used by event cards, profile displays, registration lists, and UI copy throughout the app.
 */

/**
 * Formats a monetary amount in Indian Rupees.
 * Returns "Free" for zero amounts.
 *
 * @example formatCurrency(500)  → "₹500"
 * @example formatCurrency(0)    → "Free"
 * @example formatCurrency(1500) → "₹1,500"
 */
export function formatCurrency(amount: number): string {
  if (amount === 0) return 'Free';
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Returns a count with the correct singular or plural noun.
 *
 * @example formatCount(1, 'participant', 'participants') → "1 participant"
 * @example formatCount(5, 'participant', 'participants') → "5 participants"
 * @example formatCount(0, 'result', 'results')           → "0 results"
 */
export function formatCount(n: number, singular: string, plural: string): string {
  return `${n.toLocaleString('en-IN')} ${n === 1 ? singular : plural}`;
}

/**
 * Truncates a string to `maxLen` characters and appends "…" if truncated.
 *
 * @example truncate("Hello world", 8) → "Hello wo…"
 * @example truncate("Hi", 10)         → "Hi"
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}

/**
 * Extracts initials from a full name (up to 2 characters).
 *
 * @example getInitials("Ananya Sharma")  → "AS"
 * @example getInitials("John")           → "J"
 * @example getInitials("  ")             → "?"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
