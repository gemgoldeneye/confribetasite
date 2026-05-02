/**
 * Spacing tokens — 4pt grid.
 *
 * Numeric keys map to multiples of 4px (Tailwind-style):
 *   spacing[2] === 8, spacing[6] === 24, etc.
 *
 * Use these for padding, margin, gap, and icon hit-target sizing.
 * Hit targets must be ≥ spacing[11] (44pt) for a11y.
 */

export const spacing = {
  0: 0,
  px: 1,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

export type Spacing = keyof typeof spacing;

/**
 * Minimum touch target on iOS HIG / Android Material — 44pt / 48dp.
 * Use as a floor for any tappable element.
 */
export const minTouchTarget = spacing[11];

/**
 * Page gutter — outer horizontal padding for content.
 * Matches the cfhandoff `.wrap { padding: 48px 28px 80px }`.
 */
export const gutter = {
  mobile: spacing[5],
  tablet: spacing[7],
  desktop: spacing[12],
} as const;
