/**
 * src/lib/utils/slug.ts — URL slug generation and validation.
 * Used by the event creation flow and routing utilities.
 */

const SLUG_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Generates a URL-safe slug from a title string.
 * Converts to lowercase, replaces spaces/special chars with hyphens,
 * collapses consecutive hyphens, and appends a random 4-character suffix
 * to avoid collisions.
 *
 * @example generateSlug("My Awesome Hackathon!") → "my-awesome-hackathon-k3x9"
 */
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    // Replace anything that isn't alphanumeric or a space with a space
    .replace(/[^a-z0-9\s-]/g, ' ')
    // Collapse whitespace and hyphens into a single hyphen
    .trim()
    .replace(/[\s-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');

  const suffix = Array.from({ length: 4 }, () =>
    SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)]
  ).join('');

  return base ? `${base}-${suffix}` : suffix;
}

/**
 * Returns true if the string is a valid slug.
 * Valid slugs are lowercase alphanumeric with single hyphens between segments,
 * no leading or trailing hyphens.
 *
 * @example isValidSlug("my-event-k3x9") → true
 * @example isValidSlug("My Event")      → false
 */
export function isValidSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}
