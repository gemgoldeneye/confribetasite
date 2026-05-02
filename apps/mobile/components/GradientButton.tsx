import { TouchableOpacity, Text, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radii } from "@confri/tokens";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function GradientButton({
  label,
  onPress,
  style,
  disabled = false,
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.82}
      style={style}
    >
      <LinearGradient
        colors={[colors.accent.cyan, colors.accent.aqua, colors.accent.teal]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 56,
          borderRadius: radii.md,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.45 : 1,
        }}
      >
        <Text
          style={{
            fontFamily: "Sora-Bold",
            fontSize: 16,
            letterSpacing: 0.2,
            color: colors.ink.onAccent,
          }}
        >
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
