/**
 * build-theme.ts — generate `nativewind.css` from `@confri/tokens`.
 *
 * Mobile-flavored sibling of `@confri/ui-web/scripts/build-theme.ts`.
 * Same source of truth, different output: no `background-image` or
 * `@utility bg-gradient-*` blocks, since React Native cannot render
 * CSS gradients. Gradient surfaces in mobile components use
 * `expo-linear-gradient` directly with token color stops (see
 * `src/helpers/gradients.ts`).
 *
 * Consumers (apps/mobile in F2+) import this once at the app root:
 *
 *   @import "tailwindcss";
 *   @import "@confri/ui-mobile/nativewind";
 *
 * Then NativeWind v4's metro/babel pipeline picks up utility classes
 * used in components and applies the corresponding RN styles at runtime.
 *
 * Source of truth: @confri/tokens. **Do not edit `nativewind.css` by hand.**
 * Regenerate with `pnpm --filter @confri/ui-mobile build:theme`.
 */

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  colors,
  duration,
  easing,
  elevation,
  fontFamily,
  fontSize,
  lineHeight,
  radii,
  spacing,
} from "@confri/tokens";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "..", "nativewind.css");

/** camelCase → kebab-case. */
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const lines: string[] = [];

const banner = [
  "/* ============================================================ *",
  " *  GENERATED FILE — do not edit by hand.                        *",
  " *                                                               *",
  " *  Source: @confri/tokens                                       *",
  " *  Regenerate: pnpm --filter @confri/ui-mobile build:theme      *",
  " *                                                               *",
  " *  NativeWind v4 theme for the ConvoyFriends mobile surface.    *",
  " *  Mirrors @confri/ui-web/tailwind.css minus CSS-only           *",
  " *  features that don't translate to React Native:               *",
  " *    - linear-gradient() backgrounds (use expo-linear-gradient) *",
  " * ============================================================ */",
];
lines.push(...banner, "");

// ─── Theme block ───────────────────────────────────────────────
lines.push("@theme {");

// Colors — keep parity with the web token surface so utility classes
// like `bg-ground`, `text-ink-mute`, `border-line-strong` work
// identically across platforms.
const colorMap: Record<string, string> = {
  "ground": colors.bg.ground,
  "surface": colors.bg.surface,
  "elevated": colors.bg.elevated,

  "cyan": colors.accent.cyan,
  "aqua": colors.accent.aqua,
  "teal": colors.accent.teal,

  "amber": colors.status.amber,
  "warn": colors.status.warn,
  "success": colors.status.success,

  "ink": colors.ink.primary,
  "ink-mute": colors.ink.mute,
  "ink-soft": colors.ink.soft,
  "ink-on-accent": colors.ink.onAccent,

  "line-subtle": colors.line.subtle,
  "line-strong": colors.line.strong,
  "line-accent": colors.line.accent,

  "glass-wash": colors.glass.wash,
  "glass-hover": colors.glass.hover,
  "glass-tinted": colors.glass.tinted,
};

lines.push("  /* — Colors — */");
for (const [name, value] of Object.entries(colorMap)) {
  lines.push(`  --color-${name}: ${value};`);
}
lines.push("");

// Font families — RN renders these as `fontFamily` strings. The actual
// font files are loaded by the consuming app via expo-font.
lines.push("  /* — Font families — */");
lines.push(`  --font-display: "${fontFamily.display}";`);
lines.push(`  --font-body: "${fontFamily.body}";`);
lines.push(`  --font-mono: "${fontFamily.mono}";`);
lines.push("");

// Font sizes — RN ignores `--*--line-height` in v4 only when the value
// is unitless. NativeWind's interpreter treats unitless line-heights as
// multipliers and applies them as `lineHeight: size * multiplier`.
const fontSizePairs: Array<[string, number, number?]> = [
  ["micro", fontSize.micro, lineHeight.heading],
  ["caption", fontSize.caption, lineHeight.heading],
  ["small", fontSize.small, lineHeight.heading],
  ["body", fontSize.body, lineHeight.body],
  ["lede", fontSize.lede, lineHeight.body],
  ["lg", fontSize.lg, lineHeight.body],
  ["h3", fontSize.h3, lineHeight.heading],
  ["h2", fontSize.h2, lineHeight.heading],
  ["h1", fontSize.h1, lineHeight.heading],
  ["display", fontSize.display, lineHeight.display],
];
lines.push("  /* — Font sizes (with default line-heights) — */");
for (const [name, size, lh] of fontSizePairs) {
  lines.push(`  --text-${name}: ${size}px;`);
  if (lh !== undefined) {
    lines.push(`  --text-${name}--line-height: ${lh};`);
  }
}
lines.push("");

// Spacing — RN translates px → density-independent pixels. The 4pt
// grid maps cleanly because RN's density pipeline preserves intent.
lines.push("  /* — Spacing (4pt grid) — */");
for (const [key, value] of Object.entries(spacing)) {
  lines.push(`  --spacing-${key}: ${value}px;`);
}
lines.push("");

// Radii.
lines.push("  /* — Radii — */");
for (const [key, value] of Object.entries(radii)) {
  lines.push(`  --radius-${key}: ${value}${value === 0 ? "" : "px"};`);
}
lines.push("");

// Shadows — NativeWind v4 parses CSS box-shadow values into RN's
// shadowColor/shadowOffset/shadowRadius/shadowOpacity (iOS) and
// `elevation` (Android). Spread is approximated. Tinted shadows
// translate well; the visual fidelity isn't 100% but the *intent*
// (color, depth, softness) carries.
lines.push("  /* — Shadows (translated to RN shadow* + elevation) — */");
for (const [key, recipe] of Object.entries(elevation)) {
  lines.push(`  --shadow-${kebab(key)}: ${recipe.css};`);
}
lines.push("");

// Easing — used with NativeWind's `transition-timing-function` utilities.
lines.push("  /* — Easing — */");
for (const [key, curve] of Object.entries(easing)) {
  lines.push(`  --ease-${kebab(key)}: ${curve.css};`);
}
lines.push("");

// Durations.
lines.push("  /* — Durations (ms) — */");
for (const [key, value] of Object.entries(duration)) {
  lines.push(`  --duration-${kebab(key)}: ${value}ms;`);
}
lines.push("");

lines.push("}");
lines.push("");

// ─── No @utility gradient blocks ───────────────────────────────
// Web's `@utility bg-gradient-*` blocks are CSS-only (background-image:
// linear-gradient(...)) and have no React Native equivalent. Mobile
// gradient surfaces use `<LinearGradient>` from expo-linear-gradient,
// fed by `gradientToLinearGradientProps()` in `src/helpers/gradients.ts`.
lines.push("/* gradient utilities omitted — mobile uses <LinearGradient> directly */");
lines.push("");

lines.push(`/* Generated at ${new Date().toISOString()} */`);

const output = lines.join("\n") + "\n";
writeFileSync(OUTPUT, output, "utf8");

const tokenCount =
  Object.keys(colorMap).length +
  3 + // font families
  fontSizePairs.length +
  Object.keys(spacing).length +
  Object.keys(radii).length +
  Object.keys(elevation).length +
  Object.keys(easing).length +
  Object.keys(duration).length;

console.log(`✓ wrote ${OUTPUT}`);
console.log(`  ${tokenCount} tokens emitted (gradients deferred to <LinearGradient>)`);
