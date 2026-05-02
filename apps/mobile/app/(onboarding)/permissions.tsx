import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { OnboardingShell } from "@/components/OnboardingShell";
import { GradientButton } from "@/components/GradientButton";
import { colors, radii } from "@confri/tokens";

type PermStatus = "idle" | "granted" | "denied";

interface PermRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  title: string;
  description: string;
  status: PermStatus;
  onRequest: () => void;
}

function PermRow({ icon, iconColor, title, description, status, onRequest }: PermRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 16,
        padding: 20,
        borderRadius: radii.lg,
        backgroundColor: colors.bg.elevated,
        borderWidth: 1,
        borderColor: status === "granted" ? colors.accent.cyan + "44" : colors.line.subtle,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radii.md,
          backgroundColor: colors.bg.surface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 15, color: colors.ink.primary }}>
          {title}
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: colors.ink.mute, lineHeight: 19 }}>
          {description}
        </Text>
      </View>

      <TouchableOpacity
        onPress={status === "idle" ? onRequest : undefined}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 7,
          borderRadius: 999,
          backgroundColor:
            status === "granted"
              ? colors.accent.cyan + "22"
              : status === "denied"
              ? colors.bg.surface
              : colors.bg.surface,
          borderWidth: 1,
          borderColor:
            status === "granted"
              ? colors.accent.cyan
              : colors.line.strong,
        }}
      >
        <Text
          style={{
            fontFamily: "Sora-SemiBold",
            fontSize: 12,
            color: status === "granted" ? colors.accent.cyan : colors.ink.mute,
          }}
        >
          {status === "granted" ? "Allowed" : status === "denied" ? "Denied" : "Allow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PermissionsScreen() {
  const [locationStatus, setLocationStatus] = useState<PermStatus>("idle");
  const [notifStatus, setNotifStatus] = useState<PermStatus>("idle");

  async function requestLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationStatus(status === "granted" ? "granted" : "denied");
  }

  async function requestNotifications() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotifStatus(status === "granted" ? "granted" : "denied");
    } catch {
      setNotifStatus("denied");
    }
  }

  return (
    <OnboardingShell step={1} totalSteps={3} showBack={false}>
      <View className="flex-1 justify-between pt-6">
        <View className="gap-6">
          <View className="gap-2">
            <Text
              className="text-ink"
              style={{ fontFamily: "Sora-ExtraBold", fontSize: 28, letterSpacing: -0.5 }}
            >
              Before you hit the road
            </Text>
            <Text
              className="text-ink-mute text-body"
              style={{ fontFamily: "Inter-Regular", lineHeight: 22 }}
            >
              ConvoyFriends needs two quick permissions to keep your convoy connected.
            </Text>
          </View>

          <View className="gap-3">
            <PermRow
              icon="location-outline"
              iconColor={colors.accent.teal}
              title="Live position"
              description="Shows your pin on the convoy map so your group knows where you are."
              status={locationStatus}
              onRequest={requestLocation}
            />
            <PermRow
              icon="notifications-outline"
              iconColor={colors.accent.cyan}
              title="Convoy alerts"
              description="Get notified when someone falls behind or the convoy splits up."
              status={notifStatus}
              onRequest={requestNotifications}
            />
          </View>
        </View>

        <GradientButton
          label="Continue"
          onPress={() => router.push("/(onboarding)/driver")}
        />
      </View>
    </OnboardingShell>
  );
}
