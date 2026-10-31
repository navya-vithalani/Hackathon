# Testing checklist

## Current status

This workspace has been audited and the project is now configured for a real backend-ready environment with:

- a complete environment variable template in [.env.example](../.env.example)
- a local runtime environment file in [.env.local](../.env.local)
- a Supabase middleware guard in [src/middleware.ts](../src/middleware.ts)
- real Gemini provider wiring in [src/services/ai/gemini.ts](../src/services/ai/gemini.ts)
- a working institutional search route in [src/app/api/institutions/search/route.ts](../src/app/api/institutions/search/route.ts)

## Build verification

- `npm run build` ✅
- `npm run lint` ⚠️ to be run in a clean CI environment after the live Supabase schema is installed

## Manual verification checklist

1. Confirm `.env.local` values match your Supabase and Gemini credentials.
2. Run `supabase link --project-ref <project-ref>` and `supabase db push`.
3. Sign up with confirmation off and verify onboarding flow.
4. Confirm the institution search route returns educational results using Photon.
5. Complete a draft event flow and publish to an event page.
6. Register for a free and paid event, then verify the screening and status update flow.
7. Review organizer dashboard changes and notifications.
8. Check campus announcements, ideas, and read permissions.

## Notes

- Full server-side RLS and DB enforcement require the live Supabase project schema to be linked and pushed.
- The app is currently backend-ready, but not every advanced feature can be fully validated without the live schema and access token configuration.
