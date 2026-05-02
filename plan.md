# ConvoyFriends — Intensive Execution Plan

> A phased, opinionated plan to get from "handoff brief + landing page" to "shipped mobile app
> with 300 founding drivers running real convoys." Companion to `project.md`.
>
> **Last updated:** 2026-05-02
> **Owner:** Chuck (chuck@gelabs.dev)
> **Estimated calendar:** 12–16 weeks for Phases 0–5 with 1 dedicated builder. Phase 6 (launch) is a separate milestone.

---

## Reading guide

Each phase has the same shape:

1. **Goal** — the single sentence that says when the phase is done.
2. **Why now** — what unlocks it, why it can't be later.
3. **Deliverables** — concrete artifacts (file paths, URLs, accounts).
4. **Tasks** — broken down small enough to fit in a single working session.
5. **Definition of Done** — the *checkable* outcome, not the wish.
6. **Risks & mitigations** — the specific ways this phase blows up.
7. **Out of scope** — explicitly deferred work, so we don't drift.

Tasks are numbered `P{phase}.{group}.{n}` so we can reference them from `progress.md` and commit messages (e.g. `P2.3.1: wire form to Supabase Edge Function`).

---

## Phase 0 — Foundations & Inventory  *(½ – 1 day)*

### Goal
Have a clean, version-controlled project, the brief turned into living docs (done), and every external account/key the rest of the plan depends on.

### Why now
Every later phase assumes we have a git repo, a Supabase project, and credentials in hand. Provisioning is dead time we cannot parallelize against coding, so it goes first.

### Deliverables
- `confri/` is a git repo with `main` branch and an initial commit.
- `.env.example` documenting every secret the project will need.
- Accounts provisioned and keys captured in a password manager (NOT this repo):
  - GitHub repo (private).
  - Apple Developer ($99/yr).
  - Google Play Console ($25 one-time).
  - Supabase project.
  - Mapbox account + access token.
  - Resend account + API key.
  - Cloudflare Pages or Vercel for the marketing site.
  - Discord server with founder admin.

### Tasks
- **P0.1.1** — `git init` in `/Users/chuckrdrgz/Desktop/mvp/confri/`, push to a private GitHub repo named `convoyfriends`.
- **P0.1.2** — Add `.gitignore` (Node, Expo, macOS, .env*).
- **P0.1.3** — First commit: the four markdown docs + `cfhandoff.html`.
- **P0.2.1** — Provision the eight accounts above; capture keys in 1Password / Bitwarden under a "ConvoyFriends" vault.
- **P0.2.2** — Write `.env.example` with placeholder vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `MAPBOX_TOKEN`, `RESEND_API_KEY`, `DISCORD_BOT_TOKEN`.
- **P0.3.1** — Create a `README.md` at the repo root pointing at `project.md` / `plan.md` / `progress.md` / `learnings.md` so anyone landing on the repo knows where to start.

### Definition of Done
- `git remote -v` shows the GitHub origin.
- A new contributor can `cp .env.example .env`, fill in the values, and have all the secrets they need to start.
- `progress.md` has a 2026-05-XX entry titled "Phase 0 complete" with the GitHub URL.

### Risks & mitigations
- **Apple Developer enrollment delays** (can take 24–48h for individual accounts, weeks for businesses). Mitigation: start P0.2.1 immediately, do not block other work on it. iOS-specific tasks live in Phase 4 and can wait.
- **Founder doesn't have control of the convoyfriends.app domain.** Mitigation: confirm DNS access in P0.2.1; if missing, escalate before Phase 1.

### Out of scope
No code. No design. No `npm install`. Just inventory.

---

## Phase 1 — Marketing Site Live  *(2 – 3 days)*

### Goal
`https://convoyfriends.app` serves the beta landing page from version control, with a working "Apply" button that sends form data somewhere we can read.

### Why now
The landing page is the only customer-facing surface that exists. It's the simplest end-to-end loop in the system (form → DB → email). Building it first proves the toolchain (build, deploy, env vars, custom domain) before we layer on mobile complexity.

### Deliverables
- `web/index.html` — the landing page in this repo.
- A deploy on Cloudflare Pages or Vercel, custom domain configured.
- `web/og-image.png` and `web/favicon.svg`.
- `web/README.md` documenting the build & deploy.

### Tasks

#### P1.1 — Locate or rebuild `index.html`
- **P1.1.1** — Ask the founder for the existing `index.html`. If found, drop into `web/` and commit.
- **P1.1.2** — If not found, rebuild from the spec in `cfhandoff.html` (sections: hero, benefits, application form, how-it-works, footer). Stay strictly inside the brand system in `project.md`.
- **P1.1.3** — Verify the page passes Lighthouse: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95.

#### P1.2 — Static deploy
- **P1.2.1** — Create a Cloudflare Pages (or Vercel) project pointing at the GitHub repo, build directory `web/`.
- **P1.2.2** — Configure custom domain `convoyfriends.app` with the appropriate CNAME / A records.
- **P1.2.3** — Confirm HTTPS, redirects (`www → apex`), and a 200 from `curl -I https://convoyfriends.app`.

#### P1.3 — OG image, favicon, metadata
- **P1.3.1** — Design a 1200x630 OG image using the brand gradient + tagline. Export to `web/og-image.png`.
- **P1.3.2** — Add full meta tags: `og:*`, `twitter:*`, canonical URL, theme-color (`#050B16`).
- **P1.3.3** — Verify previews on https://www.opengraph.xyz/ and Twitter card validator.

#### P1.4 — Form submission (placeholder backend)
- **P1.4.1** — Wire the form to a Formspree or Web3Forms endpoint as a *temporary* sink, so the page is functional from day one.
- **P1.4.2** — Add a success state showing the generated `CF-XXXXXX` reference (client-generated for now; will be server-generated in Phase 2).
- **P1.4.3** — Add basic GA4 / Plausible analytics.

### Definition of Done
- Visiting `https://convoyfriends.app` from a phone works, looks correct, and the form submits.
- Submitting the form lands an email or row in the temporary backend.
- Lighthouse scores meet the bar.
- A `progress.md` entry documents the deploy URL and any deltas from the brief.

### Risks & mitigations
- **The brief's component vocabulary is dense; rebuilding from scratch eats more time than expected.** Mitigation: timebox P1.1.2 to one day. If we're behind, ship a simplified version that's still on-brand and iterate.
- **OG image looks generic.** Mitigation: use the gradient + an actual UI shot of the convoy map mock from `cfhandoff.html` rather than a stock sunset photo.

### Out of scope
- Backend logic for storing applications (Phase 2).
- Email automation (Phase 3).
- Localization (Phase 7).

---

## Phase 2 — Real Backend for Beta Applications  *(3 – 5 days)*

### Goal
Form submissions land in a Supabase Postgres table, are deduped by email, get a server-issued `CF-XXXXXX` ID, and trigger a confirmation email. The founder can read & filter applications in a single dashboard.

### Why now
The temporary form sink in Phase 1 doesn't dedupe, doesn't generate a real ID, and doesn't scale. Before we promote the landing page to influencers / press, we need a backend we trust.

### Deliverables
- `backend/supabase/` — Supabase project config, SQL migrations, Edge Functions, `seed.sql`.
- A `beta_applications` Postgres table with row-level security.
- A Supabase Edge Function `submit-application` that the form posts to.
- A Resend integration sending the confirmation email.
- A read-only Retool / Supabase Studio view for the founder.

### Tasks

#### P2.1 — Schema
- **P2.1.1** — Create migration `0001_beta_applications.sql`:
  ```sql
  create table beta_applications (
    id text primary key,                  -- 'CF-' || 6 random digits
    created_at timestamptz default now(),
    name text not null,
    location text not null,
    email text not null,
    phone text not null,
    device text not null check (device in ('iphone','android')),
    vehicle text not null check (vehicle in ('motor','car','supercar','truck','bus')),
    dream text not null,
    status text not null default 'new'    -- new | shortlisted | accepted | waitlisted | rejected
              check (status in ('new','shortlisted','accepted','waitlisted','rejected')),
    notes text,
    reviewed_by text,
    reviewed_at timestamptz
  );
  create unique index on beta_applications (lower(email));
  ```
- **P2.1.2** — Enable RLS. Public role can `insert` only. Service role can `select / update`.

#### P2.2 — Edge Function
- **P2.2.1** — `supabase functions new submit-application`. Validate payload server-side using the schema in `project.md` §5. Reject malformed input with 400.
- **P2.2.2** — Generate `CF-` ID. Reject duplicates by email with a friendly 409 ("you've already applied — your reference is X").
- **P2.2.3** — Insert row, return `{ id, name }` for the success state.
- **P2.2.4** — Trigger Resend email on success (delegated to P3, but call the function here even if it's a stub).

#### P2.3 — Wire the form
- **P2.3.1** — Replace Formspree endpoint with the Supabase Edge Function URL. Keep the same success state UX.
- **P2.3.2** — Add server-side error handling: 400 → "check your form", 409 → "already applied", 5xx → "try again".

#### P2.4 — Founder dashboard
- **P2.4.1** — Document the Supabase Studio view in `backend/README.md` — sort by `created_at desc`, default filter `status = 'new'`.
- **P2.4.2** — Optionally, scaffold a tiny Retool or v0.dev admin if Studio isn't enough.

### Definition of Done
- A test submission from an incognito browser ends up as a row, with a unique `CF-` ID, and triggers a (stubbed) email log.
- A duplicate submission returns the original `CF-` ID, not a new one.
- RLS is verified: an anonymous client cannot `select` from `beta_applications`.
- Founder can see + filter the queue.

### Risks & mitigations
- **Spam.** Mitigation: add Cloudflare Turnstile to the form before launch traffic.
- **Email collision attacks (someone applies under another's email).** Mitigation: not a Phase 2 concern — first-come-first-served is fine for 300 slots; revisit only if it becomes a real pattern.
- **Schema drift.** Mitigation: every backend change goes through a numbered migration in `backend/supabase/migrations/`. No "edit in Studio" flows.

### Out of scope
- Email *content* and templates (Phase 3).
- Discord onboarding (Phase 3).
- Localized form copy (Phase 7).

---

## Phase 3 — Beta Ops: Email + Discord  *(3 – 4 days)*

### Goal
The path from application → acceptance → in the VIP Discord is automated. Founder reviews applications in one place, clicks "accept", and the rest happens.

### Why now
We're going to start collecting applications for real. Without this phase, the founder is doing manual email sends and Discord invites, which doesn't scale to 300.

### Deliverables
- `ops/emails/` — React Email templates: `confirmation.tsx`, `accepted.tsx`, `waitlisted.tsx`, `welcome-discord.tsx`.
- A Supabase Edge Function `on-application-status-change` that fires the right email when `status` changes.
- A Discord bot or invite-link automation gated by `status = 'accepted'`.
- Founder runbook: `ops/README.md` covering the daily review loop.

### Tasks

#### P3.1 — Email templates
- **P3.1.1** — Set up React Email in `ops/emails/`. Confirm Resend domain (`mail.convoyfriends.app`) with SPF + DKIM.
- **P3.1.2** — Build `confirmation.tsx` — the "we got your application, ref CF-XXXXXX" email. Brand-system-locked.
- **P3.1.3** — Build `accepted.tsx` — congratulations, here's your TestFlight invite + Discord link.
- **P3.1.4** — Build `waitlisted.tsx` — kind, specific, with "we'll let you know" timing.
- **P3.1.5** — Render to test inboxes (Gmail, Outlook, Apple Mail) via https://litmus.com or a personal sweep.

#### P3.2 — Triggering
- **P3.2.1** — Edge Function `on-application-status-change`: subscribe to row updates via Postgres `trigger`, route to the right template.
- **P3.2.2** — Wire `status = 'new'` insert → confirmation email.
- **P3.2.3** — Wire `status = 'accepted'` update → accepted email + Discord invite.

#### P3.3 — Discord
- **P3.3.1** — Spin up the Discord server: `#welcome`, `#announcements`, `#rides`, `#bugs`, `#feature-requests`, `#regional-{ph,us,sea,latam}`.
- **P3.3.2** — Configure invite link with single-use codes per applicant (or use a bot to gate via OAuth).
- **P3.3.3** — Add a welcome bot DM with the rules + code of conduct + the founder's intro video link (placeholder until recorded).

### Definition of Done
- Submitting an application → receive confirmation email within 60s.
- Founder flips `status = 'accepted'` in Studio → applicant receives acceptance email + Discord link within 60s.
- Discord welcome DM lands when they join.

### Risks & mitigations
- **Email deliverability.** Mitigation: use a subdomain (`mail.convoyfriends.app`), warm it up with low volume first, monitor Resend bounce rate.
- **Discord spam / scammers in the early server.** Mitigation: invite-link gating is hard from day one; do not allow self-invite.

### Out of scope
- The mobile app itself (Phases 4–5).
- Localized emails (Phase 7).

---

## Phase 4 — Mobile App: Skeleton & Live Map  *(3 – 4 weeks)*

### Goal
A React Native (Expo) app installable on iOS + Android via internal distribution. Two phones in the same "convoy" can see each other on a shared map in real time.

### Why now
This is the actual product. Everything before this was support infrastructure. **This is also where 60–70% of the total project effort lives.** Plan accordingly.

### Deliverables
- `mobile/` — Expo project, TypeScript, Bun or pnpm.
- App boots on iOS + Android, signed in via Supabase Auth (email magic link).
- "Create Convoy" → generates a 6-letter join code → another device joins → both see each other on a shared Mapbox map.
- TestFlight build + Internal Testing track on Play Console.

### Tasks

#### P4.1 — Scaffolding
- **P4.1.1** — `bunx create-expo-app mobile --template tabs`. Strip what we don't need.
- **P4.1.2** — Add Expo Router, NativeWind for styling (mirror the brand system tokens), Reanimated, Gesture Handler.
- **P4.1.3** — Configure `app.json` with bundle IDs (`app.convoyfriends.ios`, `app.convoyfriends.android`), brand splash, brand icon set.
- **P4.1.4** — Set up `eas.json` for `development`, `preview`, `production` profiles.

#### P4.2 — Auth
- **P4.2.1** — Install `@supabase/supabase-js`, configure with the project from Phase 2.
- **P4.2.2** — Email magic-link auth screen, deep-link callback. Persist session via SecureStore.
- **P4.2.3** — Hook the existing `beta_applications` table to a `profiles` table on first sign-in: only emails with `status = 'accepted'` may proceed.

#### P4.3 — Map
- **P4.3.1** — Install `@rnmapbox/maps`. Style: a custom **night** style derived from the brand palette (cyan + teal accents on a navy basemap).
- **P4.3.2** — `MapScreen` showing the user's own location with a custom convoy marker (the brand-mark from `cfhandoff.html` adapted into a directional arrow).
- **P4.3.3** — Foreground location permission flow with a clear, brand-voiced explainer screen.

#### P4.4 — Convoy primitives
- **P4.4.1** — Schema migration: `convoys` table + `convoy_members` join table. Each convoy has a 6-letter `join_code`.
- **P4.4.2** — "Create Convoy" → generate code → copy-to-clipboard + native share-sheet.
- **P4.4.3** — "Join Convoy" → enter code → join `convoy_members`.

#### P4.5 — Realtime location
- **P4.5.1** — Use Supabase Realtime channels: one channel per convoy `room:{convoy_id}`.
- **P4.5.2** — Each device broadcasts location every 3 seconds (configurable). Use `presence` for "who's currently driving".
- **P4.5.3** — Render every member's location as a marker on every other member's map. Color: cyan for self, teal for others.
- **P4.5.4** — Background location: enable for iOS + Android with proper permission flows. **This is the highest-risk task in Phase 4** — battery + permission UX is brutal.

#### P4.6 — Distribution
- **P4.6.1** — `eas build --profile preview` for both platforms.
- **P4.6.2** — TestFlight: upload, internal testing group with the founder + 2–3 trusted beta users.
- **P4.6.3** — Play Console: Internal Testing track with the same group.

### Definition of Done
- Two devices, two real iOS/Android phones, in the same convoy, both seeing each other move on a real road in real time.
- The recording of that drive is in `progress.md` as the **first-ever convoy run** milestone.

### Risks & mitigations
- **Background location is platform-hostile.** Mitigation: design the UX to default to *foreground-only* (driver keeps the app open while driving — common for nav apps anyway). Background is a fast-follow, not MVP-blocking.
- **Mapbox cost surprise.** Mitigation: `cfhandoff.html` doesn't budget — model a 300-driver, 4-hour-trip-per-week scenario in a spreadsheet during Phase 0/4 boundary.
- **Realtime fan-out at convoy scale.** Mitigation: 12-vehicle convoys × 3s updates = ~4 messages/sec/convoy, fully within Supabase's free tier. We don't have a problem until we have 1000+ active convoys.

### Out of scope
- Voice chat (Phase 5).
- Smart re-routing (Phase 5+).
- Synchronized pit stops (Phase 5+).
- Group ETA (Phase 5).
- Settings, profile editing, social features (post-launch).

---

## Phase 5 — Voice + Group ETA  *(2 – 3 weeks)*

### Goal
Drivers in the same convoy can hear each other, and the lead driver sees an honest ETA that accounts for the slowest car.

### Why now
Voice is the second-strongest pull on the product (especially for motorcycle riders). Group ETA is a small feature that creates a big "oh, this is genuinely useful" moment in user testing.

### Deliverables
- LiveKit (or Daily) integration in `mobile/`.
- Push-to-talk + always-on voice modes, with a visible "who's talking" indicator.
- Group ETA computed server-side from Mapbox Directions API + every driver's distance-to-destination.

### Tasks

#### P5.1 — Voice
- **P5.1.1** — Pick LiveKit (cloud) over self-hosted for time-to-market. Account + project + token signer Edge Function.
- **P5.1.2** — Mobile: `@livekit/react-native`, request mic permissions with the same brand-voiced explainer pattern.
- **P5.1.3** — UI: a sticky bottom bar with mic state, talking-indicator avatars, mute, push-to-talk hold zone.
- **P5.1.4** — Bluetooth + AirPods routing: verify on real hardware. **Common bug source.**

#### P5.2 — Group ETA
- **P5.2.1** — Convoy can set a destination via Mapbox Geocoding.
- **P5.2.2** — Edge Function `compute-group-eta` runs every 30s: pulls each member's location, computes per-driver ETA via Mapbox Directions API, returns `max(eta) + buffer`.
- **P5.2.3** — Lead-driver UI shows "Group ETA: X min · slowest: <name> behind by Y min".

### Definition of Done
- Three drivers on a real road can hold a 30-minute conversation without dropouts.
- Group ETA matches reality within ±2 minutes by trip end.

### Risks & mitigations
- **Voice on weak cellular.** Mitigation: LiveKit's adaptive bitrate handles most of this; add a "voice quality" indicator so users blame the network, not the app.
- **Mapbox Directions API costs.** Mitigation: cache routes per (origin, destination) tuple; only re-route when a driver deviates >500m.

### Out of scope
- Smart re-routing for the convoy (re-route the *leader* when someone falls behind). Build after launch unless beta drivers strongly request it.
- Synchronized pit stops. Same.

---

## Phase 6 — Public Launch Prep  *(1 – 2 weeks)*

### Goal
App Store + Play Store submissions live. Marketing site updated with real product screenshots. Founder VIP intro video shipped. First public-launch announcement scheduled.

### Tasks
- **P6.1.1** — Capture real product screenshots (5 per platform, per App Store guidelines).
- **P6.1.2** — Replace SVG phone mock on `index.html` with a real screenshot.
- **P6.1.3** — Write App Store + Play Store metadata. Use the brand voice; avoid hype.
- **P6.1.4** — Privacy policy + Terms of Service. Use a real lawyer-reviewed template, not generated from a tool.
- **P6.1.5** — Apple App Privacy disclosures (location, microphone, identifiers).
- **P6.1.6** — Submit to App Store + Play Store. Plan for **at least one rejection** — first submissions almost always have a metadata or demo-account issue.
- **P6.1.7** — Founder records a 60-second intro video. Embed on landing page + Discord welcome.

### Definition of Done
- Both apps are publicly downloadable.
- Landing page references the live App Store + Play Store URLs.
- A launch announcement is drafted in `ops/launch/` for the founder to send.

---

## Phase 7 — Localization & Polish  *(parallel, 1 – 2 weeks)*

Can run in parallel with later phases. Not a launch blocker for English markets.

- **P7.1** — Tagalog + Spanish translation of the marketing site.
- **P7.2** — Tagalog + Spanish translation of the email templates.
- **P7.3** — In-app i18n scaffolding (`i18next`) with English as base.
- **P7.4** — Translation review with native speakers from each market.

---

## Cross-cutting tracks (always-on)

These run parallel to the phases above. Don't put them in the critical path; do put them in the rituals.

| Track | Cadence | What |
|---|---|---|
| **Observability** | Set up in P0–P1, monitor weekly | Sentry on web + mobile, Supabase logs, Resend deliverability dashboard. |
| **Cost monitoring** | Weekly | Track Supabase + Mapbox + LiveKit + Resend spend. Alert at 50% of monthly budget. |
| **Founder review loop** | 2x/week | 30-min sync to review applications, demo progress, unblock decisions. Notes go in `progress.md`. |
| **`learnings.md` hygiene** | Continuous | Every phase boundary, write at least one entry — a decision, a learning, or a milestone. |

---

## What we're explicitly *not* doing (and when to reconsider)

- **Native iOS / Android codebases.** Reconsider only if React Native hits a hard wall on map performance or background location.
- **A web app version of the convoy experience.** Drivers don't drive with laptops. Defer indefinitely.
- **Subscription / payments.** Beta is free. Reconsider after launch when we have usage data.
- **AI features (route optimization, voice transcription, etc.).** Defer. The convoy basics need to work first; adding LLMs to a pre-MVP product is a distraction.
- **Public app for non-applicants.** The whole point of the 300-driver beta is exclusivity and feedback. Defer open access.

---

## Phase dependency graph

```
P0 (Foundations) ─┬─► P1 (Marketing site) ─► P2 (Backend) ─► P3 (Beta ops)
                  │                                                  │
                  └─► P4 (Mobile skeleton + live map) ───────────────┤
                                                                     │
                                                  P5 (Voice + ETA) ──┤
                                                                     │
                                              P6 (Launch prep) ◄─────┤
                                                                     │
                                              P7 (i18n) ─────────────┘  (parallel from P3 onward)
```

P4 can start **as soon as P0 is done**, in parallel with P1–P3. That's the critical-path optimization: don't let the marketing/ops side block the mobile build.

---

## How to use this plan

1. **Don't try to read it linearly in one sitting** during execution. Open the phase you're in and ignore the rest.
2. **Every commit message** should reference a task ID: `P4.5.3: render remote convoy markers`.
3. **Every `progress.md` entry** should reference the phase + task IDs it advanced.
4. **At each phase boundary,** write a `learnings.md` entry — even if it's just one line.
5. **If a task takes >2x its eyeballed estimate,** stop and write a learning before pushing through. The whole point of these docs is that the *next* hard task gets the benefit of the lesson.

---

*Companion docs: `project.md` (overview), `progress.md` (rolling log), `learnings.md` (decisions + milestones).*
