# PRD: Student Events Platform (working name: TBD)

> **Audience for this doc:** the AI coding agent that will build the MVP.
> **Build window:** ~10 hours (hackathon). Prioritize a complete, demoable loop over breadth.
> **Read Section 3 (Engineering Rules) before writing any code. Those rules are mandatory.**

---

## 1. Vision

A single place where students (middle school through college) can **create, discover, register for, run, and manage** events, from a school sports day to a college hackathon to an inter-school MUN.

Today, student organizers juggle Google Forms, WhatsApp groups, spreadsheets, and payment screenshots. We replace all of that with one app that:

- **Verifies where you study** (so schools are real and consistent).
- **Shows only events you're eligible for** (open, institution-only, grade-limited).
- **Uses AI to remove organizer grunt work:** structuring an event from a messy voice dump, and pre-screening hundreds of applicants through short AI interviews.
- **Gives each person the right access per event** (participant here, volunteer there, organizer elsewhere).
- **Keeps an institution's community together** (Campus tab, anonymous ideas to staff).

**Demo-day story (the loop that must work end to end):**
Organizer creates event (voice dump, AI structures it) → event page goes live → student registers → AI screening interview → organizer sees ranked candidates with summaries → organizer accepts → student sees status and QR ticket → volunteer scans QR at check-in.

---

## 2. Users and Roles

### Account types (chosen at signup)
| Type | Description |
|---|---|
| **Student** | Middle school to college. Has institution, grade, stream. |
| **Staff** | Teacher/advisor/faculty. Has institution, designation. Self-declared in MVP (verification is roadmap). Can post to Campus feed and be an event advisor. |

### Per-event roles (stored per event, not per user)
| Action | Participant | Volunteer | Organizer | Owner |
|---|---|---|---|---|
| View event | ✓ | ✓ | ✓ | ✓ |
| Read event chat/broadcasts (if in audience) | ✓ | ✓ | ✓ | ✓ |
| Check in attendees (scan QR) | | ✓ | ✓ | ✓ |
| Post broadcasts | | ✓ (to participants only) | ✓ | ✓ |
| View registrations and AI screening results | | | ✓ | ✓ |
| Edit event, accept/reject applicants | | | ✓ | ✓ |
| Manage team roles, delete event | | | | ✓ |

The same user can hold different roles in different events. All access checks are enforced by **Supabase Row Level Security**, not only in the UI.

---

## 3. Engineering Rules (MANDATORY)

These rules exist so the UI can be restyled or rebuilt later without breaking functionality.

### 3.1 Separation of concerns
- **UI and logic live in separate files.**
  - UI components are *presentational*: they receive data and callbacks via props, render markup, and contain no data fetching, no Supabase calls, no business logic.
  - Logic lives in **hooks** (`/hooks`), **services** (`/services`), and **server actions / route handlers**.
  - Changing a component's look must never require touching a service, and changing a service must never require touching JSX layout.
- **Pattern:** `page.tsx` (thin) → calls a **hook** (data + actions) → passes results into **UI components** (pure rendering).
- Services are the only layer that talks to Supabase, the AI provider, or external APIs.

### 3.2 No hardcoded design values
- **No hex/rgb colors, font names, pixel spacings, radii, or shadows anywhere in components.**
- All design values are **CSS variables (design tokens)** defined in one file: `src/styles/tokens.css`.
- Tailwind is configured to read those variables (`tailwind.config.ts` maps theme colors/fonts/spacing/radius to `var(--...)`). Components use semantic Tailwind classes (`bg-surface`, `text-primary`, `rounded-card`), never raw values.
- Changing the entire look = editing `tokens.css` only.
- Use **semantic token names** (`--color-bg`, `--color-accent`), not literal ones (`--color-yellow`). Keep the raw palette in a separate "palette" layer and map semantic tokens to it.

### 3.3 Modularity and readability
- Small files, one responsibility each. Prefer many small modules to a few large ones.
- **Comment generously.** Every file starts with a header comment (what it is, who uses it). Every exported function/component has a doc comment (purpose, params, returns). Add section dividers (`// ---------- Section ----------`) inside longer files.
- Use TypeScript everywhere. Shared types live in `/types`.
- Centralize constants (routes, role names, event types, limits) in `/lib/constants`.
- The AI provider sits behind **one interface** (`ai.generate()` / `ai.transcribe()`), so the model can be swapped without touching feature code.

### 3.4 Database
- Database schema lives in a dedicated **`/supabase`** folder with **versioned SQL migrations from day one** (see Section 8). No schema changes made by hand in the dashboard.
- RLS policies are written in migrations alongside the tables they protect.

### 3.5 Secrets and config
- All keys in `.env.local` (and Vercel env vars). Commit a `.env.example` with every variable name and a comment. Never hardcode keys.

---

## 4. Design System

### 4.1 Palette (provided; sampled from the supplied image)
| Raw name | Hex | Suggested semantic role |
|---|---|---|
| Cream | `#FAF4B6` | Page background / light surfaces |
| Gold | `#D2A24E` | Accent / primary action / highlights |
| Brick | `#8E3330` | Secondary / emphasis / destructive-leaning accents |
| Maroon | `#4C1211` | Primary text / dark surfaces / nav |

**Layered token approach** (in `tokens.css`):
1. **Palette layer:** raw colors (`--palette-cream`, `--palette-gold`, `--palette-brick`, `--palette-maroon`).
2. **Semantic layer:** `--color-bg`, `--color-surface`, `--color-surface-alt`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-accent-contrast`, `--color-secondary`, `--color-danger`, `--color-success`, `--color-border`, `--color-focus-ring`. These reference the palette layer.
3. Components only use the semantic layer.

The agent must check **text/background contrast** (aim for WCAG AA). If a pairing fails (e.g., gold text on cream), choose another semantic pairing and add small derived tints (e.g., lighter/darker shades) to the palette layer rather than hardcoding.

**Dark mode:** optional. Structure tokens so a `[data-theme="dark"]` override block is easy to add later (maroon as background, cream as text). Not required for MVP.

### 4.2 Tokens file must define
- **Colors** (above)
- **Typography:** `--font-heading`, `--font-body`, `--font-mono`; font sizes scale (`--text-xs` ... `--text-4xl`); weights; line heights. Fonts loaded via `next/font` and wired to those variables. Pick a distinctive heading font and a clean readable body font; keep both easy to swap in one place.
- **Spacing scale:** `--space-1` ... `--space-12`
- **Radii:** `--radius-sm/md/lg/card/pill`
- **Shadows:** `--shadow-sm/md/lg`
- **Layout:** `--nav-height`, `--sidebar-width`, `--content-max-width`
- **Motion:** `--duration-fast/base/slow`, `--ease-standard`
- **Z-index scale**

### 4.3 Look and feel
Warm, energetic, youthful but credible. Cream backgrounds, gold accents, deep maroon text. Rounded cards, generous spacing, large tap targets (min 44px) for mobile. The marketing site can be bolder and more animated; the app should be calm, fast, and scannable.

---

## 5. Information Architecture

### 5.1 App navigation
**Mobile:** bottom tab bar. **Laptop (`md` and up):** left sidebar. Same destinations, one codebase. The shell component swaps layout via the breakpoint.

| # | Tab | Purpose |
|---|---|---|
| 1 | **Home** | Eligible-events feed. Search + filters (type, online/offline, free/paid, date, "Registered"). Bell icon (top right) opens Inbox. |
| 2 | **My Events** | Grouped: Participating, Organizing, Volunteering. Each opens that event's workspace. |
| 3 | **Create** | Quick form → AI chat (voice or text) → review → publish. |
| 4 | **Campus** | Institution-only space: events at my institution, staff announcements, anonymous ideas. |
| 5 | **Profile** | Details, account type, digital ID (QR), settings, install-app prompt. |

**Inbox** (bell icon, not a tab): registration status updates, screening results, announcements, event broadcasts addressed to me.

### 5.2 Event workspace (per-event tabs; visible tabs depend on role)
**Overview · Chat/Broadcast · People · Registrations (organizer+) · Check-in (volunteer+) · Settings (owner)**

### 5.3 Route map
```
Public (marketing)
/                       Landing page
/events                 Public events listing (open events)
/event/[slug]           Public event page (details, register CTA)

Auth
/login   /signup   /verify-email   /onboarding

App (authenticated, wrapped in app shell)
/app                    -> redirects to /app/home
/app/home
/app/my-events
/app/create             (+ /app/create/chat)
/app/campus             (+ /app/campus/ideas)
/app/profile            (+ /app/profile/id)
/app/inbox
/app/event/[slug]       Event workspace (role-aware)
/app/event/[slug]/register
/app/event/[slug]/interview
/app/event/[slug]/registrations
/app/event/[slug]/team
/app/event/[slug]/checkin
```
(The agent may refine route names, but must keep marketing and app clearly separated using route groups: `(marketing)` and `(app)`.)

---

## 6. Features and Requirements

Priority legend: **P0** = must ship in MVP, **P1** = ship if time allows, **P2** = roadmap.

### 6.1 Auth, onboarding, profile
- **P0** Email + password signup/login with **email verification** (Supabase Auth).
- **P0** Onboarding: choose **Student or Staff** → pick **institution** → grade/year + stream (students) or designation (staff).
- **P0** **Institution picker with verification:** Google Places Autocomplete, restricted to educational institutions; store the `place_id` as the canonical ID so the same school always maps to the same record and typos/fake names are impossible. A `institutions` table caches name, address, `place_id`.
  - **Fallback if Places billing isn't available:** Photon (OpenStreetMap) autocomplete storing the OSM ID, plus an "Add my institution" manual option flagged `unverified`. Put the provider behind `services/institutions.ts` so it's swappable.
- **P0** Profile page with editable details.
- **P1** **Digital ID:** a card with name, institution, grade, and a QR code of the user ID. Used at check-in. Static/printable is fine.

### 6.2 Home feed and eligibility
- **P0** Feed shows only events the user is **eligible** for. Event eligibility rules: `open to all` / `my institution only` / `specific institutions` / `grade range` / `account type`. Enforced in the SQL query/RLS, not only in the UI.
- **P0** Filters: type (sports, hackathon, MUN, cultural, workshop, other), online/offline, free/paid, date range, "Registered".
- **P0** Event card: cover image, title, date, mode, price badge, institution, "Open/Closing soon".

### 6.3 Event creation (organizer)
Flow: **Quick form → AI chat → Review → Publish**
1. **P0 Quick form:** name, date/time, online/offline, venue/link, cost (free or amount + payment QR image), registration type (**direct** or **with selection/screening**), eligibility filters (open / my institution / grades / etc.), capacity (optional).
2. **P0 AI chat (event structuring):** the organizer dumps everything about the event (typed or **voice**). The AI organizes it into a structured event (description, schedule, rules, prizes, FAQs, contacts) and returns a list of **open questions / things still needed to plan well**. The organizer answers; the AI updates the structure. Loop until the organizer is happy.
3. **P0 Review + Publish:** preview the event page; on publish create the event and generate a unique `slug` → `/event/[slug]`.
4. **P0 Event page management:** owner can upload cover/gallery images, edit all details, and configure the registration form.
5. **P0 Registration form builder:** organizer adds fields (short text, long text, number, dropdown, checkbox, file upload optional) with required toggles. Stored as `form_fields` rows.

### 6.4 Registration
- **P0** Student opens the event, fills the organizer-defined form, and submits. Duplicate registrations blocked.
- **P0 Paid events (manual, MVP):** show organizer's payment QR; student uploads a payment screenshot; organizer marks **Paid / Not paid** manually.
- **P0** Status flow: `submitted → (screening) → accepted | rejected | waitlisted → checked_in`.
- **P0** Student sees status in My Events and Inbox.
- **P1** Ticket view with QR (uses the digital ID QR or a per-registration QR).

### 6.5 AI screening interview (the "wow" feature)
- **P0** If the event is marked "with selection", after the form the student is taken to a **chat/voice interview**.
- Organizer provides **screening criteria** in the event setup (what they're looking for, number of questions, difficulty/tone).
- The AI conducts a short interview (default 4-6 questions) adapted to the criteria and the student's form answers, then produces: **transcript, score (0-100), strengths, concerns, one-paragraph summary, recommendation**.
- **P0** Organizer dashboard (`/registrations`): a **ranked table** of applicants with score, summary, and the ability to open the transcript and **accept / reject / waitlist** individually or in bulk.
- **Guardrails:** AI output is advisory; the human organizer decides. The student is told it's an AI interview before starting. Keep prompts stored as files in `/prompts` (see Section 9).

### 6.6 Event team and roles
- **P0** Owner can add other profiles (search by name/email) to the event as **Organizer** or **Volunteer**; change or remove roles.
- **P0** Role-gated UI and RLS as per the permission table in Section 2.
- **P1** Advisor badge for Staff accounts added to an event.

### 6.7 Event chat / broadcasts (per event)
- **P0** Organizers/volunteers can post a message choosing an **audience**: `everyone | participants | volunteers | organizing_team | selected_people`.
- **P0** Messages are stored in Postgres and delivered live via **Supabase Realtime**. Messages a user is not in the audience for are blocked at the RLS level.
- **P0 Offline behavior:** the service worker caches recently read messages (readable offline); unsent messages are **queued locally and sent on reconnect**.
- **P1** Push notifications for new broadcasts (see 6.10).
- **P2 / Out of scope:** Bluetooth/mesh broadcast (not possible in a PWA; roadmap item for a native app).

### 6.8 Campus tab (institution-scoped)
- **P0** Shows events hosted at/for the user's institution and **staff announcements**.
- **P1 Anonymous ideas:** any member of the institution can post an idea/suggestion anonymously. The `author_id` is stored server-side but **never returned to clients**; used only for moderation. Features: upvote, staff reply, status (New / Under review / Done), **report button**, staff can hide abusive posts. Scoped to users with the same institution.

### 6.9 Check-in
- **P1** Volunteer/organizer opens the Check-in screen, scans an attendee's QR (camera via browser), and the registration is marked `checked_in`. Shows attendee name and status; handles duplicates and invalid codes.

### 6.10 PWA and notifications
- **P0** Installable PWA: web manifest, icons, service worker, install prompt, works on Android Chrome and iOS Safari (Add to Home Screen) and on desktop. Details in Section 7 (first step).
- **P1** Offline shell (app loads offline with cached last-seen data).
- **P1 (build last)** Web Push (VAPID) for broadcasts and status changes. Android Chrome works directly; iOS only after the app is installed to the home screen.

### 6.11 Voice input
- **P0** Voice-to-text for (a) event info-dump and (b) the screening interview answers.
- Implementation: a `useVoiceInput` hook that records audio and sends it to `ai.transcribe()` (Gemini audio transcription) for reliability, with the browser **Web Speech API** as a live-preview/fallback where supported (works on Chrome/Android; unreliable on Safari; absent on Firefox). Always keep a text-input fallback.

### 6.12 Marketing website
- **P0** Landing page: hero with scroll-triggered animation (Framer Motion), "how it works" (organizers / students), a showcase of public open events, CTA to sign up/open the app.
- **P1** Lightweight 3D element (e.g., a single React Three Fiber / CSS 3D scene). Do **not** let this consume core-build time.
- **P0** Public event pages (`/event/[slug]`) are SEO-friendly (server-rendered) with Open Graph tags so shared links look good.

---

## 7. STEP 1: Foundation (Folder Structure + UI Skeleton + PWA)

**Goal of Step 1:** produce a running project where we can *see* the whole product shell: the marketing site and the app (all five tabs, the Inbox, and an event workspace), responsive on mobile and laptop, installable as a PWA, deployable on Vercel, fully themed through tokens. **No real features yet**; screens use **mock/static data** from a single `mocks` module so the UI can be reviewed before wiring.

### 7.1 Deliverables checklist
- [ ] Next.js (App Router) + TypeScript + Tailwind + shadcn/ui project initialized
- [ ] `src/styles/tokens.css` with all tokens from Section 4 (palette + semantic layers), wired into Tailwind
- [ ] Fonts loaded via `next/font`, bound to `--font-heading/body/mono`
- [ ] Folder structure as in 7.2 created, with placeholder files containing header comments
- [ ] **Marketing site** (landing page + public events listing + public event page skeleton) using mock data
- [ ] **App shell**: bottom nav (mobile) ↔ sidebar (laptop), top bar with bell icon
- [ ] **All screens as UI skeletons**: Home, My Events, Create (form + chat shell), Campus (+ ideas list), Profile (+ ID card), Inbox, Event workspace (role-aware tabs), Registration form, Interview chat shell, Registrations table, Team, Check-in
- [ ] Auth screens (login, signup, verify-email, onboarding) as UI only
- [ ] PWA: manifest, icons, service worker, install prompt component, offline fallback page
- [ ] `/supabase` folder with config and migrations (Section 8)
- [ ] `.env.example`, `README.md` (how to run, folder map, how to change theme)
- [ ] App runs locally and deploys to Vercel with a working installable PWA

### 7.2 Folder structure
```
/
├─ public/
│  ├─ manifest.webmanifest            # PWA manifest (name, colors from tokens' values, icons)
│  ├─ icons/                          # icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png, favicon
│  ├─ offline.html                    # fallback when offline and not cached
│  └─ sw.js (generated)               # service worker output (if using Serwist)
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/                 # public site (own layout, no app shell)
│  │  │  ├─ page.tsx                  # landing
│  │  │  ├─ events/page.tsx           # public open-events list
│  │  │  └─ event/[slug]/page.tsx     # public event page
│  │  ├─ (auth)/                      # login, signup, verify-email, onboarding
│  │  ├─ (app)/                       # authenticated app (wrapped in AppShell)
│  │  │  ├─ layout.tsx                # mounts AppShell
│  │  │  └─ app/
│  │  │     ├─ home/page.tsx
│  │  │     ├─ my-events/page.tsx
│  │  │     ├─ create/page.tsx
│  │  │     ├─ campus/page.tsx
│  │  │     ├─ profile/page.tsx
│  │  │     ├─ inbox/page.tsx
│  │  │     └─ event/[slug]/...       # workspace + sub-routes
│  │  ├─ api/                         # route handlers (AI, push, etc.). Thin; call services
│  │  ├─ layout.tsx                   # root layout: fonts, tokens, manifest link, SW registration
│  │  └─ globals.css                  # imports tokens.css + tailwind layers only
│  ├─ components/
│  │  ├─ ui/                          # base primitives (Button, Card, Input, Badge, Tabs...) tokens-only styling
│  │  ├─ layout/                      # AppShell, BottomNav, Sidebar, TopBar, MarketingNav, Footer
│  │  ├─ marketing/                   # Hero, HowItWorks, EventShowcase...
│  │  ├─ events/                      # EventCard, EventFilters, EventDetailView, RoleTabs...
│  │  ├─ forms/                       # FormFieldRenderer, FormBuilderUI...
│  │  ├─ chat/                        # ChatWindow, MessageBubble, VoiceButton (presentational)
│  │  ├─ campus/                      # IdeaCard, AnnouncementCard...
│  │  ├─ profile/                     # IdCard, ProfileForm...
│  │  └─ pwa/                         # InstallPrompt, OfflineBanner
│  ├─ hooks/                          # logic: useEvents, useAuth, useRole, useVoiceInput, useChat, useInstallPrompt...
│  ├─ services/                       # ONLY layer that talks to Supabase / AI / Places
│  │  ├─ supabase/                    # client.ts (browser), server.ts (server), middleware helper
│  │  ├─ ai/                          # index.ts (provider interface), gemini.ts, prompts loader
│  │  ├─ events.ts  registrations.ts  institutions.ts  team.ts  broadcasts.ts  campus.ts  profile.ts
│  ├─ lib/
│  │  ├─ constants/                   # routes.ts, roles.ts, eventTypes.ts, limits.ts
│  │  ├─ utils/                       # date, slug, formatting, cn() helper
│  │  └─ permissions.ts               # pure functions: can(role, action)
│  ├─ types/                          # shared TS types (Event, Profile, Registration, Role...)
│  ├─ mocks/                          # mock data used ONLY during Step 1 UI skeleton phase
│  ├─ prompts/                        # AI prompt templates as .md/.ts files (structuring, screening, summarizing)
│  └─ styles/
│     └─ tokens.css                   # ALL design tokens (single source of truth)
├─ supabase/                          # see Section 8
├─ tailwind.config.ts                 # maps theme -> CSS variables from tokens.css
├─ next.config.ts                     # PWA/service-worker config
├─ .env.example
└─ README.md
```

### 7.3 PWA requirements (Vercel-compatible)
- Add a **Web App Manifest** (`/manifest.webmanifest`) with: `name`, `short_name`, `description`, `start_url: "/app/home"`, `scope: "/"`, `display: "standalone"`, `orientation: "portrait-primary"`, `theme_color` and `background_color` (use palette values, documented in README as needing to stay in sync with tokens), and icons.
- **Icons (generate PNGs):** 192x192, 512x512, a **maskable** 512x512 (safe-zone padding), `apple-touch-icon` 180x180, favicon. Use a simple placeholder logo mark (e.g., monogram on gold/maroon) that's easy to replace. Keep source SVG in `/public/icons/source.svg`.
- **Service worker:** use **Serwist** (`@serwist/next`) or an equivalent maintained Next.js PWA integration. It must work on Vercel's build. Cache app shell and static assets, runtime-cache images and GET API reads (stale-while-revalidate), and show `/offline.html` as a navigation fallback. Disable the SW in development to avoid caching headaches.
- **Install prompt:** `InstallPrompt` component listening for `beforeinstallprompt` (Android/desktop) with a custom "Install app" button (in Profile and optionally a dismissible banner); on iOS show brief "Share → Add to Home Screen" instructions.
- Add `<meta name="theme-color">`, `viewport` with `viewport-fit=cover`, and iOS standalone meta tags. Respect safe-area insets (`env(safe-area-inset-*)`) for the bottom nav.
- Verify with Lighthouse PWA checks and by installing on an Android device/Chrome desktop.
- **Push notifications are NOT part of Step 1.** Leave a stub `services/push.ts` and note in README.

### 7.4 UI skeleton requirements
- **Responsive:** mobile-first. Bottom nav below `md`, sidebar at `md+`. Cards reflow in a grid (1 col → 2 → 3). Test at 360px, 768px, 1280px.
- Every screen renders from **mock data** (`/mocks`) through the same presentational components that will later receive real data. The swap from mock → real must only change the hook, not the component.
- Include **empty, loading (skeleton), and error states** for list screens as presentational components.
- Include the **role switcher mock** in the event workspace (a dev-only toggle to preview participant / volunteer / organizer / owner views).
- Include a **dev-only `/styleguide` page** showing all tokens (colors, fonts, spacing, radii) and base components, so theme changes can be reviewed in one place.

### 7.5 Definition of done for Step 1
1. `npm run dev` shows marketing site and app skeleton; every nav destination works.
2. Editing a color or font in `tokens.css` visibly changes the entire app, and a code search for `#` hex values or font names outside `tokens.css`/manifest/README finds nothing.
3. No component file imports from `services/` or the Supabase client (verifiable by search).
4. The app deploys to Vercel and is **installable** on Android Chrome and desktop Chrome; Lighthouse PWA/installability passes; offline fallback appears when offline.
5. `/supabase/migrations` contains the initial schema (Section 8) and applies cleanly to a fresh Supabase project.
6. README documents: setup, env vars, folder map, how to change theme, how to add a screen following the UI/logic pattern.

---

## 8. Data Model and Supabase Setup

### 8.1 Folder
```
/supabase
├─ config.toml
├─ migrations/
│  ├─ 0001_extensions_and_enums.sql
│  ├─ 0002_profiles_institutions.sql
│  ├─ 0003_events_and_members.sql
│  ├─ 0004_forms_registrations.sql
│  ├─ 0005_screenings.sql
│  ├─ 0006_broadcasts_announcements.sql
│  ├─ 0007_campus_ideas.sql
│  └─ 0008_rls_policies.sql
├─ seed.sql                           # realistic demo data (events, users, applicants)
└─ README.md                          # how to run migrations (Supabase CLI), how to reset
```
Each migration file begins with a comment explaining its purpose. RLS policies may sit in their own migration or alongside each table, either is fine as long as they're versioned.

### 8.2 Tables (initial)
| Table | Key columns |
|---|---|
| `institutions` | id, name, address, `place_id` (unique), provider (`google`/`osm`/`manual`), verified bool |
| `profiles` | id (= auth.users.id), full_name, account_type (`student`/`staff`), institution_id, grade, stream, designation, avatar_url |
| `events` | id, slug (unique), owner_id, institution_id, title, description_structured (jsonb), type, mode (`online`/`offline`), venue, starts_at, ends_at, cost_amount, payment_qr_url, registration_mode (`direct`/`screened`), screening_criteria (jsonb), eligibility (jsonb), capacity, cover_url, status (`draft`/`published`/`closed`) |
| `event_members` | event_id, profile_id, role (`owner`/`organizer`/`volunteer`) *(participants are derived from `registrations`)* |
| `form_fields` | id, event_id, label, type, options (jsonb), required, position |
| `registrations` | id, event_id, profile_id, answers (jsonb), payment_status, payment_proof_url, status, checked_in_at, unique(event_id, profile_id) |
| `screenings` | id, registration_id, transcript (jsonb), score, strengths, concerns, summary, recommendation, created_at |
| `broadcasts` | id, event_id, author_id, audience (enum), audience_profile_ids (uuid[]), body, created_at |
| `announcements` | id, institution_id, author_id, title, body, created_at |
| `ideas` | id, institution_id, author_id (**never exposed to clients**), body, status, upvote_count, hidden bool, created_at |
| `idea_votes`, `idea_replies`, `idea_reports` | supporting tables |

### 8.3 Security
- RLS enabled on **every** table. Policies derive role from `event_members` / `registrations` / `profiles`.
- `ideas.author_id` is excluded from any client-facing view (expose through a view or RPC that omits it).
- Storage buckets: `event-media` (public read, owner write), `payment-proofs` (private; owner + organizers only).
- Create a **database trigger** to auto-create a `profiles` row on user signup.

---

## 9. AI Specification

### 9.1 Provider abstraction
`services/ai/index.ts` exposes:
- `generate({ system, messages, schema? })` → text or JSON
- `transcribe(audioBlob)` → text

Default implementation: **Gemini Flash** (free tier). Because free-tier limits are low and prompts on the free tier may be used by Google for product improvement, note this in the privacy page and avoid sending unnecessary personal data. Implement retry with backoff on 429 and a friendly "AI is busy, try again" UI state. Everything provider-specific stays in `gemini.ts`.

### 9.2 Prompts (stored in `/src/prompts`, one file each)
1. **`event-structurer`**: Input: quick-form data + organizer's dump. Output (JSON): `{ summary, schedule[], rules[], prizes[], faqs[], contacts[], open_questions[] }`. Behavior: never invent facts; ask for what's missing; friendly, concise.
2. **`screening-interviewer`**: Input: event details, organizer criteria, applicant's form answers. Behavior: ask one question at a time, 4-6 total, adapt to previous answers, stay on-topic, be encouraging and age-appropriate (users may be minors), never ask for sensitive personal data. Ends with a completion signal.
3. **`screening-summarizer`**: Input: transcript + criteria. Output (JSON): `{ score, strengths[], concerns[], summary, recommendation }`. Behavior: score strictly against the organizer's criteria, no bias based on gender, caste, religion, or institution prestige; flag uncertainty.

### 9.3 Safety and quality
- AI output validated against a schema before saving; invalid output triggers one retry.
- Interview transcripts are visible only to organizers/owner of that event and the applicant.
- Students are shown a short disclosure before the AI interview.

---

## 10. Non-Functional Requirements
- **Performance:** first load of the app shell under ~3s on mid-range Android over 4G; use image optimization, lazy-load heavy components (3D, charts).
- **Accessibility:** semantic HTML, keyboard navigable, visible focus ring (token), AA contrast, alt text, reduced-motion respect (`prefers-reduced-motion` disables heavy animations).
- **Responsiveness:** 360px to 1920px.
- **Privacy:** minors are users, so collect minimal data, no public exposure of personal info, clear privacy note, and moderation tools for anonymous content.
- **Reliability:** graceful handling of offline, AI failures, and rate limits.

---

## 11. Build Order (after Step 1)
1. Auth + onboarding + profile (real) → 2. Institution picker → 3. Event creation (quick form + AI structuring chat + voice) → 4. Public/app event pages + image upload → 5. Home feed + eligibility → 6. Form builder + registration (+ manual payment) → 7. AI screening + organizer dashboard → 8. Team/roles + RLS hardening → 9. Broadcasts (realtime + offline queue) → 10. Campus + anonymous ideas → 11. Digital ID + check-in → 12. Landing page polish → 13. Push notifications (last) → 14. Seed demo data and rehearse the demo loop.

**Time-box guidance:** if behind schedule, cut in this order: 3D landing element → push notifications → check-in scanner → anonymous ideas → digital ID polish. **Never cut** the core demo loop (create → register → AI screen → rank → accept).

---

## 12. Out of Scope (MVP) / Roadmap
- Institution and organizer verification, partner institutes
- Automated payments (Razorpay/Stripe)
- Bluetooth/mesh offline broadcasting (native app only)
- Native iOS/Android apps
- Granular custom roles and permissions
- Analytics and reports
- Certificates, leaderboards, results publishing
- Multi-language support

---

## 13. Success Criteria for the Hackathon Demo
- A judge can open the link on a phone, install it, and sign up.
- An organizer creates an event by **speaking** their idea and gets a structured event page in under 2 minutes.
- A second account registers and completes an **AI interview**.
- The organizer dashboard shows a **ranked list with summaries**, and acceptance updates the student's status instantly.
- Seeded data makes every screen look alive.