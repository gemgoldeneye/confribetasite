import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@confri/tokens";

interface OnboardingShellProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  showBack?: boolean;
}

export function OnboardingShell({
  children,
  step,
  totalSteps,
  showBack = true,
}: OnboardingShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-ground">
      {/* Nav row */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-1">
        {showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.ink.mute} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}

        {/* Progress dots */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {Array.from({ length: totalSteps }).map((_, i) => {
            const done = i < step - 1;
            const active = i === step - 1;
            return (
              <View
                key={i}
                style={{
                  width: active ? 20 : 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: done || active
                    ? colors.accent.cyan
                    : colors.line.strong,
                }}
              />
            );
          })}
        </View>

        <View style={{ width: 24 }} />
      </View>

      {/* Screen content */}
      <View className="flex-1 px-5 pb-4">
        {children}
      </View>
    </SafeAreaView>
  );
}
