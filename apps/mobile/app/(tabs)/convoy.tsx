import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenShell } from "@/components/ScreenShell";
import { colors } from "@confri/tokens";

export default function ConvoyScreen() {
  return (
    <ScreenShell>
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <View
          className="w-16 h-16 rounded-xxl items-center justify-center"
          style={{ backgroundColor: colors.bg.elevated }}
        >
          <Ionicons name="car-outline" size={32} color={colors.accent.teal} />
        </View>
        <View className="items-center gap-2">
          <Text
            className="text-ink text-h3"
            style={{ fontFamily: "Sora-Bold" }}
          >
            No convoy yet
          </Text>
          <Text
            className="text-ink-mute text-body text-center"
            style={{ fontFamily: "Inter-Regular" }}
          >
            Create or join a convoy to get started. Convoy management arrives
            in F4.
          </Text>
        </View>
      </View>
    </ScreenShell>
  );
}
