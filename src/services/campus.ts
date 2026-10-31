/**
 * campus.ts — Campus feed service: announcements and anonymous ideas.
 *
 * All queries are scoped to the user's institution. The `author_id` on
 * idea rows is stored server-side for moderation but is NEVER returned
 * to clients — this is enforced by a Postgres view / RPC that strips it.
 *
 * The ONLY layer that touches `announcements`, `ideas`, `idea_votes`,
 * and `idea_reports` tables.
 * Called from hooks/useCampus.ts — never imported directly in components.
 *
 * Step 2:  wire up basic announcements and getIdeas.
 * Step 10: wire up createIdea, upvoteIdea, and reportIdea.
 */

import type { Announcement, Idea } from '@/types'

// ---------- Announcements ----------

/**
 * Fetches all announcements for the given institution, newest first.
 *
 * Only users with a matching institution_id in their profile will receive
 * results (enforced by RLS). The `author` profile is joined.
 *
 * @param institutionId - The institution UUID to fetch announcements for.
 * @returns Array of Announcement objects.
 */
export async function getAnnouncements(
  institutionId: string
): Promise<Announcement[]> {
  void institutionId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Creates a new announcement for an institution.
 *
 * Only staff accounts with a matching institution_id may post announcements
 * (enforced by RLS). The `author_id` is set from the authenticated session.
 *
 * @param institutionId - The institution UUID.
 * @param title         - Short headline for the announcement.
 * @param body          - Full announcement text.
 * @returns The newly created Announcement.
 */
export async function createAnnouncement(
  institutionId: string,
  title: string,
  body: string
): Promise<Announcement> {
  void institutionId
  void title
  void body
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

// ---------- Ideas ----------

/**
 * Fetches all visible ideas for the given institution, sorted by upvote_count
 * descending then by created_at descending.
 *
 * Hidden ideas (moderated) are excluded. The `author_id` is never included
 * in the returned rows — anonymity is enforced at the database level via a
 * view or RPC that strips that column.
 *
 * @param institutionId - The institution UUID.
 * @returns Array of Idea objects (without author_id).
 */
export async function getIdeas(institutionId: string): Promise<Idea[]> {
  void institutionId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Creates a new anonymous idea for an institution.
 *
 * The `author_id` is set server-side from the authenticated session but is
 * not returned in the response. This function must be called from a server
 * action (not a client-side fetch) so the user id never passes through
 * client code.
 *
 * @param institutionId - The institution UUID.
 * @param body          - The idea text.
 * @returns The newly created Idea (without author_id).
 */
export async function createIdea(
  institutionId: string,
  body: string
): Promise<Idea> {
  void institutionId
  void body
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Toggles an upvote on an idea for the current user.
 *
 * Uses an `idea_votes` table to prevent duplicate votes. If the user has
 * already upvoted, this call removes the vote (toggle behaviour).
 * The `upvote_count` column on `ideas` is kept in sync by a Postgres trigger.
 *
 * @param ideaId - The idea UUID.
 */
export async function upvoteIdea(ideaId: string): Promise<void> {
  void ideaId
  throw new Error('Not implemented — wire up Supabase in Step 2')
}

/**
 * Reports an idea for moderation.
 *
 * Inserts a row into `idea_reports`. Multiple reports from different users are
 * allowed; duplicate reports from the same user are silently ignored.
 * Moderator review is out of scope for MVP — reports are read manually via
 * the Supabase dashboard.
 *
 * @param ideaId - The idea UUID.
 * @param reason - Free-text explanation of why the idea is being reported.
 */
export async function reportIdea(
  ideaId: string,
  reason: string
): Promise<void> {
  void ideaId
  void reason
  throw new Error('Not implemented — wire up Supabase in Step 2')
}
