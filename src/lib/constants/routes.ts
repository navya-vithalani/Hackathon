/**
 * lib/constants/routes.ts — Centralised route path constants.
 *
 * Import from here whenever you need a path string in a link, redirect, or
 * middleware rule. Changing a URL requires editing only this file.
 *
 * Dynamic segments are expressed as functions so usage stays type-safe:
 *   ROUTES.EVENT(slug)  →  '/event/code-storm-2025'
 */

// ---------- Public / Marketing ----------

export const ROUTES = {
  // Marketing site
  HOME: '/',
  EVENTS_PUBLIC: '/events',
  EVENT_PUBLIC: (slug: string) => `/event/${slug}`,

  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify-email',
  ONBOARDING: '/onboarding',

  // App shell root
  APP: '/app',
  APP_HOME: '/app/home',
  APP_MY_EVENTS: '/app/my-events',
  APP_CREATE: '/app/create',
  APP_CREATE_CHAT: '/app/create/chat',
  APP_CAMPUS: '/app/campus',
  APP_CAMPUS_IDEAS: '/app/campus/ideas',
  APP_PROFILE: '/app/profile',
  APP_PROFILE_ID: '/app/profile/id',
  APP_INBOX: '/app/inbox',

  // Event workspace
  APP_EVENT: (slug: string) => `/app/event/${slug}`,
  APP_EVENT_REGISTER: (slug: string) => `/app/event/${slug}/register`,
  APP_EVENT_INTERVIEW: (slug: string) => `/app/event/${slug}/interview`,
  APP_EVENT_REGISTRATIONS: (slug: string) => `/app/event/${slug}/registrations`,
  APP_EVENT_TEAM: (slug: string) => `/app/event/${slug}/team`,
  APP_EVENT_CHECKIN: (slug: string) => `/app/event/${slug}/checkin`,

  // Dev-only
  STYLEGUIDE: '/styleguide',
} as const
