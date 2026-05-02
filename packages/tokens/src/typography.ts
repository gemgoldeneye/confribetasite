/**
 * Typography tokens.
 *
 * - Display: Sora — headlines, UI labels, brand moments.
 * - Body: Inter — long-form copy, form fields.
 * - Mono: JetBrains Mono — IDs, codes, reference strings.
 *
 * Consumers (ui-web, ui-mobile) own font *loading* — Google Fonts CDN
 * for web, expo-font for mobile. This module declares names + weights only.
 */

export const fontFamily = {
  display: "Sora",
  body: "Inter",
  mono: "JetBrains Mono",
} as const;

export type FontFamily = typeof fontFamily;

/**
 * Font weights, expressed as strings so they pass through to both
 * CSS `font-weight` and React Native `fontWeight` without coercion.
 */
export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

export type FontWeight = keyof typeof fontWeight;

/**
 * Type scale — sizes in px. Matches the cfhandoff.html lockup:
 * meta lines 12–13, body 14.5, lede 16.5, h2 22, h1 clamped 34→52.
 */
export const fontSize = {
  micro: 11,
  caption: 12,
  small: 13,
  body: 14.5,
  lede: 16.5,
  lg: 18,
  h3: 20,
  h2: 22,
  h1: 34,
  display: 52,
} as const;

export type FontSize = keyof typeof fontSize;

/**
 * Letter-spacing values. CSS uses em (multiplied by font size at render
 * time); React Native uses absolute px. Both are exported so each
 * platform can pick the correct unit.
 */
export const letterSpacing = {
  /** Headlines — Sora @ -0.025em looks right per cfhandoff. */
  tight: { em: -0.025 },
  /** Eyebrow / uppercase labels — wider tracking. */
  wide: { em: 0.14 },
  /** Body — system default. */
  normal: { em: 0 },
} as const;

export type LetterSpacing = keyof typeof letterSpacing;

/**
 * Line heights — unitless multipliers (CSS-friendly).
 */
export const lineHeight = {
  /** Display headlines — `h1` line-height 1.05. */
  display: 1.05,
  /** Section headings. */
  heading: 1.2,
  /** Tight body. */
  tight: 1.55,
  /** Default body. */
  body: 1.65,
  /** Looser body — used for the lede. */
  loose: 1.7,
} as const;

export type LineHeight = keyof typeof lineHeight;

/**
 * Composed roles — semantic styles that compose family + weight + size + tracking.
 * Use these in components rather than the atomic tokens above when possible.
 */
export const textStyles = {
  display: {
    family: fontFamily.display,
    weight: fontWeight.extrabold,
    size: fontSize.display,
    lineHeight: lineHeight.display,
    letterSpacing: letterSpacing.tight,
  },
  h1: {
    family: fontFamily.display,
    weight: fontWeight.extrabold,
    size: fontSize.h1,
    lineHeight: lineHeight.heading,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    family: fontFamily.display,
    weight: fontWeight.bold,
    size: fontSize.h2,
    lineHeight: lineHeight.heading,
    letterSpacing: { em: -0.015 },
  },
  h3: {
    family: fontFamily.display,
    weight: fontWeight.semibold,
    size: fontSize.h3,
    lineHeight: lineHeight.heading,
    letterSpacing: { em: -0.01 },
  },
  eyebrow: {
    family: fontFamily.display,
    weight: fontWeight.bold,
    size: fontSize.caption,
    lineHeight: lineHeight.heading,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  },
  lede: {
    family: fontFamily.body,
    weight: fontWeight.regular,
    size: fontSize.lede,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    family: fontFamily.body,
    weight: fontWeight.regular,
    size: fontSize.body,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  bodyStrong: {
    family: fontFamily.body,
    weight: fontWeight.semibold,
    size: fontSize.body,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  label: {
    family: fontFamily.display,
    weight: fontWeight.bold,
    size: fontSize.small,
    lineHeight: lineHeight.heading,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    family: fontFamily.body,
    weight: fontWeight.medium,
    size: fontSize.caption,
    lineHeight: lineHeight.heading,
    letterSpacing: letterSpacing.normal,
  },
  mono: {
    family: fontFamily.mono,
    weight: fontWeight.medium,
    size: fontSize.body,
    lineHeight: lineHeight.heading,
    letterSpacing: letterSpacing.normal,
  },
  monoLarge: {
    family: fontFamily.mono,
    weight: fontWeight.semibold,
    size: fontSize.h2,
    lineHeight: lineHeight.heading,
    letterSpacing: letterSpacing.normal,
  },
} as const;

export type TextStyle = keyof typeof textStyles;
