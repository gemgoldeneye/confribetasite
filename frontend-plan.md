# ConvoyFriends — Front-End-Centered Phasing Plan

> The companion to `plan.md`, but re-pivoted: every phase is measured by **what a user sees, touches, and feels.**
> Backend appears only as **typed stubs** the front-end consumes. We never block on a server.
>
> **Last updated:** 2026-05-03
> **Owner:** Chuck (chuck@gelabs.dev)
> **Estimated calendar:** 10–14 weeks for Phases F0–F8 with 1 dedicated front-end builder.

---

## Front-end-first principles

These rules are non-negotiable for the duration of this plan. They are the reason the plan works.

1. **Design tokens live in code, not Figma.** The brand system from `project.md` ships as a TypeScript module before any screen is built. Screens import tokens; screens never hardcode hex.
2. **One UI kit, two surfaces.** The marketing site and the mobile app share a vocabulary (radii, gradients, typography scale, motion curves). They use different runtimes (HTML/CSS vs React Native), but a designer should not be able to tell them apart in screenshots.
3. **Stubs over servers.** Every backend interaction goes through a `services/` layer. Phase 0 implements all of it as in-memory mocks. The real implementation arrives later without a single screen needing to change.
4. **Storybook is the source of truth for components.** A component without a story doesn't exist. Reviews happen in Storybook, not on a running app.
5. **Motion is a feature, not decoration.** Every transition, every gesture, every empty/loading/error state is specified before the screen is "done." A static-looking app is a half-finished app.
6. **Real device testing every Friday.** Simulator-only is a trap. The whole product is *the road*. If we haven't held it in a car this week, we don't know if it works.
7. **Accessibility from day one.** Color contrast, font scaling, screen reader labels, hit targets ≥44pt. Bolting it on later is 5x the cost.

---

## Phase F0 — Design Tokens & UI Foundation  *(3 – 4 days)*

### Goal
A shared, typed design system that both the web and mobile codebases can consume, with a Storybook running locally.

### Why front-end first
Every other phase consumes this. Building it first means we never write `#3DD9F5` twice, and a brand-system change is a one-line PR.

### Deliverables
- `packages/tokens/` — pure TypeScript, zero runtime deps. Exports `colors`, `gradients`, `radii`, `spacing`, `typography`, `motion`, `elevation`.
- `packages/ui-web/` — primitives for the marketing site (Button, Card, Input, Pill, Toast, GradientText).
- `packages/ui-mobile/` — same primitives, React Native flavor (NativeWind classes generated from tokens).
- `apps/storybook/` — running on `localhost:6006`, hosting both kits side by side.
- One PR per primitive. Reviewed in Storybook before merge.

### Tasks
- **F0.1.1** — Initialize the monorepo (Bun workspaces or pnpm). Folders: `apps/`, `packages/`.
- **F0.1.2** — `packages/tokens/src/index.ts`. Encode every value from `project.md` §4. Add `motion` (durations, easing curves) and `elevation` (shadow recipes per surface depth).
- **F0.2.1** — `packages/ui-web/`: TypeScript + Vite library mode. Tailwind preset that *consumes* the tokens module (no parallel source of truth).
- **F0.2.2** — Build, in Storybook, on web: `Button` (primary, ghost, icon), `Card` (glass, solid), `Input`, `Textarea`, `RadioPill`, `RadioSegment`, `Toast`, `GradientText`, `BrandMark`.
- **F0.3.1** — `packages/ui-mobile/`: React Native + NativeWind. Same component names, same prop signatures where physically possible (e.g. `onPress` vs `onClick` is unavoidable).
- **F0.3.2** — Build, in Storybook on-device (`@storybook/react-native`): the same primitive set. Reuse SVGs as `react-native-svg`.
- **F0.4.1** — Visual regression: capture a baseline Chromatic (or Loki) snapshot of every story. Block PRs on visual diffs.

### Visual DoD
- A side-by-side screenshot of the same `<Button>` rendered in web and mobile is **pixel-confusable** at brand level (same gradient, same radius, same typography weight, same shadow direction).
- Storybook has at least 12 stories. Every story has dark-only background (the brand is night-mode native).

### Risks & mitigations
- **Mobile and web diverge silently as more primitives are added.** Mitigation: every primitive PR ships both halves or it doesn't ship.
- **Token churn breaks consumers.** Mitigation: tokens are versioned; only patch bumps until F0 is done.

### Out of scope
- Screens. F0 is Lego bricks; F1 is the first house.

---

## Phase F1 — Marketing Site, In Repo, In Brand  *(4 – 5 days)*

### Goal
`https://convoyfriends.app` is rebuilt (or imported) as a real component-driven site under `apps/web/`, deployed continuously, perfect on mobile, perfect on Lighthouse.

### Why front-end first
This is the only customer-facing surface that exists today. Owning it in the repo gives us version control, preview deploys, and a place to test the design system in real production conditions before the mobile app exists.

### Deliverables
- `apps/web/` — Astro or Next.js (Astro preferred for a static-content site this size).
- Pages: `/` (landing), `/privacy`, `/terms`, `/contact`.
- Components imported from `packages/ui-web/`.
- A `MotionPhone` component — the animated SVG phone mock with the live-ish convoy map. **Hand-tuned, not a stock illustration.**
- Cloudflare Pages deploy with preview URLs per PR.

### Tasks

#### F1.1 — Bring the existing `index.html` into the repo
- **F1.1.1** — Get the current `index.html` from the founder. If unavailable, rebuild from `cfhandoff.html` §03.
- **F1.1.2** — Decompose into Astro components: `<Hero>`, `<Benefits>`, `<ApplicationForm>`, `<HowItWorks>`, `<SiteFooter>`.
- **F1.1.3** — Replace inline values with token imports. Verify zero raw hex in the codebase (`grep -r '#[0-9A-F]\{6\}' apps/web` returns 0).

#### F1.2 — `MotionPhone` (the hero)
- **F1.2.1** — Build the phone bezel as an SVG component, brand-tokenized.
- **F1.2.2** — Build the inner "convoy map" — a stylized road with three moving markers (cyan, teal, mute) trailing along a curved path. CSS keyframes or Framer Motion.
- **F1.2.3** — `prefers-reduced-motion` → freeze to a hero pose. Non-negotiable.

#### F1.3 — Application form
- **F1.3.1** — Use `@conform-to/react` or `react-hook-form` for client validation that mirrors `project.md` §5.
- **F1.3.2** — Inline error states styled per design system. The form must feel like the rest of the site — no default browser styling leaks through.
- **F1.3.3** — Top progress bar that fills as required fields are completed. Brand gradient, 2px tall.
- **F1.3.4** — Success state: "Welcome aboard, {firstName}." plus the `CF-XXXXXX` reference in JetBrains Mono. Confetti is forbidden; the brand is confident, not chummy.
- **F1.3.5** — Submit handler points at a `submitApplication()` function in `services/applications.ts`. **Today it's a fetch to a Formspree URL. Phase F2 will swap the impl. The form does not change.**

#### F1.4 — Polish
- **F1.4.1** — OG image (1200×630): brand gradient + the `MotionPhone` posed shot + the tagline in Sora 800.
- **F1.4.2** — Favicon set: SVG primary + PNG fallbacks at 32, 192, 512.
- **F1.4.3** — `theme-color` `#050B16`. Address bar matches the page on mobile Safari.
- **F1.4.4** — Lighthouse: Performance ≥95, Accessibility ≥98, Best Practices ≥95, SEO ≥98.

#### F1.5 — Deploy
- **F1.5.1** — Cloudflare Pages project. PR previews enabled.
- **F1.5.2** — Custom domain `convoyfriends.app`, HTTPS, `www → apex` redirect.
- **F1.5.3** — Add basic Plausible analytics. No GA. Privacy-respecting by default.

### Visual DoD
- On a 5.4" iPhone in Mobile Safari, dark mode, the page is indistinguishable in tone from a launched product. Specifically: the gradient on the headline, the phone mock animation, and the form validation states all feel cohesive.
- A screenshot of the `<Hero>` and a screenshot of the equivalent component from Storybook are visually identical except for content padding.

### Risks & mitigations
- **The animated phone mock burns a week.** Mitigation: timebox to 2 days. If we're behind, ship a still hero shot and iterate post-launch — the form is more important.
- **Form submission has no real backend.** Mitigation: that's by design — the `services/` stub keeps the front-end shippable. Phase F2 (or its backend-side equivalent) wires the real path.

### Out of scope
- Localization (Phase F8).
- Real product screenshots (Phase F7 — they require the mobile app).
- A `/blog` or any CMS-backed content. Hard no for MVP.

---

## Phase F2 — Mobile App Shell  *(1 week)*

### Goal
A signed Expo app installs on a real iPhone and a real Android device. Splash, icon, fonts, theme, navigation skeleton, and dev menu all match the brand. Zero product features yet.

### Why front-end first
The shell is what every screen lives inside. Getting it right (fonts loaded, safe areas honored, status bar tinted, splash → home transition smooth) before any screen exists means every later screen inherits a clean baseline.

### Deliverables
- `apps/mobile/` — Expo Router project, TypeScript, Bun.
- Tabs: `(tabs)/index.tsx` (Drive), `(tabs)/convoys.tsx`, `(tabs)/profile.tsx` — empty content, real navigation.
- Splash screen: brand mark on `#050B16`, fades into the app.
- Icon set: brand mark adapted per platform (rounded-square iOS, full-bleed adaptive Android).
- Internal distribution build (`eas build --profile preview`) on TestFlight + Play Internal.

### Tasks

#### F2.1 — Scaffold
- **F2.1.1** — `bunx create-expo-app apps/mobile --template tabs`. Strip example content.
- **F2.1.2** — Install Expo Router, Reanimated 3, Gesture Handler, NativeWind, `expo-font`, `expo-haptics`, `expo-splash-screen`, `expo-status-bar`.
- **F2.1.3** — Wire NativeWind to consume `packages/tokens` directly. Generate Tailwind config from token export.

#### F2.2 — Identity
- **F2.2.1** — Splash screen asset: SVG → PNG at 1242×2436 (and Android 1080×1920) with the brand mark centered, gradient halo, on `#050B16`. Set `expo-splash-screen` to keep it visible until fonts + tokens hydrate.
- **F2.2.2** — Icon set: 1024×1024 source. Run through `expo-asset` to generate all required sizes. Adaptive icon foreground/background for Android.
- **F2.2.3** — Bundle Sora + Inter + JetBrains Mono via `expo-font`. Block the splash dismissal until fonts are loaded — never let a screen render in the system font.
- **F2.2.4** — Status bar: light content on every screen. Translucent on Android.

#### F2.3 — Navigation
- **F2.3.1** — Tabs with custom bar: pill-shaped, glass-card translucent, brand-gradient indicator under the active tab. **Do not ship the default Expo tab bar.** First-impression matters.
- **F2.3.2** — Modal stack on top for "Create Convoy" and "Join Convoy" flows (placeholder screens for now).
- **F2.3.3** — Deep linking scheme `convoyfriends://` registered in `app.json`. We'll need it for the magic-link auth in F3.

#### F2.4 — Dev tooling
- **F2.4.1** — Storybook on-device wired up. Long-press the app icon (debug builds) → opens Storybook.
- **F2.4.2** — A "Theme Probe" screen behind a hidden gesture that renders every token + every primitive. Catch regressions visually in 10 seconds.

### Visual DoD
- App opens, splash holds for 600ms, fades into the Drive tab. The transition is smooth on a 3-year-old Android. No font flash. No layout shift.
- The custom tab bar feels brand-coherent. Screenshot it next to the marketing site's button — same gradient, same radii.

### Risks & mitigations
- **Font loading flicker.** Mitigation: keep splash visible until `useFonts()` resolves.
- **Adaptive icon looks wrong on Android.** Mitigation: test on a Pixel and a Samsung early, not at the end.

### Out of scope
- Auth (F3).
- Map (F4).
- Real screens (F4+).

---

## Phase F3 — Onboarding & Auth Screens  *(1 week)*

### Goal
A new beta driver can open the app, enter their email, tap a magic link, grant location permission, and land on a (still-empty) Drive screen. Every step is on-brand and lovable.

### Why front-end first
Onboarding is where most apps lose their first impression. It's also a sequence of *screens* — exactly the kind of thing the front-end can polish to a high gloss while the backend is stubbed.

### Deliverables
- `app/(onboarding)/welcome.tsx` — the brand intro.
- `app/(onboarding)/email.tsx` — enter email, request magic link.
- `app/(onboarding)/check-email.tsx` — instructional, with "open mail app" deep link.
- `app/(onboarding)/permissions.tsx` — location-permission explainer with a custom illustration (not the system dialog with no context).
- `app/(onboarding)/handle.tsx` — pick a callsign + vehicle pictogram (reused from the application form, but persistent in-app).
- `services/auth.ts` — stub interface with `requestMagicLink(email)`, `signInWithToken(token)`, `currentSession()`. Backed by AsyncStorage for now; swappable to Supabase later.

### Tasks

#### F3.1 — Onboarding choreography
- **F3.1.1** — Welcome screen: full-bleed gradient mark, headline "Drive together. Navigate smarter.", subhead, primary CTA "I have a beta invite", secondary "Apply for the beta" (deep-links to the marketing site).
- **F3.1.2** — Email screen: large input, brand-styled, primary CTA "Send my magic link." Inline validation matches the marketing site.
- **F3.1.3** — Check-email screen: animated illustration of a paper airplane on the brand gradient. Buttons: "Open mail app" (uses `expo-linking` to open the system mail client) and "Resend (in 30s)" with a live countdown.
- **F3.1.4** — Permissions screen: explainer copy *first*, custom illustration *second*, then a primary CTA that triggers the system dialog. The brand voice owns the explanation; iOS/Android only get to ask for "Allow / Deny."

#### F3.2 — Motion
- **F3.2.1** — Page transitions: a 240ms horizontal slide with a subtle parallax on the background gradient. Not the default stack push.
- **F3.2.2** — CTA micro-interaction: button scales 0.98 on press, soft haptic (`Haptics.ImpactFeedbackStyle.Light`).
- **F3.2.3** — Error states animate in with a 6px shake plus a red-tinted border that fades back to brand-line over 800ms.

#### F3.3 — Stubbed auth
- **F3.3.1** — `services/auth.ts` accepts any well-formed email, generates a fake JWT, persists it in `expo-secure-store`. The "magic link" is a deep-link the dev menu can re-trigger.
- **F3.3.2** — `useSession()` hook with `pending | unauthenticated | authenticated`. Drives the onboarding/main split in `app/_layout.tsx`.

#### F3.4 — Empty handle screen
- **F3.4.1** — Screen for picking a "Convoy callsign" (3–16 chars) and a vehicle pictogram. Reuses the `RadioPill` from F0.
- **F3.4.2** — Saves to a local `profile` state (Zustand or Context). Backend will sync this in a later phase.

### Visual DoD
- Recording a 30-second screen capture of the onboarding flow on a real iPhone makes someone who has never seen the app go: *"this is a real product."*
- No screen has more than 3 elements above the fold. Every screen has exactly one primary action.

### Risks & mitigations
- **Magic-link deep linking is finicky on iOS.** Mitigation: stubbed for F3 — we test the *UX* now, the real wiring lands when the backend is connected. The screen still works because the dev menu can simulate the deep link.
- **Permissions copy is generic.** Mitigation: write it with the founder. "We use your location to keep the convoy together — never when the app is closed" beats "We need location access."

### Out of scope
- The actual Supabase auth integration. Plug in later, no screen changes required (that's the whole point).

---

## Phase F4 — Drive Screen: Map & Self-Marker  *(1 – 1.5 weeks)*

### Goal
The "Drive" tab opens to a full-screen, brand-styled night-mode map, centered on the user's current location, with a custom convoy marker for self.

### Why front-end first
The map *is* the product. Getting the map style, the marker design, the camera behavior, and the gesture vocabulary right takes iteration — and is entirely an art problem until peers exist (F5).

### Deliverables
- `app/(tabs)/index.tsx` — the Drive screen.
- A custom Mapbox style URL (or local style JSON) tuned to the brand palette.
- `<ConvoyMarker>` component: directional, animated, brand-tinted.
- `<MapHUD>` overlay: top-left convoy badge, top-right speed/heading chip, bottom action stack — all glass-card translucent.

### Tasks

#### F4.1 — Mapbox setup
- **F4.1.1** — Install `@rnmapbox/maps`. Configure with a public token (read-only key).
- **F4.1.2** — Author a custom map style in Mapbox Studio: water `#0A1628`, land `#050B16`, roads cyan-tinted at 12% opacity, labels in Inter at low contrast. Export the style URL into the repo.
- **F4.1.3** — Lock max zoom out at 12 (no benefit to seeing the whole continent during a convoy). Lock min zoom in at 19.

#### F4.2 — Self-marker
- **F4.2.1** — `<ConvoyMarker>` SVG: the brand mark, but stretched into a directional arrow shape. Cyan stroke, soft glow.
- **F4.2.2** — Animation: marker rotates to match the heading, with a 200ms ease (no jitter from raw GPS values — apply a low-pass filter).
- **F4.2.3** — A 4-second "pulse" animation around the marker when the screen is idle. Scales 1 → 1.15, opacity 0.4 → 0, on the brand gradient.
- **F4.2.4** — Re-center button bottom-right when the user pans the map manually. Glass card, brand-gradient icon.

#### F4.3 — HUD
- **F4.3.1** — Top-left: convoy badge ("LONE WOLF" if not in a convoy; "{convoy callsign} · {n} drivers" if in one).
- **F4.3.2** — Top-right: speed chip in JetBrains Mono ("64 mph") + heading compass (N/NE/E/...). Computed from device sensors, not network.
- **F4.3.3** — Bottom: stacked CTAs. If not in a convoy → "Create convoy" + "Join convoy". If in one → "Pit stop" + "Voice on/off" (still stubbed).

#### F4.4 — Stubbed location service
- **F4.4.1** — `services/location.ts` exposes a `useMyLocation()` hook. Real `expo-location` watch-position underneath, but typed cleanly so peer locations in F5 share the same shape.
- **F4.4.2** — Foreground-only for now. Background location is a Phase F6+ concern with its own permission UX.

### Visual DoD
- Drive screen on a real phone, on a real road, looks like the kind of map that makes someone screenshot it and post it.
- No system UI is visible — fully immersive. Status bar transparent over the map.
- Every interactive element on the map has a brand glass-card surface. The default Mapbox attribution chip is repositioned and re-styled (legally required to keep, aesthetically required to belong).

### Risks & mitigations
- **Custom map style takes longer than expected.** Mitigation: timebox style authoring to 1 day. If the hand-tuned version isn't there, fall back to Mapbox's "navigation-night-v1" with minor tweaks. Iterate post-MVP.
- **Marker rotation jitters.** Mitigation: low-pass filter the heading; only rotate when |Δ heading| > 4°.

### Out of scope
- Peer markers (F5).
- Routing lines (F6 if at all).
- Map labels in any language other than English (F8).

---

## Phase F5 — Convoys: Create, Join, See Each Other  *(1 – 1.5 weeks)*

### Goal
Two devices in the same room, both logged in, can create/join the same convoy and see each other's marker move on the map. Visually correct, even if the realtime backend is stubbed via a shared local mock.

### Why front-end first
The convoy primitive is mostly **screens and animations**: create-flow, join-flow, share sheet, member roster, and peer-marker presentation. These can all be built and feel right against a stubbed peer source.

### Deliverables
- `app/convoy/create.tsx` — modal sheet to spin up a convoy and share the join code.
- `app/convoy/join.tsx` — 6-character code input with auto-advance and clipboard auto-fill.
- `<ConvoyRoster>` — bottom sheet with members, avatars, ETA-behind-by, a subtle pulse on whoever is currently speaking (when voice arrives).
- Peer markers on the map, color-coded teal for peers, one of them animated as if moving.
- `services/convoy.ts` stub — in-memory state shared across two devices via a simple WebSocket relay or even a hand-rolled debug flag.

### Tasks

#### F5.1 — Create flow
- **F5.1.1** — Modal slides up from bottom. Title "Spin up a convoy." Two large fields: convoy callsign (default to user's callsign + the date), max size (default 12).
- **F5.1.2** — Primary CTA generates a 6-letter code (no ambiguous chars — no I/O/0/1). Code is shown in JetBrains Mono at 32pt with the brand-gradient backdrop.
- **F5.1.3** — Native share sheet wired up: pre-fills "Hey, drop into the convoy: {url}" with the deep link.

#### F5.2 — Join flow
- **F5.2.1** — Six segmented input boxes, one per char. Auto-advance, auto-uppercase, paste handles all six at once.
- **F5.2.2** — Inline error state: "Code not found" or "Convoy is full" — both visually pre-built even though the backend stub is permissive.
- **F5.2.3** — On success: a 600ms "joined!" celebration — gradient ring sweeps in, haptic, screen morphs into the Drive tab.

#### F5.3 — Roster bottom sheet
- **F5.3.1** — Snap points: 80px peek, 40% mid, 90% expanded. Use `@gorhom/bottom-sheet`.
- **F5.3.2** — Each row: avatar (initials in brand gradient if no photo), callsign, ETA-behind-by chip, mic state (placeholder for F6).
- **F5.3.3** — Long-press a row → subtle haptic + popover ("Center on driver", "Mute", "Remove from convoy" — leader only).

#### F5.4 — Peer markers
- **F5.4.1** — Same `<ConvoyMarker>` primitive as self, but teal stroke, with the callsign label in a small chip beneath.
- **F5.4.2** — Smooth interpolation between location updates (no teleport — interpolate over the update interval).
- **F5.4.3** — Off-screen indicator: when a peer is outside the visible map region, show an arrow on the map edge pointing toward them, with their callsign + distance.

#### F5.5 — Stubbed realtime
- **F5.5.1** — `services/convoy.ts` exposes `createConvoy()`, `joinConvoy(code)`, `useConvoy(id)`, `useConvoyPresence(id)` with typed return shapes that mirror what Supabase Realtime will eventually return.
- **F5.5.2** — Behind the interface: a tiny WebSocket relay (like a 50-line Bun script) that ships in `tools/dev-relay/` and bounces messages between the developer's two devices. Or use `peerjs` for direct WebRTC if even simpler. **Throwaway code — explicitly tagged as such.**

### Visual DoD
- Two devices on the same Wi-Fi, both running the app, joined to the same convoy. Move one device → the other shows the marker glide. Convoy roster shows both. The recording of this moment goes in `learnings.md` as a milestone.

### Risks & mitigations
- **Two-device dev loop is slow.** Mitigation: build a "Phantom Driver" debug feature — a fake peer that walks a pre-recorded route. Iterate solo against it; only break out the second phone for final verification.
- **Bottom sheet conflicts with map gestures.** Mitigation: known issue with `@gorhom/bottom-sheet` + `@rnmapbox/maps`. Pin the versions known to coexist; document in `learnings.md`.

### Out of scope
- Voice (F6).
- Group ETA computation (F6).
- Real Supabase wiring (replaces F5.5 silently in a backend phase).

---

## Phase F6 — Voice UI & Group ETA Surfacing  *(1 week)*

### Goal
Voice controls and group ETA are present, beautiful, and functional against stubbed backends. Drivers can mute/unmute, see who's talking, and read a single honest "Group ETA" anchored on the slowest car.

### Why front-end first
Voice and ETA are *front-end-heavy* features: most of the user perception is the UI (talking indicators, mic state, ETA card pulses). The actual audio plumbing is comparatively small. Getting the UI sticky-bar right early reveals layout problems that would otherwise show up in user testing.

### Deliverables
- A persistent "convoy bar" pinned above the tab bar when in a convoy: shows mic state, talking peers, and an "off / on" toggle.
- A "Group ETA" card that the leader sees in the HUD, with "{slowest peer} is {Δ} min behind" copy.
- Push-to-talk hold zone on the right edge — spring-loaded, with haptics on press/release.
- `services/voice.ts` stub: simulates remote talk events on a 5–15s random cadence so the UI has something to react to in dev.

### Tasks

#### F6.1 — Convoy bar
- **F6.1.1** — Sticky 56pt bar, glass card, gradient hairline along the top edge.
- **F6.1.2** — Left: mic state (live waveform animating when self speaks).
- **F6.1.3** — Center: stacked avatars of current talkers, max 3 + "+N".
- **F6.1.4** — Right: voice toggle, gradient when on.

#### F6.2 — Push-to-talk
- **F6.2.1** — Right-edge hold zone is invisible until the user touches it; on touch, a brand-gradient half-circle fills the right ~80pt of the screen and the mic goes hot.
- **F6.2.2** — Haptics: `Light` on press, `Medium` on release, `Notification.Warning` if the user tries to talk while another driver is mid-sentence (visible busy indicator).
- **F6.2.3** — A toggle in settings: "Always-on voice" (skips PTT, mic stays open while on the Drive screen).

#### F6.3 — Group ETA card
- **F6.3.1** — Top-center HUD card, JetBrains Mono digits, "Group ETA · 2:14 PM."
- **F6.3.2** — Below, smaller: "{callsign} is 7 min behind" — links to the roster row when tapped.
- **F6.3.3** — Color tints: green-teal when within 3 min, brand-amber (`#F2B26B`, **add to tokens**) when 3–10 min, red-orange (`#F26B6B`, **add to tokens**) when >10 min.

#### F6.4 — Stubbed voice + ETA
- **F6.4.1** — `services/voice.ts`: `useTalkers()` emits fake talk events; `setMicOpen(bool)` toggles the local user's talker state. No actual audio yet.
- **F6.4.2** — `services/eta.ts`: `useGroupEta(convoyId)` returns a deterministic mock ETA + per-peer breakdown derived from the (also stubbed) peer locations.

### Visual DoD
- Holding the right edge of the screen during a drive feels intuitive on the *first* try, with no instructions. Two real users in a hallway test confirm this.
- The convoy bar's talker indicator reacts within 100ms of the stubbed event firing.
- The ETA card's color transitions are smooth, never abrupt.

### Risks & mitigations
- **PTT zone conflicts with map pan.** Mitigation: invisible until touched, and the activation gesture requires a long-press (>120ms) to disambiguate from a pan.
- **Brand palette doesn't have warning colors.** Mitigation: explicitly add `accent-amber` and `accent-warn` to the tokens module (and document in `learnings.md` as a deliberate extension, not a brand violation).

### Out of scope
- Actual LiveKit audio plumbing (later phase, separate from this plan's front-end remit). Plug in by replacing `services/voice.ts`.
- Computing ETA from a real Mapbox Directions call (same — replace `services/eta.ts`).

---

## Phase F7 — Marketing Site V2: Real Product Storytelling  *(4 – 5 days)*

### Goal
The marketing site shows the *actual* mobile app. Real screenshots, real motion captures, real testimonials (from the first beta drivers), and store badges that link to the live App Store + Play Store listings.

### Why front-end first
This phase only exists once the mobile app is installable on real devices and we've held it on the road. It's the moment the marketing site stops being a promise and starts being proof.

### Deliverables
- 5 product screenshots in a device-frame, brand-tinted background.
- A 30-second hero video — silent, captioned, looping — replacing the SVG `MotionPhone`.
- A new `<Testimonials>` section: 3 quotes from beta drivers, with their convoy callsign and vehicle.
- App Store + Play Store badges in the hero and footer.
- A `/changelog` page driven by the `learnings.md` milestone entries (auto-imported at build time).

### Tasks
- **F7.1.1** — Capture screenshots on iPhone 15 Pro and Pixel 8. Use the in-app `screenshot mode` (debug flag that hides the status bar and forces fixed sample data) to get clean shots.
- **F7.1.2** — Frame them with a custom device mockup component (not the cliché Apple template). Show the brand on the bezel.
- **F7.1.3** — Record the hero video against fixed sample data on a real drive. Edit to 30s, no music, captions in Inter 600 over the brand gradient strip.
- **F7.1.4** — `<Testimonials>` component, brand-locked. Quotes pulled from a `_data/testimonials.json` so the founder can edit without code changes.
- **F7.1.5** — Add App Store + Play Store badges, conditional on env vars (`SHOW_STORE_BADGES=true`) so we don't ship dead links during the gap between submission and approval.
- **F7.1.6** — `/changelog`: build-time read of `learnings.md`, filter to `🏁 Milestone` entries, render each as a card.

### Visual DoD
- Pasting `https://convoyfriends.app` into iMessage shows an OG card with the new hero video poster — and the link recipient says "is this live?"
- A side-by-side: V1 OG image vs V2. V2 makes V1 look like a coming-soon page (because it was).

### Risks & mitigations
- **Screenshots leak unfinished UI.** Mitigation: a hidden "screenshot mode" feature flag that uses a curated state. Vetted with the founder before publishing.
- **Video takes more than 5 days.** Mitigation: timebox to 1 day of capture + 1 day of edit. If we slip, ship without the video and add it later — the screenshots alone are enough.

### Out of scope
- Localization of the V2 site (F8).
- Press kit / blog / SEO content marketing. Defer.

---

## Phase F8 — Localization Front-End  *(1 week, parallel from F3 onward)*

### Goal
The marketing site and mobile app both ship with English, Tagalog, and Spanish. Switching language is a single tap; copy, dates, and number formatting all follow.

### Why front-end first
Localization is a front-end discipline up to the point of professional translation. We do all the structural work (string extraction, locale routing, RTL-readiness even if we don't ship RTL languages yet), then hand off the strings file to translators.

### Tasks
- **F8.1.1** — Extract every string into `packages/i18n/en.json`. **No string literal in any component file.** Lint rule enforces it.
- **F8.1.2** — Add `tl.json` and `es.json` skeletons populated with English fallbacks.
- **F8.1.3** — `<Trans>` component for both web and mobile, backed by `i18next`.
- **F8.1.4** — Locale-aware date and number formatting (Intl.* APIs).
- **F8.1.5** — Marketing site: locale-prefixed routes (`/`, `/tl`, `/es`), language switcher in the footer.
- **F8.1.6** — Mobile app: settings → language picker. Default to device locale.
- **F8.1.7** — Hand off `tl.json` and `es.json` for professional translation. Review with native speakers before merging.

### Visual DoD
- Tapping the language switcher to Tagalog flips every visible string within 200ms, with no layout shift.
- The Tagalog hero headline is checked by a native speaker and signed off in `progress.md`.

### Out of scope
- RTL language scaffolding. Defer until Arabic/Hebrew is a real ask.

---

## Cross-cutting front-end tracks

| Track | Cadence | What |
|---|---|---|
| **Storybook hygiene** | Continuous | Every new component lands with a story. PRs without one bounce. |
| **Visual regression** | Per PR | Chromatic / Loki snapshots block visual diffs. |
| **Accessibility audit** | End of every phase | axe-core for web, `react-native-a11y-tools` for mobile. Block phases on critical violations. |
| **Real-device testing** | Every Friday | iOS + Android, two devices. Run the latest preview build on a real drive — even a 10-minute one. Notes in `progress.md`. |
| **Token audits** | Bi-weekly | `grep` for raw hex, raw px, hardcoded font names. Replace with token references. |
| **Performance budget** | Per phase | Marketing: ≤120 KB JS, ≤200 KB CSS, ≤350 KB images on initial load. Mobile: cold start ≤2s on a 2-year-old Android. |

---

## What this plan does *not* cover

- The backend (`plan.md` covers this — Supabase, Edge Functions, Resend, LiveKit). This plan **assumes** the backend lands in parallel against the contracts the front-end stubs already define.
- DevOps / CI/CD details beyond "Cloudflare Pages with PR previews."
- Beta-ops automation (founder review pipeline, Discord onboarding, email sequencing) — handled in `plan.md` Phase 3.
- App Store + Play Store submission mechanics — handled in `plan.md` Phase 6.

If you only had this document and no other, **you could still ship a stunning, demoable, fully-clickable product** — just one with a stubbed backend underneath.

---

## Phase dependency graph (front-end perspective)

```
F0 (Tokens & UI) ─┬─► F1 (Marketing site V1)
                  │
                  ├─► F2 (App shell) ─► F3 (Onboarding) ─► F4 (Map)
                  │                                          │
                  │                                          ▼
                  │                                       F5 (Convoys)
                  │                                          │
                  │                                          ▼
                  │                                       F6 (Voice + ETA)
                  │                                          │
                  ▼                                          ▼
                F8 (i18n, parallel from F3) ───────────► F7 (Marketing V2)
```

F1 can run in parallel with F2–F6 once F0 ships. F7 is gated on F4–F6 because it needs a real app to screenshot. F8 piggybacks on every phase as strings are written.

---

## How to use this plan

1. **Pin yourself to a single Phase tab in your editor.** Don't context-switch between F2 and F5. The point of the phase boundary is to *finish* something.
2. **Reference task IDs in commits**: `F4.2.3: pulse animation on self-marker`.
3. **At every phase boundary**, take a 30-second screen recording of the new state. Drop it in `progress.md`. Future-you will thank present-you.
4. **`learnings.md` gets one entry minimum per phase.** Even if it's just "F0 Token: deciding NativeWind over StyleSheet was a 1-line decision; here's why we'd reconsider."
5. **If a phase's Visual DoD is fuzzy in your head, you're not ready to start it.** Re-read the DoD until you can describe what the screen looks like with your eyes closed.

---

*Companion docs: `project.md` (overview), `plan.md` (full-stack plan, including backend/ops/launch), `progress.md` (rolling log), `learnings.md` (decisions + milestones).*
