# ConvoyFriends — Progress Log

> A rolling, append-only log of what was actually shipped, when, and by whom.
> Entries go **newest first**. Keep them concrete: file paths, PR-style summaries, dates.
> If a task slips or is reversed, log it here too — this is the truth, not the wishlist.

**Legend**
`✅` Done · `🟡` In progress · `🔵` Designed, not started · `⚠️` Blocked · `❌` Reversed/abandoned

---

## 2026-05-03 — F0.3.2 Mobile primitives shipped

### ✅ Nine RN components mirror the web kit
Built in `packages/ui-mobile/src/components/`:

| Component | RN substrate | Notes |
|---|---|---|
| `BrandMark` | `<View>` + `<LinearGradient>` + `react-native-svg` | chip / glyph variants identical to web |
| `GradientText` | `<MaskedView>` + `<LinearGradient>` + `<Text>` | substitutes for web's `bg-clip:text` |
| `Button` | `<Pressable>` + `<LinearGradient>` (primary) | onPress vs onClick; scale on press; cva variants |
| `Card` | `<View>` + `<LinearGradient>` (glass) | accentRule top hairline via thin `<LinearGradient>` |
| `Input` | `<TextInput>` + `<View>` wrapper | useState-tracked focus replaces `:focus-within` |
| `Textarea` | `<TextInput multiline>` | `rows` → `numberOfLines` |
| `RadioPill` | `<Pressable>` map | manual selection state, brand-mark shadow on selected |
| `RadioSegment` | `<Pressable>` map + `<LinearGradient>` | active segment carries the gradient |
| `Toast` | `<Animated.View>` + `<LinearGradient>` | slide-up via `Animated.timing` with `Easing.bezier` matching `--ease-spring` |

**Naming + prop parity** with the web kit is preserved. Only platform-mandated substitutions differ (`onPress`, `<Pressable>`, RN style API). Variant vocabulary (`primary` / `ghost` / `icon`, `glass` / `glassElevated` / `solid`, sizes, options) is identical.

### ✅ Helpers extended
- `elevationToRNStyle(key)` — translates `@confri/tokens` shadow recipes into RN `shadowColor` / `shadowOffset` / `shadowOpacity` / `shadowRadius` (iOS) + `elevation` (Android). Strips rgba alpha into `shadowOpacity` since iOS multiplies them otherwise. **8 runtime checks pass** including alpha-strip, blur halving for shadowRadius, and cyan-vs-teal tint preservation.
- `gradientToLinearGradientProps()` tightened to return `readonly [string, string, ...string[]]` tuples — expo-linear-gradient v14 enforces tuple-of-≥-2 types.

### ✅ Nine stories written (deferred from running)
Co-located with each component (`<Name>.stories.tsx`). Use `@storybook/react`-style `Meta`/`StoryObj` types so they're trivially wireable to either `@storybook/react-native` (on-device) or a `react-native-web` Storybook later.

### Decisions made
- **NativeWind className over StyleSheet.create.** Per advisor consult. F0.3.1's whole point was generating `nativewind.css` from tokens — using `StyleSheet` would invalidate that work and break the "one UI kit, two surfaces" principle. Components accept `className` (consumed by NativeWind on real device) plus `style` as an escape hatch. Apps/mobile (F2) will wire the NativeWind babel + metro plugins.
- **Storybook integration deferred to F2.** `@storybook/react-native` requires an RN host app; we don't have one until F2 builds `apps/mobile`. The `react-native-web` workaround (Vite + NativeWind v4 + masked-view + expo-linear-gradient web build) is a 2-3 hour rabbit hole for a preview environment. Components and stories exist as files, ready to wire with one config change in F2.
- **All RN peers installed as devDeps on ui-mobile.** Same pattern as the F0.2.2 storybook-types resolution fix. With pnpm strict resolution, components importing `react-native`, `expo-linear-gradient`, etc. only typecheck if those packages are reachable from the file's location.

### Carried over to next session
- [ ] **F0.4.1** — Visual regression: capture Chromatic/Loki snapshots of every web story so PRs are gated on visual diffs. Mobile stories ride along once F2 lands.
- [ ] **F1** — Marketing site in repo, perfect Lighthouse, Cloudflare Pages deploy.
- [ ] **F2.1** — Scaffold `apps/mobile` (Expo Router). At that point, hook up NativeWind config + wire in the existing mobile stories.

---

## 2026-05-03 — F0.3.1 ui-mobile scaffolded with NativeWind theme

### ✅ `@confri/ui-mobile` package created, theme + helpers ready
- `packages/ui-mobile/` — TypeScript-only library (Bundler module resolution, react-jsx, noEmit). Same scaffolding shape as `ui-web` minus Vite (mobile components are consumed as source by Metro/Expo, not pre-bundled).
- `scripts/build-theme.ts` reads `@confri/tokens` and emits `nativewind.css` — **77 tokens** in the same `@theme {}` shape as the web theme.
- `nativewind.css` is byte-equivalent to `@confri/ui-web/tailwind.css` for the theme block. The four web-only `@utility bg-gradient-*` blocks are intentionally omitted — RN can't render `background-image: linear-gradient(...)`.
- `src/helpers/gradients.ts` — typed `gradientToLinearGradientProps()` + pre-computed `brandGradientProps` adapter for `expo-linear-gradient`. Type-only signature (no runtime dep on `expo-linear-gradient`), so the package installs in projects that don't ship gradients.
- `peerDependencies` declared (not installed) for `react`, `react-native`, `nativewind`, `tailwindcss`, plus optional peers `expo-linear-gradient` and `react-native-svg` (will be required by F0.3.2 components but optional for the package itself).
- Subpath exports: `.` (components, F0.3.2), `./nativewind` (CSS), `./helpers` (RN adapters).

### Decisions made
- **One generator per platform package, not a shared codegen.** ui-web and ui-mobile each have their own `scripts/build-theme.ts`. The duplication is ~120 lines, mostly identical. Refactoring into a shared `@confri/theme-codegen` package wins ~80 lines but adds a workspace and a dep edge — not worth it for two consumers. Revisit if a third platform appears.
- **Mobile theme drops gradient utilities entirely.** No `@utility bg-gradient-*` blocks. Components use `<LinearGradient>` from `expo-linear-gradient` directly, fed by the `gradientToLinearGradientProps()` helper. This keeps the theme CSS RN-honest — every utility class in `nativewind.css` actually does something on mobile.
- **`expo-linear-gradient` is an optional peer.** Listed in `peerDependenciesMeta` as optional. The helper exports types but doesn't import the runtime, so consumers without gradients (unlikely but possible) don't get peer warnings.
- **Library exports source, not built output.** `main: ./src/index.ts`, no Vite/tsc bundle. Metro and the Expo bundler handle TypeScript natively, so pre-bundling is wasted work. `tsc --noEmit` for the typecheck is enough.

### Carried over to next session
- [ ] **F0.3.2** — Build the same nine primitives in mobile flavor: `BrandMark`, `GradientText`, `Button`, `Card`, `Input`, `Textarea`, `RadioPill`, `RadioSegment`, `Toast`. Mirror web prop signatures except for unavoidable substitutions (`onPress` vs `onClick`, `<Pressable>` vs `<button>`, `<MaskedView>` + `<LinearGradient>` for gradient text, `react-native-svg` for the brand mark). Storybook on-device with `@storybook/react-native`.

---

## 2026-05-03 — F0.2.2 Web primitives + Storybook live

### ✅ Nine primitives shipped, every one storied
Built in `packages/ui-web/src/components/` (one folder per component, co-located stories):

| Component | Variants / props of note |
|---|---|
| `BrandMark` | `chip` (gradient + shadow lockup) / `glyph` (currentColor SVG) |
| `GradientText` | `as=` polymorphic, `gradient=brand|brandVertical`, bg-clip text |
| `Button` | `primary` / `ghost` / `icon`, sizes `sm`/`md`/`lg`, hover lift, focus ring, disabled |
| `Card` | `glass` / `glassElevated` / `solid`, padding scale, accentRule top hairline |
| `Input` | label, hint, error, leadingIcon, focus-within ring tint, aria-describedby wired |
| `Textarea` | label, hint, error, resize-y, focus tint matches Input |
| `RadioPill` | generic over option type, controlled + uncontrolled, vehicle picker shape |
| `RadioSegment` | iPhone/Android-style segmented control, gradient on active segment |
| `Toast` | role=status, slide-up via spring easing token, parent-controlled visibility |

### ✅ Storybook scaffolded at `apps/storybook`
- Storybook 8.x + Vite + Tailwind v4 plugin. Stories glob: `../../packages/ui-web/src/**/*.stories.@(tsx|ts)`.
- `.storybook/preview.tsx`: brand-themed docs panel (dark, cyan/teal accents), three brand-coherent background swatches (Night ground / Navy surface / Deep navy), centered layout default.
- `src/main.css`: imports Google Fonts (Sora + Inter + JetBrains Mono per cfhandoff), `@import "tailwindcss"`, `@import "@confri/ui-web/tailwind"`, plus an explicit `@source` directive pointing at the cross-package component folder so Tailwind v4 finds utility usage.
- `pnpm --filter @confri/storybook build` produces `storybook-static` with **34 stories + 9 autodocs pages** in 3s.
- Workspace-wide `pnpm typecheck` clean.

### Decisions made
- **Stories co-located with components, types resolved by adding storybook to ui-web devDeps.** Pnpm's strict resolution wouldn't let `packages/ui-web/src/.../*.stories.tsx` find `@storybook/react` from `apps/storybook/node_modules/`. Adding `@storybook/react` + `@storybook/test` as ui-web devDeps fixes resolution without polluting the published surface (Vite externalizes everything, dts-plugin excludes stories).
- **`cva` (class-variance-authority) for variant APIs.** Tiny (1.1 kB), tree-shakeable, ergonomic in TypeScript, standard in shadcn-style kits. Picked over hand-rolled prop-to-class lookups.
- **All deps externalized in the Vite library build.** `react`, `react-dom`, `clsx`, `class-variance-authority`, and `@confri/*` are all `external` in `rollupOptions`. The bundle is just our code; consumers' bundlers resolve everything else.
- **`@source` directive in Storybook's main.css.** Tailwind v4 auto-detects content but cross-package detection across pnpm symlinks is unreliable. Explicit `@source "../../../packages/ui-web/src/**/*.{ts,tsx}"` removes any guessing.

### Carried over to next session
- [ ] **F0.3.1** — `packages/ui-mobile/`: React Native + NativeWind. Same component names, same prop signatures where physically possible. NativeWind preset that consumes `@confri/tokens` directly.
- [ ] **F0.3.2** — Same nine primitives in mobile flavor, with `@storybook/react-native` stories.
- [ ] **F0.4.1** — Visual regression: capture Chromatic/Loki baselines for the web stories so future PRs are gated on visual diffs.

---

## 2026-05-03 — F0.2.1 ui-web scaffolded with token-driven Tailwind theme

### ✅ `@confri/ui-web` skeleton + Tailwind v4 theme generator
- `packages/ui-web/` set up: TypeScript (Bundler resolution, JSX react-jsx), Vite library mode, vite-plugin-dts for `.d.ts` emission.
- `scripts/build-theme.ts` reads `@confri/tokens` and emits `tailwind.css` at the package root — **81 design tokens** across colors, font families, font sizes (with line-height pairs), spacing, radii, shadows, easing curves, durations, and gradients.
- Output uses Tailwind v4 `@theme {}` for the value bag plus `@utility bg-gradient-*` blocks for the brand gradients (v4 doesn't auto-generate gradient utilities from `@theme`).
- Subpath export `./tailwind` → consumers do `@import "@confri/ui-web/tailwind"` after their Tailwind import. Single source of truth: zero raw hex in the theme that doesn't trace back to the tokens module.
- Vite library build externalizes React + `@confri/*` so consumers' versions win. `dist/index.js` (0.11 KB) re-exports `tokens` for the convenience case.
- Workspace-level `pnpm typecheck` clean. Full `pnpm --filter @confri/ui-web build` runs theme + Vite in 465ms.

### Decisions made
- **Tailwind v4 CSS-first, not v3 JS preset.** The frontend-plan.md called for a "Tailwind preset" — that's the v3 vocabulary. In v4 the equivalent is a shareable CSS file with `@theme {}`. Same outcome, less Node-config plumbing. See `learnings.md`.
- **Generated `tailwind.css` lives at the package root, not in `dist/`.** The root `.gitignore` excludes `dist/`, but the theme CSS is the package's *public* surface — easier to commit at the package root than to add a per-file negation to `.gitignore`.
- **Dropped fractional spacing keys** (`0.5`, `1.5`) from `@confri/tokens`. CSS custom-property names can't contain dots, and the workaround names (`spacing-0_5`) would have produced ugly utility classes (`p-0_5`). If we need finer than 4px, we can introduce them with proper names later.
- **`kebab(camelCase)` in the build script.** Source tokens like `brandMark` and `easeInOut` are ergonomic in TypeScript but become `--shadow-brand-mark` / `--ease-ease-in-out` in CSS so Tailwind utilities (`shadow-brand-mark`, `ease-ease-in-out`) read cleanly.

### Carried over to next session
- [ ] **F0.2.2** — First batch of web primitives in `packages/ui-web/src/components/`: Button, Card, Input, Pill, RadioPill, RadioSegment, Toast, GradientText, BrandMark.
- [ ] Wire up `apps/storybook` so each primitive has a story and visual regression baseline. (Per F0.4.1.)

---

## 2026-05-03 — F0.1.2 Tokens package shipped

### ✅ `@confri/tokens` is the design-system source of truth
- `packages/tokens/` — 8 source modules: `colors`, `gradients`, `typography`, `radii`, `spacing`, `motion`, `elevation`, `index`.
- Encodes every value from `project.md` §4 plus the F6-required status colors (amber `#F2B26B`, warn `#F26B6B`) and a full motion/elevation system.
- Compiled with `tsc` to `dist/` — emits `.js`, `.d.ts`, source maps, declaration maps. Subpath exports configured (`@confri/tokens/colors`, `/gradients`, etc.) so consumers can pick the most specific import path.
- Zero runtime dependencies. Pure declarative data — no platform-specific helpers leak in here (those belong in `ui-web` / `ui-mobile`).
- 14-point runtime sanity check passes: hex values, gradient CSS, radii, spacing, easing curves, and composed textStyles all match source-of-truth values byte-for-byte.
- Workspace-level `pnpm typecheck` passes.

### Decisions made
- **`NodeNext` module resolution + `.js` import extensions in source.** Universal — works in Node ESM, Vite, Metro, Tailwind config (which runs in Node). Trade-off: a little uglier than barrel-style imports, but eliminates "where will this be consumed" guessing.
- **Tokens are pure data; no platform helpers.** No `expo-linear-gradient`-shaped exports, no Tailwind-shaped exports. Consumers (ui-web, ui-mobile, the future Tailwind preset) build their own adapters from the raw tokens.
- **Two-tier API: atomic tokens + composed `textStyles`.** Components can reach for `textStyles.h1` or compose from `fontFamily.display + fontSize.h1` themselves. Semantic when possible, atomic when needed.
- **Color-tinted shadows only.** Elevation recipes are tinted with brand teal/cyan, never neutral grey — see `learnings.md` for why.

### Carried over to next session
- [ ] **F0.2.1** — `packages/ui-web/`: Vite library + Tailwind preset that *consumes* tokens (single source of truth, no parallel hex values in tailwind config).
- [ ] **F0.2.2** — Build the first batch of web primitives (Button, Card, Input, Pill, Toast, GradientText, BrandMark) in Storybook.

---

## 2026-05-03 — F0.1.1 Monorepo initialized

### ✅ pnpm workspace scaffolded
- Root `package.json` with workspaces (`apps/*`, `packages/*`), `packageManager: pnpm@10.33.0`, Node ≥20 engine pin.
- `pnpm-workspace.yaml` mirrors the workspace globs (pnpm reads YAML, not the package.json field).
- `.npmrc` with `engine-strict=true`, `auto-install-peers=true`, `shared-workspace-lockfile=true`.
- `.gitignore` covering Node, pnpm, Expo, Next, iOS/Android native, secrets, editors, OS artifacts, Storybook outputs.
- `.env.example` enumerating future secrets (Supabase, Mapbox, Resend, LiveKit, Discord, Plausible) — phase-tagged so it's clear when each one starts mattering.
- `apps/` and `packages/` exist with `.gitkeep` placeholders.
- `pnpm install` resolves cleanly: `convoyfriends@0.0.0` is the only package recognized so far.

### Decisions made
- **pnpm over Bun.** Bun isn't installed on the machine; pnpm 10.33.0 is. The plan accepts either. No reason to add a tooling dependency before code exists.
- **`shared-workspace-lockfile=true`.** Single root lockfile so every workspace agrees on dep versions.

### Carried over to next session
- [ ] **F0.1.2** — `packages/tokens/` with the brand system encoded as TypeScript (colors, gradients, radii, spacing, typography, motion, elevation).
- [ ] **F0.2.1** — `packages/ui-web/` Vite library shell + Tailwind preset that consumes tokens.
- [ ] Out-of-band: `git init` + push to a private GitHub repo (`P0.1.1` from `plan.md`). Optional but recommended before the first package lands.

---

## 2026-05-02 — Project kickoff

### ✅ Project documentation scaffolded
- Read `cfhandoff.html` — the founder's handoff brief covering product, audience, brand system, beta landing page, and form schema.
- Created `project.md` (overview, brand system, schema, tech direction, open questions, success criteria).
- Created `progress.md` (this file).
- Created `learnings.md` (breakthroughs + milestones).
- Created `plan.md` (intensive phased execution plan).

### 🔵 Inventory taken — what exists vs. what doesn't
**Exists (claimed in brief):**
- Beta landing page (`index.html`) — sections: hero, benefits, application form, how it works, footer.
- Brand system — colors, typography, voice.
- Form schema — name, location, email, phone, device, vehicle, dream.
- Public domain (convoyfriends.app).

**Does NOT exist in this folder yet:**
- The actual `index.html` file. Only `cfhandoff.html` is here.
- Any backend code.
- Any mobile app code.
- Any email templates.
- Any Discord onboarding automation.
- Localizations (Tagalog, Spanish).

### ⚠️ Open blockers (need founder input)
- Locate or rebuild `index.html` (the beta landing page).
- Confirm backend stack preference (Supabase proposed).
- Confirm mobile stack preference (React Native + Expo proposed).
- Provision: Apple Developer account, Google Play account, Mapbox key, Resend key, Supabase project.

---

## Template for future entries

Copy-paste this when adding a new dated section. Keep entries **factual**, not aspirational.

```
## YYYY-MM-DD — One-line summary

### ✅ / 🟡 / ⚠️  Headline
- What changed (file paths, commit refs, links).
- Why it changed (link to `learnings.md` if it earned a breakthrough entry).
- What it unblocks for the next phase.

### Decisions made
- Decision · alternatives considered · why we picked this. (Move to `learnings.md` if it's load-bearing.)

### Carried over to next session
- [ ] Concrete next action.
```
