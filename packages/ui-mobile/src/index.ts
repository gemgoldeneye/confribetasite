/**
 * @confri/ui-mobile — React Native UI primitives for ConvoyFriends.
 *
 * Components mirror `@confri/ui-web`'s vocabulary one-to-one in name
 * and prop signature, except for unavoidable platform substitutions:
 *
 *   web                       mobile
 *   ─────────────────────     ─────────────────────────────
 *   onClick                   onPress
 *   <button>                  <Pressable>
 *   <input>                   <TextInput>
 *   bg-clip-text              <MaskedView> + <LinearGradient>
 *   linear-gradient(...)      <LinearGradient ...>
 *   :focus-within             useState + onFocus/onBlur
 *
 * Components use NativeWind v4 className-based styling. Consumers must
 * have NativeWind set up in their app (babel + metro). The
 * `@confri/ui-mobile/nativewind` theme CSS is consumed once at the
 * app root:
 *
 *   @import "tailwindcss";
 *   @import "@confri/ui-mobile/nativewind";
 */

export { tokens } from "@confri/tokens";

export { cn } from "./lib/cn.js";

export {
  brandGradientProps,
  gradientToLinearGradientProps,
  elevationToRNStyle,
} from "./helpers/index.js";
export type { ExpoLinearGradientProps, RNShadowStyle } from "./helpers/index.js";

export { BrandMark } from "./components/BrandMark/index.js";
export type { BrandMarkProps } from "./components/BrandMark/index.js";

export { GradientText } from "./components/GradientText/index.js";
export type { GradientTextProps } from "./components/GradientText/index.js";

export { Button } from "./components/Button/index.js";
export type { ButtonProps } from "./components/Button/index.js";

export { Card } from "./components/Card/index.js";
export type { CardProps } from "./components/Card/index.js";

export { Input } from "./components/Input/index.js";
export type { InputProps } from "./components/Input/index.js";

export { Textarea } from "./components/Textarea/index.js";
export type { TextareaProps } from "./components/Textarea/index.js";

export { RadioPill } from "./components/RadioPill/index.js";
export type { RadioPillOption, RadioPillProps } from "./components/RadioPill/index.js";

export { RadioSegment } from "./components/RadioSegment/index.js";
export type { RadioSegmentOption, RadioSegmentProps } from "./components/RadioSegment/index.js";

export { Toast } from "./components/Toast/index.js";
export type { ToastProps } from "./components/Toast/index.js";
