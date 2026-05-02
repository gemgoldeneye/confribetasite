/**
 * build-theme.ts — generate `tailwind.css` from `@confri/tokens`.
 *
 * The output is the canonical Tailwind v4 theme for the ConvoyFriends web
 * surface. Consumers import it once:
 *
 *   @import "tailwindcss";
 *   @import "@confri/ui-web/tailwind";
 *
 * Tailwind v4 reads `@theme {}` blocks and generates utilities from the
 * CSS custom properties inside. Naming follows v4 conventions:
 *
 *   --color-*    → bg-*, text-*, border-*, ring-*, etc.
 *   --font-*     → font-*
 *   --text-*     → text-* (font-size, with optional --line-height)
 *   --spacing-*  → p-*, m-*, gap-*, etc.
 *   --radius-*   → rounded-*
 *   --shadow-*   → shadow-*
 *   --ease-*     → ease-*
 *
 * Source of truth: @confri/tokens. **Do not edit `tailwind.css` by hand.**
 * Regenerate with `pnpm --filter @confri/ui-web build:theme`.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  colors,
  duration,
  easing,
  elevation,
  fontFamily,
  fontSize,
  gradients,
  lineHeight,
  radii,
  spacing,
} from "@confri/tokens";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const OUTPUT = resolve(__dirname, "..", "tailwind.css");

/** camelCase → kebab-case. `brandMark` → `brand-mark`, `easeInOut` → `ease-in-out`. */
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const lines: string[] = [];

const banner = [
  "/* ============================================================ *",
  " *  GENERATED FILE — do not edit by hand.                        *",
  " *                                                               *",
  " *  Source: @confri/tokens                                       *",
  " *  Regenerate: pnpm --filter @confri/ui-web build:theme         *",
  " *                                                               *",
  " *  Tailwind v4 theme for the ConvoyFriends web surface.         *",
  " * ============================================================ */",
];
lines.push(...banner, "");

// ─── Theme block ───────────────────────────────────────────────
lines.push("@theme {");

// Colors — flatten the nested token tree to flat custom-property names
// that map cleanly onto Tailwind v4 utility classes.
const colorMap: Record<string, string> = {
  // Backgrounds
  "ground": colors.bg.ground,
  "surface": colors.bg.surface,
  "elevated": colors.bg.elevated,

  // Brand accents
  "cyan": colors.accent.cyan,
  "aqua": colors.accent.aqua,
  "teal": colors.accent.teal,

  // Status
  "amber": colors.status.amber,
  "warn": colors.status.warn,
  "success": colors.status.success,

  // Ink (text)
  "ink": colors.ink.primary,
  "ink-mute": colors.ink.mute,
  "ink-soft": colors.ink.soft,
  "ink-on-accent": colors.ink.onAccent,

  // Lines / borders
  "line-subtle": colors.line.subtle,
  "line-strong": colors.line.strong,
  "line-accent": colors.line.accent,

  // Glass surfaces
  "glass-wash": colors.glass.wash,
  "glass-hover": colors.glass.hover,
  "glass-tinted": colors.glass.tinted,
};

lines.push("  /* — Colors — */");
for (const [name, value] of Object.entries(colorMap)) {
  lines.push(`  --color-${name}: ${value};`);
}
lines.push("");

// Font families
lines.push("  /* — Font families — */");
lines.push(`  --font-display: "${fontFamily.display}", system-ui, sans-serif;`);
lines.push(`  --font-body: "${fontFamily.body}", system-ui, sans-serif;`);
lines.push(`  --font-mono: "${fontFamily.mono}", ui-monospace, monospace;`);
lines.push("");

// Font sizes (with paired line-heights where the textStyle pairs them)
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

// Spacing — 4pt grid
lines.push("  /* — Spacing (4pt grid) — */");
for (const [key, value] of Object.entries(spacing)) {
  lines.push(`  --spacing-${key}: ${value}px;`);
}
lines.push("");

// Radii
lines.push("  /* — Radii — */");
for (const [key, value] of Object.entries(radii)) {
  lines.push(`  --radius-${key}: ${value}${value === 0 ? "" : "px"};`);
}
lines.push("");

// Shadows (elevation)
lines.push("  /* — Shadows (elevation, color-tinted, never grey) — */");
for (const [key, recipe] of Object.entries(elevation)) {
  lines.push(`  --shadow-${kebab(key)}: ${recipe.css};`);
}
lines.push("");

// Easing curves
lines.push("  /* — Easing — */");
for (const [key, curve] of Object.entries(easing)) {
  lines.push(`  --ease-${kebab(key)}: ${curve.css};`);
}
lines.push("");

// Durations — exposed as raw custom properties for `transition-duration`
// utilities. Tailwind v4 doesn't have a first-class `--duration-*`
// namespace, so we expose them under a custom prefix for explicit use.
lines.push("  /* — Durations (ms) — */");
for (const [key, value] of Object.entries(duration)) {
  lines.push(`  --duration-${kebab(key)}: ${value}ms;`);
}
lines.push("");

lines.push("}");
lines.push("");

// ─── Custom utilities — gradients ──────────────────────────────
// Tailwind v4 doesn't auto-generate gradient utilities from theme
// custom properties. Define them as `@utility` blocks (v4 syntax) so
// consumers can use `bg-gradient-brand`, etc.
lines.push("/* — Brand gradients (v4 @utility) — */");
for (const [key, value] of Object.entries(gradients)) {
  lines.push(`@utility bg-gradient-${kebab(key)} {`);
  lines.push(`  background-image: ${value.css};`);
  lines.push("}");
}
lines.push("");

// ─── Footer ────────────────────────────────────────────────────
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
  Object.keys(duration).length +
  Object.keys(gradients).length;

console.log(`✓ wrote ${OUTPUT}`);
console.log(`  ${tokenCount} tokens emitted`);
