/**
 * src/lib/constants/limits.ts — Application-wide numeric limits and constraints.
 * Referenced by form validators, API handlers, and UI components for consistency.
 */

/** Maximum number of custom form fields per event registration form */
export const MAX_FORM_FIELDS = 20;

/** Maximum number of gallery images per event */
export const MAX_GALLERY_IMAGES = 10;

/** Maximum number of members (organizers + volunteers) in an event team */
export const MAX_TEAM_MEMBERS = 50;

/** Maximum number of AI screening questions per screened event */
export const MAX_SCREENING_QUESTIONS = 10;

/** Minimum number of AI screening questions — keeps interviews meaningful */
export const MIN_SCREENING_QUESTIONS = 3;

/** Maximum character length for a campus idea post */
export const MAX_IDEA_LENGTH = 1000;

/** Maximum character length for an event broadcast message */
export const MAX_BROADCAST_LENGTH = 2000;

/** Maximum file upload size in megabytes (applies to payment proofs, avatars, etc.) */
export const MAX_FILE_SIZE_MB = 5;

/** Pixel size for generated payment QR codes (square) */
export const QR_SIZE = 256;
