/**
 * Translate `@confri/tokens` elevation recipes into the React Native
 * `shadow*` + `elevation` style props. NativeWind v4 *does* parse
 * CSS `box-shadow`, but the translation is approximate and relies on
 * the parser handling `rgba()` correctly across iOS/Android.
 *
 * For the brand's color-tinted shadows (per the F0.1.2 learning),
 * this explicit helper guarantees the right `shadowColor` shows up
 * on iOS and a sensible `elevation` ramp on Android.
 */

import { elevation, type ShadowRecipe } from "@confri/tokens";

const RGBA_RE = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s]+([\d.]+))?\s*\)/;

const parseRgba = (input: string): { color: string; alpha: number } => {
  const m = RGBA_RE.exec(input);
  if (!m) return { color: input, alpha: 1 };
  const r = m[1];
  const g = m[2];
  const b = m[3];
  const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
  return { color: `rgb(${r}, ${g}, ${b})`, alpha };
};

export interface RNShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  /** Android. Approximated from offsetY since Android doesn't expose blur. */
  elevation: number;
}

/**
 * Convert one of our elevation tokens into RN shadow* + elevation props.
 *
 * Example:
 *   const ctaShadow = elevationToRNStyle("cta");
 *   <Pressable style={[ctaShadow, ...]} />
 */
export const elevationToRNStyle = (key: keyof typeof elevation): RNShadowStyle => {
  const recipe: ShadowRecipe = elevation[key];
  if (recipe.color === "transparent" || recipe.opacity === 0) {
    return {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    };
  }
  const { color, alpha } = parseRgba(recipe.color);
  return {
    shadowColor: color,
    shadowOffset: { width: recipe.offsetX, height: recipe.offsetY },
    shadowOpacity: alpha,
    shadowRadius: Math.abs(recipe.blur) / 2,
    elevation: Math.max(1, Math.round(Math.abs(recipe.offsetY) * 0.7)),
  };
};
