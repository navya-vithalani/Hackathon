/**
 * broadcasts.ts — Event broadcasts and Supabase Realtime subscription service.
 *
 * Handles fetching broadcast history and sending new messages.
 * The Realtime subscription returns an unsubscribe function so React hooks
 * can clean up on unmount.
 *
 * The ONLY layer that touches the `broadcasts` table.
 * Called from hooks/useBroadcasts.ts — never imported directly in components.
 *
 * Step 2: replace every stub body with a real Supabase query.
 * Step 9: implement subscribeToBroadcasts() using Supabase Realtime channels.
 */

import type { Broadcast, BroadcastAudience } from '@/types'

// ---------- Service Functions ----------

/**
 * Fetches the broadcast history for an event, ordered chronologically (oldest first).
 *
 * RLS ensures each user only receives broadcasts addressed to an audience
 * they belong to (everyone / participants / volunteers / organizing_team /
 * selected_people).
 *
 * @param eventId - The event UUID.
 * @returns Array of Broadcast objects, with author profile joined.
 */
export async function getBroadcasts(eventId: string): Promise<Broadcast[]> {
  void eventId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Sends a new broadcast message from the current user.
 *
 * When `audience` is `'selected_people'`, `audienceIds` must be provided and
 * contain at least one profile id. For all other audiences, `audienceIds` is
 * ignored.
 *
 * Requires the caller to be a volunteer, organizer, or owner of the event
 * (enforced by RLS).
 *
 * @param eventId    - The event UUID.
 * @param body       - The message text.
 * @param audience   - Who should receive this broadcast.
 * @param audienceIds - Profile ids for 'selected_people' audience only.
 * @returns The newly created Broadcast.
 */
export async function sendBroadcast(
  eventId: string,
  body: string,
  audience: BroadcastAudience,
  audienceIds?: string[]
): Promise<Broadcast> {
  void eventId
  void body
  void audience
  void audienceIds
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Subscribes to new broadcasts for an event via Supabase Realtime.
 *
 * The `onMessage` callback is invoked once for each new broadcast row
 * inserted while the subscription is active. RLS filters server-side
 * so the subscriber only receives messages intended for them.
 *
 * Returns an unsubscribe function — call it in useEffect cleanup:
 *   const unsub = subscribeToBroadcasts(eventId, handler)
 *   return () => unsub()
 *
 * @param eventId   - The event UUID to subscribe to.
 * @param onMessage - Callback invoked with each new Broadcast.
 * @returns A zero-argument function that removes the Realtime subscription.
 */
export function subscribeToBroadcasts(
  eventId: string,
  onMessage: (broadcast: Broadcast) => void
): () => void {
  void eventId
  void onMessage
  // Stub: returns a no-op unsubscribe function.
  console.warn(
    'subscribeToBroadcasts is not yet implemented — wire up Supabase Realtime in Step 9.'
  )
  return () => {
    /* no-op */
  }
}
