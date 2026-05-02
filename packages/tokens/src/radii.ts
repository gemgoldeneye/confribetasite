/**
 * Border-radius tokens — px values.
 *
 * Component vocabulary from project.md §4: rounded radii 12–24px is the
 * brand sweet spot. Outside that range needs a justification.
 */

export const radii = {
  /** Square corners. Use sparingly — the brand is friendly, not industrial. */
  none: 0,
  /** Small chips, tags, segmented controls. */
  sm: 8,
  /** Inputs, buttons, compact cards. **Brand floor: 12px.** */
  md: 12,
  /** Standard cards. */
  lg: 16,
  /** Sectioned cards (`section.block`). */
  xl: 20,
  /** Hero cards, intro panels. **Brand ceiling: 24px.** */
  xxl: 24,
  /** Pills, fully-round chips, dot indicators. */
  pill: 999,
} as const;

export type Radius = keyof typeof radii;
