import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cva, type VariantProps } from "class-variance-authority";
import { gradientToLinearGradientProps } from "../../helpers/gradients.js";
import { cn } from "../../lib/cn.js";

const card = cva(
  ["relative overflow-hidden border border-line-subtle"],
  {
    variants: {
      variant: {
        glass: "",
        glassElevated: "",
        solid: "bg-elevated",
      },
      padding: {
        none: "p-0",
        sm: "p-5",
        md: "p-7",
        lg: "p-9",
      },
      radius: {
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        xxl: "rounded-xxl",
      },
    },
    defaultVariants: {
      variant: "glass",
      padding: "md",
      radius: "xl",
    },
  },
);

const glassProps = gradientToLinearGradientProps("surfaceCard");
const glassElevatedProps = gradientToLinearGradientProps("surfaceCardElevated");

export interface CardProps
  extends Omit<ViewProps, "children" | "style">,
    VariantProps<typeof card> {
  children?: ReactNode;
  className?: string;
  /** Optional brand-gradient hairline along the top edge (cfhandoff `::before`). */
  accentRule?: "none" | "top";
  style?: ViewProps["style"];
}

/**
 * Mobile Card. Mirrors `@confri/ui-web`'s Card in vocabulary:
 *   variant:    glass | glassElevated | solid
 *   padding:    none | sm | md | lg
 *   radius:     md | lg | xl | xxl
 *   accentRule: none | top
 *
 * The glass variants use `<LinearGradient>` for the translucent
 * vertical surface fade. Web uses CSS gradients for the same effect.
 */
export const Card = forwardRef<View, CardProps>(
  ({ variant = "glass", padding, radius, accentRule = "none", children, className, style, ...rest }, ref) => {
    const showSurface = variant === "glass" || variant === "glassElevated";
    const surfaceProps = variant === "glassElevated" ? glassElevatedProps : glassProps;
    return (
      <View
        ref={ref}
        className={cn(card({ variant, padding, radius }), className)}
        style={style}
        {...rest}
      >
        {showSurface ? (
          <LinearGradient
            colors={surfaceProps.colors}
            locations={surfaceProps.locations}
            start={surfaceProps.start}
            end={surfaceProps.end}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ) : null}
        {accentRule === "top" ? (
          <View
            className="absolute top-0 left-0 right-0"
            style={{ height: 2 }}
          >
            <LinearGradient
              colors={["#3DD9F5", "#2BC4A8"] as const}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
          </View>
        ) : null}
        {children}
      </View>
    );
  },
);
Card.displayName = "Card";
