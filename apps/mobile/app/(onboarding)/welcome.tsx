import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { GradientButton } from "@/components/GradientButton";
import { colors, radii } from "@confri/tokens";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ground">
      <View className="flex-1 px-6 justify-between py-8">
        {/* Brand mark + wordmark */}
        <View className="flex-1 items-center justify-center gap-6">
          <LinearGradient
            colors={[colors.accent.cyan, colors.accent.aqua, colors.accent.teal]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 88,
              height: 88,
              borderRadius: radii.xxl,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="car" size={44} color={colors.ink.onAccent} />
          </LinearGradient>

          <View className="items-center gap-3">
            <Text
              className="text-ink text-center"
              style={{ fontFamily: "Sora-ExtraBold", fontSize: 38, letterSpacing: -0.8 }}
            >
              ConvoyFriends
            </Text>
            <Text
              className="text-ink-mute text-center text-lede"
              style={{ fontFamily: "Inter-Regular", lineHeight: 26 }}
            >
              Drive Together,{"\n"}Navigate Smarter.
            </Text>
          </View>

          {/* Feature pills */}
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
            {["Live maps", "Voice chat", "Smart re-routing"].map((f) => (
              <View
                key={f}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: colors.line.strong,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 13,
                    color: colors.ink.mute,
                  }}
                >
                  {f}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View className="gap-4">
          <GradientButton
            label="Get Started →"
            onPress={() => router.push("/(onboarding)/permissions")}
          />
          <Text
            className="text-ink-soft text-center text-small"
            style={{ fontFamily: "Inter-Regular" }}
          >
            Already in the VIP group? Welcome back.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
