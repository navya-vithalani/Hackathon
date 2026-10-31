# hivai

hivai is a campus connection and events platform built with Next.js, TypeScript, and Tailwind CSS. Public event discovery uses sample events; account access is handled by Supabase Auth.

## Run locally

Use Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run the production checks with:

```bash
npm run lint
npm run build
npm run start
```

## Configure authentication

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL` (`http://localhost:3000` for local development). Apply the SQL files in `supabase/migrations/` to the Supabase project. In Supabase Auth URL Configuration, set the Site URL and add the exact callback URL to the redirect allowlist (`http://localhost:3000/auth/callback` locally). Add the equivalent callback URL for each deployed app origin; if you use `127.0.0.1` locally, allow that origin separately.

Signup supports both Supabase email-confirmation settings: with confirmation enabled, users verify through `/auth/callback`; with it disabled, they enter the app immediately. Login, sign-out, resend verification, and password reset use the same cookie-backed Supabase session. Without Supabase configuration, public discovery still works and protected app routes redirect to a clear setup message.

## Deploy to Vercel

1. Import the repository in Vercel and keep the repository root as the Root Directory.
2. Keep the default Next.js build settings (`npm run build`, with no custom output directory).
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL` in Project Settings → Environment Variables.
4. Add the deployed app origin and `/auth/callback` to the Supabase Auth redirect allowlist, then deploy.

## Preview scope

- `/` is the hivai landing page with organizer/student paths, a searchable event showcase, bookmarks, and keyboard `/` search; `/events` jumps to the public calendar.
- `/event/[slug]` shows a statically generated, share-metadata-ready public event page.
- `/login`, `/signup`, `/verify-email`, `/forgot-password`, and `/reset-password` provide account flows. `/app/*` is protected by the Supabase session proxy and server-side user checks.
- `/app/home`, `/app/my-events`, `/app/create`, `/app/campus`, and `/app/profile` are the five responsive app tabs. Inbox opens from the bell; event cards open a role-aware event workspace.
- The Home feed filters by type, online/in-person, cost, date range, and registration state. Campus ideas, inbox read-state, event drafts, and role previews are local demo interactions.
- Sample records live in `src/mocks/index.ts`; publish a record there to include it in the discovery page and generated routes.
- Saved events are stored in the visitor's browser. Event records, registration submission, app actions, and AI calls remain demo data/interactions.
- Theme tokens are in `src/styles/tokens.css`; the PWA manifest is `public/manifest.webmanifest`.