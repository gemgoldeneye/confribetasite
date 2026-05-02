/**
 * Adapt @confri/tokens gradient values to React Native consumers.
 *
 * Web uses CSS `background-image: linear-gradient(angle, ...)`.
 * Mobile uses `<LinearGradient>` from `expo-linear-gradient`, which
 * takes `colors[]`, `locations[]`, and unit-square `start` / `end`
 * coordinates. This module converts our token shapes into
 * `expo-linear-gradient`-ready props without taking a runtime dep
 * on `expo-linear-gradient` itself (the type-only signature keeps
 * the package installable in projects that don't ship gradients).
 */

import { gradients, type LinearGradient } from "@confri/tokens";

type ColorTuple = readonly [string, string, ...string[]];
type LocationTuple = readonly [number, number, ...number[]];

export interface ExpoLinearGradientProps {
  colors: ColorTuple;
  locations: LocationTuple;
  start: { x: number; y: number };
  end: { x: number; y: number };
}

/**
 * Convert a CSS-style gradient angle (0deg = bottom→top, 90deg = left→right,
 * 180deg = top→bottom) into the unit-square start/end coordinates that
 * `<LinearGradient>` expects.
 *
 * Direction vector at angle θ: (sin θ, -cos θ) — the `-cos θ` accounts for
 * screen-y growing downward while CSS y grows upward.
 */
const angleToStartEnd = (
  angleDeg: number,
): Pick<ExpoLinearGradientProps, "start" | "end"> => {
  const rad = (angleDeg * Math.PI) / 180;
  const dirX = Math.sin(rad);
  const dirY = -Math.cos(rad);
  return {
    start: { x: 0.5 - dirX / 2, y: 0.5 - dirY / 2 },
    end: { x: 0.5 + dirX / 2, y: 0.5 + dirY / 2 },
  };
};

/**
 * Convert any of our token gradients into props ready to spread onto
 * `<LinearGradient>`.
 *
 * Example:
 *   import { LinearGradient } from "expo-linear-gradient";
 *   import { gradientToLinearGradientProps } from "@confri/ui-mobile/helpers";
 *
 *   <LinearGradient {...gradientToLinearGradientProps("brand")} style={{ flex: 1 }} />
 */
export const gradientToLinearGradientProps = (
  gradient: LinearGradient | keyof typeof gradients,
): ExpoLinearGradientProps => {
  const g = typeof gradient === "string" ? gradients[gradient] : gradient;
  const colors = g.stops.map((s) => s.color) as unknown as ColorTuple;
  const locations = g.stops.map((s) => s.position / 100) as unknown as LocationTuple;
  return {
    colors,
    locations,
    ...angleToStartEnd(g.angle),
  };
};

/**
 * Pre-computed props for the canonical brand gradient.
 * Equivalent to `gradientToLinearGradientProps("brand")`.
 */
export const brandGradientProps: ExpoLinearGradientProps =
  gradientToLinearGradientProps("brand");
