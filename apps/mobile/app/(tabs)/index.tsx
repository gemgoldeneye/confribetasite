import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenShell } from "@/components/ScreenShell";
import { colors } from "@confri/tokens";

export default function MapScreen() {
  return (
    <ScreenShell>
      {/* Header */}
      <View className="px-5 pt-4 pb-3 border-b border-b-[rgba(255,255,255,0.08)]">
        <Text
          className="text-ink text-h2"
          style={{ fontFamily: "Sora-Bold" }}
        >
          ConvoyFriends
        </Text>
        <Text
          className="text-ink-soft text-small mt-1"
          style={{ fontFamily: "Inter-Regular" }}
        >
          No active convoy
        </Text>
      </View>

      {/* Map placeholder */}
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <View
          className="w-16 h-16 rounded-xxl items-center justify-center"
          style={{ backgroundColor: colors.bg.elevated }}
        >
          <Ionicons name="map-outline" size={32} color={colors.accent.cyan} />
        </View>
        <View className="items-center gap-2">
          <Text
            className="text-ink text-h3"
            style={{ fontFamily: "Sora-Bold" }}
          >
            Map coming in F3
          </Text>
          <Text
            className="text-ink-mute text-body text-center"
            style={{ fontFamily: "Inter-Regular" }}
          >
            Live convoy maps, real-time positions, and smart re-routing will
            live here.
          </Text>
        </View>
      </View>
    </ScreenShell>
  );
}
