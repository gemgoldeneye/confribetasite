# ConvoyFriends — Project Overview

> **Tagline:** *Drive together, navigate smarter.*
> **Public site:** https://convoyfriends.app
> **Stage:** Pre-launch · Beta program open · Capped at 300 founding drivers
> **Last updated:** 2026-05-02

---

## 1. What Is ConvoyFriends?

ConvoyFriends is a **mobile-native road-trip companion app** (iOS + Android) that keeps groups of friends connected, coordinated, and safe while driving in convoy. It solves the recurring problem every group road trip suffers from: someone falls behind, somebody misses an exit, the group fragments, and the trip turns into a logistics-by-text-message disaster.

The product is **night-mode-native, built for the road**, and designed to feel like a co-pilot the whole convoy shares.

---

## 2. Core Feature Set

| Feature | Description | Status |
|---|---|---|
| **Live Convoy Map** | Real-time location of every driver in the group, on a single shared map. | Not built |
| **In-Trip Voice Chat** | Always-on, push-to-talk-optional group voice channel. Walkie-talkie style. | Not built |
| **Smart Re-Routing** | If a driver falls behind, the lead car's nav adapts (suggest pull-over, slow down, alt route). | Not built |
| **Synchronized Pit Stops** | Group can vote/coordinate fuel/food/restroom stops in one tap. | Not built |
| **Group ETA** | One unified ETA for the slowest car, not per-device. | Not built |
| **Beta Landing Page** | Marketing site + application form for the 300-driver beta. | Built (index.html, separate from this folder) |

---

## 3. Audience

Five primary personas, ranked by how strongly they pull on the product:

1. **Motorcycle riders** — group rides are the highest-friction case; voice chat + map alone is a killer feature.
2. **Supercar owner groups** — meets, canyon runs, club drives. Aesthetic-conscious, pay for premium.
3. **Overlanding crews** — off-grid, multi-vehicle expeditions; need offline maps + low-bandwidth coordination.
4. **RV / bus tour drivers** — long-haul, slow-paced; group ETA and pit stop sync matter most.
5. **General road-trippers** — friends-of-friends, mixed vehicles, casual weekend trips. Largest TAM, lowest urgency.

---

## 4. Brand System

Pulled from the founder's headline lockup. Authoritative — do not invent new colors or fonts.

### Colors
| Token | Hex | Use |
|---|---|---|
| Night ground | `#050B16` | Page background |
| Navy surface | `#0A1628` | Card surfaces |
| Deep navy | `#0F1E36` | Elevated surfaces |
| Cyan accent | `#3DD9F5` | Primary highlight |
| Teal accent | `#2BC4A8` | Secondary highlight |
| Brand gradient | `linear-gradient(92deg, #3DD9F5 0%, #34D2C7 48%, #2BC4A8 100%)` | Buttons, eyebrow rules, headline accents |
| Ink (white) | `#F5F8FF` | Primary text |
| Ink mute | `#9AA8C2` | Secondary text |
| Ink soft | `#6B7891` | Tertiary text |

**Rule:** Cyan→teal gradient is for **accents only** — never on large surfaces. Background stays dark navy. The brand is night-mode native.

### Typography
- **Display:** Sora, weights 700/800, letter-spacing `-0.025em` — headlines, UI labels.
- **Body:** Inter, weights 400/500, line-height 1.55–1.7.
- **Mono:** JetBrains Mono — IDs, codes, reference strings.

### Component vocabulary
- Rounded radii: **12–24px**.
- Soft inner highlights, **glass-card translucency** on navy surface.
- Borders: `rgba(255,255,255,.08)` (subtle), `rgba(255,255,255,.16)` (strong).
- Shadows: long, low-opacity, color-tinted by accent (e.g. `0 14px 30px -14px rgba(43,196,168,.55)`).

### Voice
Confident, road-trip-coded, friendly but not chummy. Crew language, not influencer language. *"Drive together, navigate smarter."*

---

## 5. Beta Application Schema

All fields required. Validation runs on submit. Success state generates a `CF-XXXXXX` reference code (6 digits).

| Field | Type | Detail |
|---|---|---|
| `name` | text | Full Name |
| `location` | text | City, Region/Country |
| `email` | email | standard regex |
| `phone` | tel | ≥7 digits |
| `device` | radio (segmented) | iPhone \| Android |
| `vehicle` | radio (pill grid) | Motor \| Car \| Supercar \| Truck \| Bus |
| `dream` | textarea | "If you had a weekend convoy trip, where would you go and how many friends?" |

---

## 6. Repository Layout (current + planned)

```
confri/
├── cfhandoff.html         # original handoff brief (source of truth for this doc)
├── project.md             # this file
├── progress.md            # rolling progress log
├── learnings.md           # breakthroughs, milestones, decisions
├── plan.md                # intensive execution plan (companion to this doc)
└── (future)
    ├── web/               # marketing site + beta landing
    │   └── index.html
    ├── mobile/            # iOS + Android app (stack TBD)
    ├── backend/           # form submission, auth, realtime
    └── ops/               # email templates, Discord automation, localization
```

> `index.html` (the beta landing page described in cfhandoff.html) was built in a prior session and is not yet in this directory. **First action item:** locate and import it, or rebuild from the brief.

---

## 7. Technical Direction (proposed, not committed)

### Mobile
- **React Native (Expo)** — fastest path to iOS + Android parity, large ecosystem for maps + audio.
- Alternative: **Flutter** if the team has stronger Dart background.
- Native-only is rejected for MVP — would double the build cost without a clear product reason at this stage.

### Maps
- **Mapbox GL Native** (via `@rnmapbox/maps`) — best night-mode styling, custom layers for convoy markers, offline tile caching for overlanders.
- Google Maps SDK as fallback.

### Realtime
- **Supabase Realtime** or **PartyKit** for live location broadcast (room-per-convoy model).
- **LiveKit** or **Daily.co** for voice rooms.

### Backend
- **Supabase** — Postgres + Auth + Realtime + Storage in one. Lowest infra overhead for an MVP.
- Edge functions for application form processing and email triggers.

### Email
- **Resend** for transactional (acceptance, waitlist, onboarding sequences).
- React Email for templates so the brand system survives across mediums.

### Beta ops
- **Discord** for the 300 founding drivers (founder VIP channel).
- **Notion** or **Airtable** as the application CRM until volume justifies more.

> All of the above is a **default starting point**. Every choice is reversible until we ship. Re-evaluate at each phase boundary in `plan.md`.

---

## 8. Open Questions (to resolve before Phase 2)

1. Does the founder have a backend stack preference, or are we greenfield?
2. Is there an existing Figma file for the mobile app, or only the marketing site?
3. Who owns the beta application review pipeline — automated, manual, or hybrid?
4. Are Tagalog and Spanish localizations needed at launch, or post-launch?
5. What's the budget envelope for paid services (Mapbox, LiveKit, Resend)?
6. Apple Developer + Google Play accounts — already provisioned?

---

## 9. Success Criteria

The project is on track when:

- [ ] Beta landing page is live, the form submits to a real backend, and applications land in a reviewable queue.
- [ ] Acceptance + waitlist email templates are designed, tested, and sending.
- [ ] First 50 beta drivers are onboarded into the VIP Discord with welcome flow.
- [ ] Mobile app MVP (live map + voice + group ETA) is on TestFlight + Internal Testing.
- [ ] At least one full convoy run has been completed end-to-end with the app.
- [ ] Tagalog + Spanish translations exist for the marketing site.
- [ ] Real product screenshots have replaced the SVG phone mock on the landing page.

---

*See `progress.md` for the rolling log of what has been done.
See `learnings.md` for breakthroughs and architectural decisions worth keeping.
See `plan.md` for the phased execution plan.*
