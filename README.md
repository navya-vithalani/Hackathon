# Evently

Evently is a campus events MVP preview built with Next.js, TypeScript, and Tailwind CSS. The public site and app shell run on sample data and do not require credentials.

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

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep **Next.js** as the framework preset and use the repository root as the Root Directory.
4. Keep the default build settings (`npm run build`, with no custom output directory).
5. Leave environment variables empty for this mock-data preview, then select **Deploy**.

The deployed preview does not use Supabase. To prepare for the separately wired live-data services, copy `.env.example` to `.env.local` locally and add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables. Live authentication, registrations, and AI event structuring still need their service integration before those values change the preview behavior.

## Preview scope

- `/` is the public landing page with organizer/student paths and a searchable event showcase; `/events` jumps to the public calendar.
- `/event/[slug]` shows a statically generated, share-metadata-ready public event page.
- `/app/home`, `/app/my-events`, `/app/create`, `/app/campus`, and `/app/profile` are the five responsive app tabs. Inbox opens from the bell; event cards open a role-aware event workspace.
- The Home feed filters by type, online/in-person, cost, date range, and registration state. Campus ideas, inbox read-state, event drafts, and role previews are local demo interactions.
- Sample records live in `src/mocks/index.ts`; publish a record there to include it in the discovery page and generated routes.
- Saved events are stored in the visitor's browser. Authentication, registration submission, persistence for app actions, live database data, and AI calls are not connected yet.
- Theme tokens are in `src/styles/tokens.css`; the PWA manifest is `public/manifest.webmanifest`.