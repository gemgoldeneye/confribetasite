import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingShell } from "@/components/OnboardingShell";
import { GradientButton } from "@/components/GradientButton";
import { markOnboardingComplete } from "@/lib/onboarding";
import { colors, radii } from "@confri/tokens";
import type { VehicleType } from "@/lib/onboarding";

const VEHICLES: { type: VehicleType; label: string; emoji: string }[] = [
  { type: "motor", label: "Motorcycle", emoji: "🏍️" },
  { type: "car", label: "Car", emoji: "🚗" },
  { type: "supercar", label: "Supercar", emoji: "🏎️" },
  { type: "truck", label: "Truck", emoji: "🚛" },
  { type: "bus", label: "Bus", emoji: "🚌" },
];

export default function VehicleScreen() {
  const [selected, setSelected] = useState<VehicleType | null>(null);

  async function handleFinish() {
    if (!selected) return;
    const driverRaw = await AsyncStorage.getItem("onboarding_driver");
    const driver = driverRaw ? JSON.parse(driverRaw) : {};
    await AsyncStorage.setItem(
      "user_profile",
      JSON.stringify({ ...driver, vehicle: selected }),
    );
    await markOnboardingComplete();
    router.replace("/(tabs)/");
  }

  return (
    <OnboardingShell step={3} totalSteps={3}>
      <View className="flex-1 justify-between pt-6">
        <View className="gap-6">
          <View className="gap-2">
            <Text
              className="text-ink"
              style={{ fontFamily: "Sora-ExtraBold", fontSize: 28, letterSpacing: -0.5 }}
            >
              What are you driving?
            </Text>
            <Text
              className="text-ink-mute text-body"
              style={{ fontFamily: "Inter-Regular", lineHeight: 22 }}
            >
              Your vehicle icon shows on the convoy map for everyone in the group.
            </Text>
          </View>

          <FlatList
            data={VEHICLES}
            keyExtractor={(v) => v.type}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => {
              const active = selected === item.type;
              return (
                <TouchableOpacity
                  onPress={() => setSelected(item.type)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    paddingVertical: 20,
                    alignItems: "center",
                    gap: 8,
                    borderRadius: radii.lg,
                    borderWidth: 1.5,
                    borderColor: active ? colors.accent.cyan : colors.line.strong,
                    backgroundColor: active
                      ? colors.glass.tinted
                      : colors.bg.elevated,
                  }}
                >
                  <Text style={{ fontSize: 34 }}>{item.emoji}</Text>
                  <Text
                    style={{
                      fontFamily: active ? "Sora-SemiBold" : "Inter-Regular",
                      fontSize: 13,
                      color: active ? colors.accent.cyan : colors.ink.mute,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <GradientButton
          label="Start Driving →"
          onPress={handleFinish}
          disabled={!selected}
          style={{ marginTop: 24 }}
        />
      </View>
    </OnboardingShell>
  );
}
