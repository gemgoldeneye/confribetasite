# ConvoyFriends — Learnings, Breakthroughs & Milestones

> The high-signal record. Not "what we did" (that's `progress.md`) but **what we learned** —
> insights, architectural decisions worth keeping, and the moments where the project leveled up.
>
> If a future contributor reads only one of these three docs, this should be the one that
> saves them from repeating mistakes.

---

## How to use this doc

Three categories of entry. Tag every entry with one.

- **🧠 Learning** — something we discovered (a constraint, a surprising user behavior, a tool quirk, a cost surprise). Include *what we expected*, *what actually happened*, and *what we'll do differently*.
- **🏛️ Decision** — an architectural or product call that has downstream cost to reverse. Include *the alternatives*, *the call*, and *the trade-off accepted*.
- **🏁 Milestone** — a concrete shipped artifact that unblocks new work (first form submission, first TestFlight build, first complete convoy run, etc.). Short and celebratory.

Entries go **newest first**. Date everything. Cross-link to `progress.md` and `plan.md` where useful.

---

## 2026-05-03

### 🏛️ Decision · NativeWind classes are the authoring layer for ui-mobile
**Context.** F0.3.2 needed a styling strategy. Tempting alternatives: `StyleSheet.create()` + tokens (RN-classic), inline `style={{...}}`, or NativeWind classnames. All would render correctly on a real device.

**Alternatives considered.**
1. `StyleSheet.create()` + `@confri/tokens`. RN-idiomatic, no NativeWind setup needed. But makes F0.3.1's `nativewind.css` (the theme generator we just shipped) infrastructure with no internal consumer.
2. NativeWind className authoring (chosen). Components like `<View className="bg-ground rounded-md p-4" />` consume the same vocabulary as web. The "One UI kit, two surfaces" principle in `frontend-plan.md` becomes load-bearing instead of aspirational.
3. Both, with `style` as escape hatch alongside `className`. Ended up here, but the *primary* authoring layer is `className`.

**Call.** NativeWind is the primary. `style` is accepted on every component as an escape hatch (consumers can pass platform-specific tweaks). The components don't bundle NativeWind themselves — apps/mobile (F2) wires the babel + metro plugins; until then, the components are typed and ready but unstyled at runtime in any environment without NativeWind.

**Trade-off accepted.** Components are unusable in raw RN environments without NativeWind setup. That's fine — every actual consumer is `apps/mobile`, which has NativeWind by definition. We're not optimizing for a portability-to-vanilla-RN that nobody asked for.

### 🏛️ Decision · Defer mobile Storybook to F2 instead of forcing react-native-web
**Context.** F0.3.2's spec literally says "in Storybook on-device (`@storybook/react-native`)". `@storybook/react-native` needs a host RN app. `apps/mobile` is the host. It doesn't exist yet — F2 builds it. The workaround would be `react-native-web` integration in the existing `apps/storybook`.

**Alternatives considered.**
1. Set up `@storybook/react-native` in a temporary `apps/mobile-storybook` host app. Fastest *interpretation* of the spec, but creates infra that gets thrown away when apps/mobile lands in F2.
2. `react-native-web` integration in the existing web Storybook. Requires NativeWind v4 + react-native-web + expo-linear-gradient web build + masked-view fallbacks + Vite config gymnastics — easily 2–3h of plumbing for a *preview* environment.
3. Defer Storybook wiring to F2. Components and stories exist as files; F2's Expo + NativeWind setup is the natural moment to point Storybook at them.

**Call.** Option 3 (advisor concurred). The deliverable redefines as "components + stories written, wiring deferred." This is honest with the spec — "on-device" literally requires a device.

**How to apply.** When a task spec assumes infrastructure that doesn't exist yet, name the deferral explicitly. Don't paper over it with workarounds whose maintenance cost outlives their usefulness.

### 🧠 Learning · `@types/react-native` shadows Node's `URL` global
**Found while running typecheck after installing RN peer deps.** A pre-existing, working `new URL(".", import.meta.url)` in `scripts/build-theme.ts` suddenly errored: *"Argument of type 'URL' is not assignable to parameter of type 'string | URL'. Type 'URL' is not assignable to type 'import("node:url").URL'."*

**Why.** `@types/react-native` (or one of its transitive deps) augments the global type space with a DOM-flavored `URL` constructor. With `lib: ["ES2022"]` (no DOM), the Node `URL` should win — but the augmentation layered on top creates a different `URL` shape that no longer satisfies `node:url`'s import.

**Fix.** Replace `fileURLToPath(new URL(".", import.meta.url))` with `dirname(fileURLToPath(import.meta.url))`. Same outcome, no global `URL` use, no resolution conflict.

**What we'll do differently.** Prefer `dirname(fileURLToPath(import.meta.url))` as the canonical "ESM equivalent of `__dirname`" idiom across this monorepo. It's robust against type-space pollution from RN/DOM packages.

### 🧠 Learning · CSS gradient angles → RN start/end is non-obvious
**Expected.** First pass at `gradientToLinearGradientProps()` used `mathAngle = 90 - cssAngle` and computed `dx = cos(rad), dy = -sin(rad)` from there. Looked plausible.

**Found while writing the test.** The output flipped y-axis on every non-horizontal gradient. CSS 92° (nearly horizontal, slight clockwise tilt) was producing start=(0, 0.5175) / end=(1, 0.4826) — gradient pointing *up-and-right* instead of *down-and-right*. Worse: CSS 180° (top→bottom) came out as bottom→top.

**Why.** Mixing two coord-system flips at once. CSS angles measure clockwise from up; screen y grows downward. The "subtract 90°" approach handled one flip; the `-sin` was supposed to handle the other; the two cancelled in some cases and double-applied in others.

**Fix.** One transform, not two. Use the angle directly in radians and compute the direction vector as `(sin θ, -cos θ)` — which fully encodes both conventions in one step:
```typescript
const rad = (angleDeg * Math.PI) / 180;
const dirX = Math.sin(rad);
const dirY = -Math.cos(rad);
```

**What we'll do differently.** Any conversion across coordinate systems: write the test cases first (90°/180°/0° at minimum), then write the formula to satisfy them. Ad-hoc trig is too easy to get wrong.

### 🏛️ Decision · One theme generator per platform package
**Context.** F0.2.1 shipped a generator in `packages/ui-web/scripts/build-theme.ts`. F0.3.1 needed the same shape for mobile, with two intentional omissions (no gradient utilities, simpler font-family fallbacks). Tempting to extract a shared `@confri/theme-codegen` package and have both consumers call into it.

**Alternatives considered.**
1. Shared codegen package. Cleanest in theory; saves ~80 lines of duplicated walking logic.
2. Codegen lives in `@confri/tokens` as a function. Violates the "tokens is pure data" rule from the F0.1.2 learnings.
3. **One generator per platform consumer** (chosen). ~120 lines duplicated, mostly identical, with platform-specific deltas in plain sight at the bottom of each file.

**Call.** Option 3. With two consumers, the shared package overhead (workspace + version + dep edge + type bridging) eats the savings. Each package owns its own theme output and its own decisions about what to include. The cost of duplication is bounded — any new token added to `@confri/tokens` requires touching both generators, and that's caught immediately because both packages run their generator in CI.

**Trade-off accepted.** If a third platform appears (web-extension? watchOS? React for desktop?), revisit. Three is the canonical "extract a shared module" threshold.

### 🏛️ Decision · Co-locate stories with components, devDep storybook in the lib
**Context.** F0.2.2 shipped 9 components in `packages/ui-web/src/components/<Name>/` with their stories alongside. Storybook itself lives in `apps/storybook/`. Pnpm's strict module resolution means a file at `packages/ui-web/src/components/Foo/Foo.stories.tsx` can't reach `@storybook/react` if it's only declared in `apps/storybook/node_modules/`.

**Alternatives considered.**
1. Move stories into `apps/storybook/stories/` (away from components). Eliminates the resolution problem, but breaks co-location and makes "find the story for this component" a navigation chore.
2. Use TypeScript path mappings or `shamefully-hoist=true` in `.npmrc` to make `@storybook/react` resolvable from anywhere. Too global, breaks the contract that each package declares its own deps.
3. Add `@storybook/react` + `@storybook/test` as **devDeps on `@confri/ui-web`** (chosen). Co-location preserved, pnpm resolution happy, the published lib is unaffected because Vite externalizes them and the dts plugin excludes story files.

**Call.** Option 3. Treat stories as production-of-the-design-system but dev-of-the-published-package. The lib's Vite build excludes them; the published surface is identical to what it would be without stories.

**How to apply.** Whenever a workspace adds co-located test/story/dev artifacts, the corresponding tooling deps belong on that workspace's devDeps. Don't try to centralize in a tooling-only workspace and rely on hoist.

### 🧠 Learning · Tailwind v4 cross-package content detection needs `@source`
**Expected.** Tailwind v4's automatic content detection would pick up utility classes used in `packages/ui-web/src/**/*.tsx` when consumed from `apps/storybook/`.

**Found.** It's flaky across pnpm symlinks. Sometimes detects, sometimes doesn't, and missed classes mean Storybook renders text on a black background with no styles applied. Symptoms are silent — no error, just unstyled output.

**What we'll do differently.** Explicit `@source` directives in any consumer's main.css that imports `@confri/ui-web/tailwind`:
```css
@source "../../../packages/ui-web/src/**/*.{ts,tsx}";
```
Cheap, deterministic, and self-documenting. Future apps (`apps/web`, etc.) should adopt the same pattern.

### 🏁 Milestone · The brand system is browseable
First moment a designer (or the founder) can open `pnpm --filter @confri/storybook dev` at `localhost:6006` and click through every brand primitive. **34 stories, 9 components, 9 autodocs pages.** This is the visual proof that F0 (Design Tokens & UI Foundation) is real.

### 🏛️ Decision · Tailwind v4 `@theme` CSS over v3 JS preset
**Context.** `frontend-plan.md` F0.2.1 spec says "Tailwind preset that consumes the tokens module." That phrasing comes from Tailwind v3, where you export a JS object that consumers extend in `tailwind.config.js`. Tailwind v4 (current) replaced that model with CSS-first `@theme {}` blocks consumers `@import` directly.

**Alternatives considered.**
1. Tailwind v3 + JS preset. Familiar, lots of examples, but means we're starting on a deprecating major.
2. Tailwind v4 + `@theme` CSS, generated from tokens at build time (chosen).
3. Tailwind v4 with a hand-maintained `@theme` block. Faster initially, but reintroduces the "parallel source of truth" problem the plan explicitly forbids.

**Call.** Option 2. The `scripts/build-theme.ts` generator imports from `@confri/tokens`, walks the values, and emits a flat `@theme { --color-*; --font-*; --text-*; --spacing-*; --radius-*; --shadow-*; --ease-*; }` block plus `@utility` rules for gradients. Consumers write `@import "tailwindcss"; @import "@confri/ui-web/tailwind";` once and get every brand utility.

**Trade-off accepted.** Slight version risk — Tailwind v4 is newer than v3. The mitigation is that the theme is plain CSS that any CSS-in-JS or PostCSS toolchain can also consume, so we're not painted into a Tailwind-only corner.

### 🏛️ Decision · Generator script over a static theme file
**Context.** Two ways to ship the Tailwind theme: (a) hand-write `tailwind.css` once, (b) generate it from tokens at build time.

**Call.** Generator. The whole reason the tokens package exists is "single source of truth" — a static `tailwind.css` would be a parallel source. The generator runs as `pnpm --filter @confri/ui-web build:theme`, takes ~50ms, and writes a banner at the top of the output: *"GENERATED FILE — do not edit by hand."*

**How to apply.** Any future change to brand tokens is a one-line PR in `packages/tokens/src/colors.ts` (or wherever) followed by `pnpm --filter @confri/ui-web build`. The Tailwind theme regenerates, all consumer utilities update, no manual sync needed.

### 🏛️ Decision · Tokens package is pure data, no platform helpers
**Context.** `@confri/tokens` (F0.1.2) needs to feed both web (Tailwind/Vite) and mobile (NativeWind/Expo). Tempting to embed platform helpers — e.g. an `expoLinearGradientProps()` export, or a `tailwindPlugin()` factory.

**Alternatives considered.**
1. **Pure data only** (chosen). Tokens emit hex strings, numbers, structured stops, and CSS strings. Consumers wrap them however they want.
2. **Multi-target with helper exports.** Faster onboarding for mobile/web packages, but creates a dep edge `tokens → expo-linear-gradient` (or `tailwindcss`) that violates the "tokens have zero runtime deps" promise.
3. **Separate packages per target** (`@confri/tokens-web`, `@confri/tokens-mobile`). Drift risk. We'd ship a brand bug the moment one side updates.

**Call.** Pure data. The tokens package only depends on TypeScript. Any platform-specific shaping happens in `ui-web` / `ui-mobile` adapter layers. If a downstream consumer ever finds itself reconstructing a gradient from primitives, that's a signal to add a *richer* token (e.g. a structured `LinearGradient` interface — which we did), not to add a helper.

**Trade-off accepted.** Each consumer writes ~10 lines of one-time adapter code (e.g. converting our `LinearGradient.stops` to `expo-linear-gradient` props). In return, the brand-system package never breaks because of an upstream tooling change.

### 🧠 Learning · Color-tinted shadows are non-negotiable
**Expected.** Elevation tokens would mix brand-tinted (for marketing/CTA) and neutral grey (for utility surfaces).

**Found while encoding `elevation.ts`.** The cfhandoff.html uses **only** brand-color-tinted shadows:
- `0 10px 30px -10px rgba(61,217,245,.55)` (cyan, on the brand mark)
- `0 14px 30px -14px rgba(43,196,168,.55)` (teal, on the CTA)
- `0 20px 40px -16px rgba(43,196,168,.5)` (teal, on the toast)

There's no neutral shadow anywhere. Adding one would be a brand violation that's hard to spot in code review (a shadow is just an rgba value) but obvious in screenshots.

**Implication.** The elevation token module ships *only* color-tinted recipes. There is no `elevation.subtleGrey` escape hatch. If a future component looks bad with a tinted shadow, the right fix is to use `elevation.flat` and rely on borders/contrast, not to introduce a neutral.

**Captured in code.** The module-level comment in `packages/tokens/src/elevation.ts` flags this rule for future contributors: *"Never use neutral grey shadows — they read as generic / off-brand against the night ground."*

### 🏁 Milestone · Design system is queryable from code
First moment a future component can call `tokens.colors.accent.cyan` instead of grepping `cfhandoff.html` for `#3DD9F5`. Every later phase compounds on this — F0.2.1 (ui-web) and F0.3.1 (ui-mobile) both consume this package, and the F2 mobile shell will pull from it on day one.

---

## 2026-05-02

### 🏛️ Decision · Documentation-first kickoff
**Context.** The founder handed over a single `cfhandoff.html` brief and asked for project docs + an intensive plan before any code.

**Alternatives considered.**
1. Jump straight to rebuilding `index.html` from the brief. Faster to feel productive, but commits the project to a stack and structure before we've thought about the mobile app, the backend, or the beta ops side.
2. Document first, plan second, code third (chosen).
3. Hybrid: minimal docs, then code, then revise docs.

**Call.** Document first. The product has a marketing site, a mobile app, a backend, an email pipeline, a Discord community, and a localization workstream. Five workstreams without a phased plan = scope drift. The 30 minutes spent on docs pays back the first time we have to say "no, that's Phase 4, not now."

**Trade-off accepted.** Visible progress on day one is paperwork, not pixels. Mitigated by making the plan concrete enough that Phase 1 starts the moment the docs are merged.

### 🧠 Learning · The handoff brief is marketing-complete but engineering-sparse
**Expected.** A handoff document for a pre-launch project would cover product *and* technical state.

**Found.** `cfhandoff.html` is excellent on **product, brand, and the landing page surface area** — but silent on:
- backend stack (none chosen),
- mobile stack (the actual app — the hard part — has zero specification),
- realtime architecture (live map, voice — both nontrivial),
- beta-ops automation (manual until proven otherwise),
- analytics / observability,
- Apple/Google account provisioning.

**Implication.** The "Beta Landing Page is built" item is the *easy 10%* of this project. The remaining 90% — the actual mobile app — has not been started or specified. The plan must reflect this. We should not let the polished landing page create a false sense that the project is more advanced than it is.

**What we'll do differently.** The phased plan in `plan.md` allocates the bulk of the effort to the mobile app (Phases 4–6), with the marketing/beta-ops side as the lighter Phases 1–3.

---

## Reserved sections (fill in as we go)

### 🏁 Milestones to look forward to
*Move these up into a dated entry the moment they happen.*

- [ ] First successful form submission to a real backend.
- [ ] First acceptance email received by a beta applicant.
- [ ] First 50 beta drivers in the VIP Discord.
- [ ] First "Hello world" mobile build on a real device (iOS).
- [ ] First "Hello world" mobile build on a real device (Android).
- [ ] First two-device live map sync (proof the realtime stack works).
- [ ] First multi-device voice room (proof the audio stack works).
- [ ] First end-to-end convoy run with the app, on a real road.
- [ ] First Tagalog + Spanish landing page live.
- [ ] First TestFlight invite sent to an external beta driver.
- [ ] First App Store + Play Store submission.
- [ ] First public launch.

### 🧠 Learning categories we expect to fill in
*Don't pre-write the entries — but here are the themes where breakthroughs typically land for a project of this shape, so you know what to watch for.*

- **Mapbox vs Google Maps** — pricing, night-mode styling, offline tiles, custom marker performance.
- **Realtime backends at convoy scale** — what does a 12-vehicle convoy actually cost in WebSocket fan-out?
- **Voice quality on cellular** — codec choice, jitter buffers, push-to-talk vs always-on.
- **Battery life** — GPS + voice + screen-on for 4–8 hour drives is a real engineering constraint.
- **Onboarding friction** — how long does it take a new beta driver to go from app-installed to in-convoy?
- **App Store review** — the first rejection always teaches something specific about the metadata, the privacy disclosures, or the demo account.
