import type { ReactNode } from "react";
import { Text, type TextProps } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { tokens } from "@confri/tokens";
import {
  brandGradientProps,
  gradientToLinearGradientProps,
} from "../../helpers/gradients.js";

type GradientName = "brand" | "brandVertical";

export interface GradientTextProps extends Omit<TextProps, "children"> {
  gradient?: GradientName;
  children: ReactNode;
}

/**
 * Text painted with a brand gradient. RN can't `bg-clip:text` like web,
 * so we use `<MaskedView>` to clip a `<LinearGradient>` to the shape of
 * the text. The text style is propagated through the mask element so
 * font, weight, and size are preserved.
 *
 * Mirrors `@confri/ui-web`'s GradientText in name and behavior, but the
 * implementation is necessarily different.
 */
export const GradientText = ({
  gradient = "brand",
  className,
  style,
  children,
  ...rest
}: GradientTextProps) => {
  const props =
    gradient === "brand"
      ? brandGradientProps
      : gradientToLinearGradientProps("brandVertical");

  return (
    <MaskedView
      maskElement={
        <Text
          className={className}
          style={[{ backgroundColor: "transparent" }, style]}
          {...rest}
        >
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={props.colors}
        locations={props.locations}
        start={props.start}
        end={props.end}
      >
        <Text
          className={className}
          style={[{ opacity: 0 }, style]}
          {...rest}
        >
          {children}
        </Text>
      </LinearGradient>
      {/* Fallback colorant in case the mask is not applied (e.g. on
          a platform without MaskedView support — degrade to cyan) */}
      <Text
        className={className}
        style={[{ color: tokens.colors.accent.cyan, position: "absolute", opacity: 0 }, style]}
        {...rest}
        aria-hidden
      >
        {children}
      </Text>
    </MaskedView>
  );
};
