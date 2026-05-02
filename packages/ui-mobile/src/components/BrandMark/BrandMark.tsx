import { View, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path } from "react-native-svg";
import { tokens } from "@confri/tokens";
import { brandGradientProps } from "../../helpers/gradients.js";
import { elevationToRNStyle } from "../../helpers/elevation.js";
import { cn } from "../../lib/cn.js";

export interface BrandMarkProps extends Omit<ViewProps, "children"> {
  /** Outer square size in px. Default 40 — matches the cfhandoff lockup. */
  size?: number;
  /** Render as a chip (rounded square + brand gradient + shadow) or just the glyph. */
  variant?: "chip" | "glyph";
}

const Glyph = ({ size, color }: { size: number; color: string }) => {
  const inner = Math.round(size * 0.55);
  return (
    <Svg viewBox="0 0 24 24" width={inner} height={inner} fill="none">
      <Circle cx={5} cy={12} r={2.4} fill={color} />
      <Circle cx={12} cy={6} r={2.4} fill={color} />
      <Circle cx={19} cy={12} r={2.4} fill={color} />
      <Path
        d="M6.5 11 10.5 7M13.5 7l4 4M6.5 13l11 0"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
};

const brandMarkShadow = elevationToRNStyle("brandMark");

/**
 * The ConvoyFriends brand mark — three connected dots representing
 * a convoy of vehicles linked together. Mirrors `@confri/ui-web`'s
 * BrandMark in props and behavior.
 */
export const BrandMark = ({
  size = 40,
  variant = "chip",
  className,
  style,
  ...rest
}: BrandMarkProps) => {
  if (variant === "glyph") {
    return (
      <View className={className} style={style} {...rest}>
        <Glyph size={size} color={tokens.colors.ink.primary} />
      </View>
    );
  }
  return (
    <View
      className={cn("items-center justify-center overflow-hidden", className)}
      style={[
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.275),
        },
        brandMarkShadow,
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel="ConvoyFriends"
      {...rest}
    >
      <LinearGradient
        colors={brandGradientProps.colors}
        locations={brandGradientProps.locations}
        start={brandGradientProps.start}
        end={brandGradientProps.end}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Glyph size={size} color={tokens.colors.ink.onAccent} />
    </View>
  );
};
