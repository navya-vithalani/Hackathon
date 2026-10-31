/**
 * profile.ts — User profile service.
 *
 * Reads and updates profile data from the `profiles` table.
 * Never returns raw auth tokens or auth.users columns directly.
 *
 * The ONLY layer that touches the `profiles` table and the `avatars`
 * storage bucket.
 * Called from hooks/useAuth.ts and hooks/useProfile.ts.
 * Never imported directly in components.
 *
 * Step 2: replace every stub body with a real Supabase query.
 */

import type { Profile } from '@/types'

// ---------- Service Functions ----------

/**
 * Fetches a profile by the user's auth UUID.
 *
 * Returns null when no profile row exists yet (e.g. during onboarding,
 * before the trigger has run or the user has completed setup).
 *
 * @param userId - The user's UUID from auth.users (= profiles.id).
 * @returns The Profile or null.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  void userId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Updates one or more profile fields for the authenticated user.
 *
 * Only the fields present in `data` are written. Partial update
 * is handled by Supabase's `.update()` with a `.eq('id', userId)` filter.
 * RLS ensures users can only update their own row.
 *
 * @param userId - The user's UUID.
 * @param data   - Partial Profile fields to overwrite.
 * @returns The full updated Profile.
 */
export async function updateProfile(
  userId: string,
  data: Partial<Omit<Profile, 'id' | 'created_at'>>
): Promise<Profile> {
  void userId
  void data
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Uploads an avatar image and updates the profile's avatar_url.
 *
 * Upload flow:
 *   1. Upload the file to the `avatars` storage bucket at path `{userId}/avatar`.
 *   2. Get the public URL from Supabase Storage.
 *   3. Update `profiles.avatar_url` to the new URL.
 *   4. Return the public URL so the UI can display it immediately.
 *
 * The previous avatar (if any) is overwritten because the path is deterministic.
 *
 * @param userId - The user's UUID (used as the storage path prefix).
 * @param file   - The image File selected by the user.
 * @returns The public URL of the uploaded avatar.
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  void userId
  void file
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Looks up a profile by the user's email address.
 *
 * Used in the team-member search flow when an organizer types an email.
 * The lookup is performed via a Supabase RPC that joins auth.users on
 * email (never exposed directly).
 *
 * @param email - The email address to search for.
 * @returns The matching Profile or null.
 */
export async function getProfileByEmail(
  email: string
): Promise<Profile | null> {
  void email
  throw new Error('Not implemented — wire up Supabase in Step 2')
}
