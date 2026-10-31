/**
 * registrations.ts — Registration service.
 *
 * Handles all registration lifecycle operations: form submission, status updates,
 * payment proof uploads, and check-in. The ONLY layer that touches the
 * `registrations` table.
 *
 * Called from hooks/useRegistration.ts and server actions.
 * Never imported directly in components.
 *
 * Step 2: replace every stub body with a real Supabase query.
 */

import type { Registration, RegistrationStatus, PaymentStatus } from '@/types'

// ---------- Service Functions ----------

/**
 * Retrieves a single registration for a specific (event, user) pair.
 *
 * Returns null if the user has not registered for this event, allowing
 * callers to show a "Register" CTA rather than an error.
 *
 * @param eventId - The event UUID.
 * @param userId  - The authenticated user's profile id.
 * @returns The registration or null.
 */
export async function getRegistration(
  eventId: string,
  userId: string
): Promise<Registration | null> {
  void eventId
  void userId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Returns all registrations for an event, ordered by submission time (ascending).
 *
 * Used on the organizer's Registrations dashboard. The AI screening result
 * is joined when present. Access is gated by RLS (organizer/owner only).
 *
 * @param eventId - The event UUID.
 * @returns Array of Registration objects (with joined profile and screening).
 */
export async function getEventRegistrations(
  eventId: string
): Promise<Registration[]> {
  void eventId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Submits a registration for the current user.
 *
 * Validates that:
 * - The event is published and not at capacity.
 * - The user has not already registered (unique constraint).
 * - Required form fields are present in `answers`.
 *
 * If `paymentProofFile` is provided, it is uploaded to the `payment-proofs`
 * storage bucket and the URL stored on the registration row.
 *
 * @param eventId          - The event UUID.
 * @param answers          - Map of FormField.id → answer value.
 * @param paymentProofFile - Optional payment screenshot (for paid events).
 * @returns The newly created Registration.
 */
export async function submitRegistration(
  eventId: string,
  answers: Record<string, unknown>,
  paymentProofFile?: File
): Promise<Registration> {
  void eventId
  void answers
  void paymentProofFile
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Updates the status of a registration (accepted / rejected / waitlisted).
 *
 * Called by organizers from the Registrations dashboard. Triggers a
 * notification to the applicant (in Step 9).
 *
 * @param id     - The registration UUID.
 * @param status - The new RegistrationStatus value.
 * @returns The updated Registration.
 */
export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus
): Promise<Registration> {
  void id
  void status
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Updates the payment verification status on a registration.
 *
 * Called by organizers after manually reviewing the uploaded payment screenshot.
 *
 * @param id     - The registration UUID.
 * @param status - The new PaymentStatus ('pending' | 'paid' | 'rejected').
 * @returns The updated Registration.
 */
export async function markPaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<Registration> {
  void id
  void status
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Marks a registration as checked in and records the check-in timestamp.
 *
 * Called by the check-in screen after QR scan verification. Idempotent —
 * calling it on an already-checked-in registration is a no-op (returns
 * the existing row).
 *
 * @param registrationId - The registration UUID.
 * @returns The updated Registration with checked_in_at set.
 */
export async function checkIn(registrationId: string): Promise<Registration> {
  void registrationId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Bulk-updates the status of multiple registrations in a single transaction.
 * Used by the "Accept all" / "Reject all" bulk actions on the dashboard.
 *
 * @param ids    - Array of registration UUIDs to update.
 * @param status - The RegistrationStatus to apply to all.
 * @returns Array of updated Registration objects.
 */
export async function bulkUpdateRegistrationStatus(
  ids: string[],
  status: RegistrationStatus
): Promise<Registration[]> {
  void ids
  void status
  throw new Error('Not implemented — wire up Supabase in Step 2')
}
