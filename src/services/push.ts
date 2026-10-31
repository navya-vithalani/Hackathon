/**
 * push.ts — Web Push notification service stub.
 *
 * VAPID-based push for broadcasts and registration status changes.
 *
 * NOTE: Web Push is NOT part of Step 1. This file is a stub.
 * Implement fully in Step 13, after all core features are complete.
 *
 * Platform notes:
 *   - Android Chrome: works directly once the user grants permission.
 *   - Desktop Chrome/Edge: works directly.
 *   - iOS Safari: requires the app to be installed (Add to Home Screen) and
 *     iOS 16.4+. Show instructions via the useInstallPrompt hook before
 *     requesting push permission on iOS.
 *   - Firefox: supported but service worker syntax differs slightly.
 *
 * Architecture (Step 13):
 *   1. subscribeToPush() calls navigator.serviceWorker.ready, then
 *      registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })
 *   2. The resulting PushSubscription is POST-ed to /api/push/subscribe which
 *      stores it in a `push_subscriptions` Supabase table keyed by user_id.
 *   3. Server-side (Supabase Edge Function or route handler) calls web-push
 *      library with VAPID keys to send a notification payload.
 *   4. The service worker's 'push' event handler shows the notification.
 */

// ---------- Stub Service Functions ----------

/**
 * Requests push notification permission and stores the subscription
 * on the server for the currently authenticated user.
 *
 * Shows a browser permission prompt; if denied, logs a warning and returns.
 * On iOS, the app must be installed first — callers should gate this behind
 * `useInstallPrompt().isInstalled`.
 *
 * @returns Promise that resolves when the subscription is saved (or no-op if denied).
 *
 * TODO (Step 13): Implement with VAPID keys from NEXT_PUBLIC_VAPID_PUBLIC_KEY.
 */
export async function subscribeToPush(): Promise<void> {
  console.warn(
    '[push] subscribeToPush() is not yet implemented. ' +
      'Wire up Web Push in Step 13.'
  )
}

/**
 * Removes the push subscription from the server and unsubscribes the
 * service worker PushManager for the current user.
 *
 * Safe to call even when no subscription exists — treated as a no-op.
 *
 * @returns Promise that resolves when the unsubscription is complete.
 *
 * TODO (Step 13): DELETE the subscription row from Supabase and call
 *   registration.pushManager.getSubscription() then subscription.unsubscribe().
 */
export async function unsubscribeFromPush(): Promise<void> {
  console.warn(
    '[push] unsubscribeFromPush() is not yet implemented. ' +
      'Wire up Web Push in Step 13.'
  )
}

/**
 * Checks whether the current user has an active push subscription.
 *
 * Used by the Profile Settings screen to show the correct toggle state.
 *
 * @returns Always false in stub mode.
 *
 * TODO (Step 13): Query PushManager.getSubscription() and cross-check with DB.
 */
export async function isPushSubscribed(): Promise<boolean> {
  console.warn(
    '[push] isPushSubscribed() is not yet implemented. ' +
      'Wire up Web Push in Step 13.'
  )
  return false
}
