/**
 * src/lib/utils/date.ts — Date and time formatting utilities.
 * Used by event cards, registration lists, notification feeds, and schedule displays.
 * All functions accept ISO 8601 strings and return human-readable strings.
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDate(iso: string): Date {
  return new Date(iso);
}

// ─── Exported Utilities ───────────────────────────────────────────────────────

/**
 * Returns a short date string.
 * @example formatDate('2024-11-15T14:30:00Z') → "Nov 15, 2024"
 */
export function formatDate(iso: string): string {
  return toDate(iso).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns a date + time string.
 * @example formatDateTime('2024-11-15T14:30:00Z') → "Nov 15, 2024 at 2:30 PM"
 */
export function formatDateTime(iso: string): string {
  const d = toDate(iso);
  const datePart = d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart} at ${timePart}`;
}

/**
 * Returns a relative time string from now.
 * @example formatRelative('2024-11-13T14:30:00Z') → "2 hours ago" | "in 3 days"
 */
export function formatRelative(iso: string): string {
  const diffMs = toDate(iso).getTime() - Date.now();
  const absMs = Math.abs(diffMs);
  const past = diffMs < 0;

  const MINUTE = 60_000;
  const HOUR   = 60 * MINUTE;
  const DAY    = 24 * HOUR;
  const WEEK   = 7 * DAY;
  const MONTH  = 30 * DAY;

  let relative: string;

  if (absMs < MINUTE) {
    relative = 'just now';
    return relative;
  } else if (absMs < HOUR) {
    const n = Math.floor(absMs / MINUTE);
    relative = `${n} minute${n !== 1 ? 's' : ''}`;
  } else if (absMs < DAY) {
    const n = Math.floor(absMs / HOUR);
    relative = `${n} hour${n !== 1 ? 's' : ''}`;
  } else if (absMs < WEEK) {
    const n = Math.floor(absMs / DAY);
    relative = `${n} day${n !== 1 ? 's' : ''}`;
  } else if (absMs < MONTH) {
    const n = Math.floor(absMs / WEEK);
    relative = `${n} week${n !== 1 ? 's' : ''}`;
  } else {
    const n = Math.floor(absMs / MONTH);
    relative = `${n} month${n !== 1 ? 's' : ''}`;
  }

  return past ? `${relative} ago` : `in ${relative}`;
}

/**
 * Returns true if the date is in the future.
 */
export function isUpcoming(iso: string): boolean {
  return toDate(iso).getTime() > Date.now();
}

/**
 * Returns true if the date is in the past.
 */
export function isPast(iso: string): boolean {
  return toDate(iso).getTime() < Date.now();
}

/**
 * Returns a human-readable duration between two ISO date strings.
 * @example getDuration('2024-11-15T09:00:00Z', '2024-11-15T11:00:00Z') → "2 hours"
 * @example getDuration('2024-11-15T00:00:00Z', '2024-11-18T00:00:00Z') → "3 days"
 */
export function getDuration(start: string, end: string): string {
  const diffMs = toDate(end).getTime() - toDate(start).getTime();

  if (diffMs <= 0) return '0 minutes';

  const MINUTE = 60_000;
  const HOUR   = 60 * MINUTE;
  const DAY    = 24 * HOUR;

  if (diffMs < HOUR) {
    const n = Math.round(diffMs / MINUTE);
    return `${n} minute${n !== 1 ? 's' : ''}`;
  } else if (diffMs < DAY) {
    const n = Math.round(diffMs / HOUR);
    return `${n} hour${n !== 1 ? 's' : ''}`;
  } else {
    const n = Math.round(diffMs / DAY);
    return `${n} day${n !== 1 ? 's' : ''}`;
  }
}

/**
 * Returns a compact date range string.
 * Same day   → "Nov 15, 2024, 9:00 AM – 5:00 PM"
 * Same month → "Nov 15 – 17, 2024"
 * Cross-month → "Nov 28 – Dec 2, 2024"
 */
export function formatDateRange(start: string, end: string): string {
  const s = toDate(start);
  const e = toDate(end);

  const sameYear  = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();
  const sameDay   = sameMonth && s.getDate() === e.getDate();

  if (sameDay) {
    const date = s.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    const startTime = s.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    const endTime   = e.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${date}, ${startTime} – ${endTime}`;
  }

  if (sameMonth) {
    const month = s.toLocaleDateString('en-IN', { month: 'short' });
    const year  = s.getFullYear();
    return `${month} ${s.getDate()} – ${e.getDate()}, ${year}`;
  }

  const startStr = s.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const endStr   = e.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} – ${endStr}`;
}
