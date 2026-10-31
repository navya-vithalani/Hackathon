# Testing checklist

## Local verification

The current local checks cover compilation, linting, and public-page rendering. They do not prove that the backend feature set or production RLS policies are complete.

- `npm run lint` passes.
- `npm run build` passes.
- The landing page, login page, public event page, and institution-search endpoint respond locally.
- `/api/ai/structure` validates malformed input and requires an authenticated user.
- `/api/ai/transcribe` requires an authenticated user; clip size and media type are checked server-side.
- The event studio now calls the AI structuring endpoint and can append a server transcription to typed notes.
- Live Gemini text structuring and audio transcription both succeeded with the configured model and generic test inputs. The audio test verified expected transcript keywords; no user or project data was sent.

## Backend verification limitations

The event, registration, campus, and inbox pages still use sample data or demo interactions. The SQL migrations do not yet match the schema and access rules in [Backend.md](../Backend.md), and the RLS check script currently performs only an events-read smoke check. It must not be treated as validation of the full policy set.

Applying or verifying migrations against Supabase requires the correct project schema and CLI/database credentials. Do not treat a successful local build as evidence that those remote flows work.

## Manual verification checklist

1. Confirm `.env.local` values match your Supabase and Gemini credentials.
2. Run `supabase link --project-ref <project-ref>` and `supabase db push`.
3. Sign up or log in, then open `/app/create`.
4. Enter an event title and notes; confirm the AI outline returns a summary and any missing-detail questions.
5. Record a short voice note, stop recording, and confirm the transcript is appended to the notes.
6. Confirm microphone denial, invalid credentials, and oversized audio retain a clear text-entry fallback.
7. Sign up with confirmation off and verify onboarding flow.
8. Confirm the institution search route returns educational results using Photon.
9. Complete a draft event flow and publish to an event page.
10. Register for a free and paid event, then verify the screening and status update flow.
11. Review organizer dashboard changes and notifications.
12. Check campus announcements, ideas, and read permissions.

## Notes

- Full server-side RLS and database behavior require migration fixes and verification against the intended Supabase schema.
- End-to-end AI routes and browser microphone capture still require a signed-in Supabase session. Gemini model text and audio inputs were tested directly; microphone permissions and an authenticated browser session were not.
