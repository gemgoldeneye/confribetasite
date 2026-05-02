import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Polyline } from "react-native-svg";
import { tokens } from "@confri/tokens";
import { brandGradientProps } from "../../helpers/gradients.js";
import { elevationToRNStyle } from "../../helpers/elevation.js";

export interface ToastProps {
  /** Whether the toast is visible. Parent controls timing/dismissal. */
  open: boolean;
  message: ReactNode;
  /** Optional leading icon. Defaults to a check mark. */
  icon?: ReactNode;
}

const CheckIcon = () => (
  <Svg viewBox="0 0 24 24" width={16} height={16} fill="none">
    <Polyline
      points="20 6 9 17 4 12"
      stroke={tokens.colors.ink.onAccent}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const toastShadow = elevationToRNStyle("toast");

/**
 * Pill-shaped success toast. Slides up from the bottom on `open`,
 * springs into view via the brand `--ease-spring` easing curve
 * (approximated with `Animated.spring`), slides back down on close.
 *
 * Presentational: parents own visibility timing. In a real app the
 * Toast lives in a portal-equivalent (react-native-portalize or a
 * top-level provider).
 */
export const Toast = ({ open, message, icon = <CheckIcon /> }: ToastProps) => {
  const translateY = useRef(new Animated.Value(open ? 0 : 96)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: open ? 0 : 96,
      duration: open ? tokens.motion.duration.slow : tokens.motion.duration.base,
      easing: open
        ? Easing.bezier(0.2, 1.4, 0.6, 1) // matches --ease-spring
        : Easing.bezier(0.3, 0, 1, 1), // matches --ease-accelerate
      useNativeDriver: true,
    }).start();
  }, [open, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="absolute bottom-8 left-0 right-0 items-center"
      style={[{ transform: [{ translateY }] }]}
    >
      <View
        className="flex-row items-center gap-2 overflow-hidden rounded-pill px-6 py-3"
        style={toastShadow}
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
        <View className="shrink-0">{icon}</View>
        <Text className="font-display text-body font-bold text-ink-on-accent">
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};
