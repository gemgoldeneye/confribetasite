/**
 * @confri/tokens — single source of truth for the ConvoyFriends design system.
 *
 * Re-exports every token group. Consumers should pick the most specific
 * import path possible:
 *
 *   import { colors } from "@confri/tokens/colors";
 *   import { gradients } from "@confri/tokens/gradients";
 *
 * The barrel below exists for convenience and Storybook.
 */

export { colors } from "./colors.js";
export type { Colors } from "./colors.js";

export { gradients } from "./gradients.js";
export type { Gradients, GradientName, GradientStop, LinearGradient } from "./gradients.js";

export {
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  lineHeight,
  textStyles,
} from "./typography.js";
export type {
  FontFamily,
  FontWeight,
  FontSize,
  LetterSpacing,
  LineHeight,
  TextStyle,
} from "./typography.js";

export { radii } from "./radii.js";
export type { Radius } from "./radii.js";

export { spacing, minTouchTarget, gutter } from "./spacing.js";
export type { Spacing } from "./spacing.js";

export { duration, easing, transition } from "./motion.js";
export type { Duration, Easing, Transition } from "./motion.js";

export { elevation } from "./elevation.js";
export type { Elevation, ShadowRecipe } from "./elevation.js";

import { colors } from "./colors.js";
import { gradients } from "./gradients.js";
import { fontFamily, fontWeight, fontSize, letterSpacing, lineHeight, textStyles } from "./typography.js";
import { radii } from "./radii.js";
import { spacing, minTouchTarget, gutter } from "./spacing.js";
import { duration, easing, transition } from "./motion.js";
import { elevation } from "./elevation.js";

/**
 * The full token set as a single object. Useful for Storybook
 * theme objects, Tailwind config consumption, or anywhere a single
 * `theme` import is more ergonomic than seven.
 */
export const tokens = {
  colors,
  gradients,
  typography: {
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    lineHeight,
    textStyles,
  },
  radii,
  spacing,
  minTouchTarget,
  gutter,
  motion: {
    duration,
    easing,
    transition,
  },
  elevation,
} as const;

export type Tokens = typeof tokens;
