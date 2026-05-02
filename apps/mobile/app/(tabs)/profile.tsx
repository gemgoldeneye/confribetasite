import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenShell } from "@/components/ScreenShell";
import { colors } from "@confri/tokens";

export default function ProfileScreen() {
  return (
    <ScreenShell>
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <View
          className="w-16 h-16 rounded-pill items-center justify-center"
          style={{ backgroundColor: colors.bg.elevated }}
        >
          <Ionicons
            name="person-outline"
            size={32}
            color={colors.ink.mute}
          />
        </View>
        <View className="items-center gap-2">
          <Text
            className="text-ink text-h3"
            style={{ fontFamily: "Sora-Bold" }}
          >
            Set up your profile
          </Text>
          <Text
            className="text-ink-mute text-body text-center"
            style={{ fontFamily: "Inter-Regular" }}
          >
            Profile, vehicle settings, and driver preferences arrive in F3
            onboarding.
          </Text>
        </View>
      </View>
    </ScreenShell>
  );
}
