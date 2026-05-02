import { forwardRef, type ReactNode } from "react";
import { Pressable, Text, View, type PressableProps, type GestureResponderEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cva, type VariantProps } from "class-variance-authority";
import { brandGradientProps } from "../../helpers/gradients.js";
import { elevationToRNStyle } from "../../helpers/elevation.js";
import { cn } from "../../lib/cn.js";

const button = cva(
  ["flex-row items-center justify-center overflow-hidden"],
  {
    variants: {
      variant: {
        primary: "",
        ghost: "bg-transparent border border-line-strong",
        icon: "bg-glass-wash border border-line-subtle",
      },
      size: {
        sm: "h-9 px-4 rounded-md gap-2",
        md: "h-11 px-5 rounded-md gap-2",
        lg: "h-12 px-6 rounded-lg gap-2",
      },
    },
    compoundVariants: [
      { variant: "icon", size: "sm", className: "w-9 px-0" },
      { variant: "icon", size: "md", className: "w-11 px-0" },
      { variant: "icon", size: "lg", className: "w-12 px-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const labelVariants = cva("font-display font-bold", {
  variants: {
    variant: {
      primary: "text-ink-on-accent",
      ghost: "text-ink",
      icon: "text-ink",
    },
    size: {
      sm: "text-small",
      md: "text-body",
      lg: "text-lede",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

const ctaShadow = elevationToRNStyle("cta");

export interface ButtonProps
  extends Omit<PressableProps, "children" | "style">,
    VariantProps<typeof button> {
  children?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
}

/**
 * Mobile Button. Same vocabulary as `@confri/ui-web`'s Button:
 *   variant: primary | ghost | icon
 *   size:    sm | md | lg
 *   iconLeft / iconRight slots
 *
 * The `primary` variant uses an absolutely-positioned `<LinearGradient>`
 * for its surface (RN has no CSS background-image equivalent).
 */
export const Button = forwardRef<View, ButtonProps>(
  ({ variant, size, iconLeft, iconRight, children, className, onPress, accessibilityLabel, ...rest }, ref) => {
    const isPrimary = (variant ?? "primary") === "primary";
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className={cn(button({ variant, size }), className)}
        style={({ pressed }) => [
          isPrimary ? ctaShadow : null,
          { transform: [{ translateY: pressed ? 0 : 0 }, { scale: pressed ? 0.98 : 1 }] },
        ]}
        {...rest}
      >
        {isPrimary ? (
          <LinearGradient
            colors={brandGradientProps.colors}
            locations={brandGradientProps.locations}
            start={brandGradientProps.start}
            end={brandGradientProps.end}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
        ) : null}
        {iconLeft ? <View className="shrink-0">{iconLeft}</View> : null}
        {typeof children === "string" ? (
          <Text className={labelVariants({ variant, size })}>{children}</Text>
        ) : (
          children
        )}
        {iconRight ? <View className="shrink-0">{iconRight}</View> : null}
      </Pressable>
    );
  },
);
Button.displayName = "Button";

export type { GestureResponderEvent };
