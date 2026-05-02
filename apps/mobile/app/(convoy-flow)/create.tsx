import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Share,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { GradientButton } from "@/components/GradientButton";
import { createConvoy } from "@/services/convoy";
import { getProfile } from "@/lib/onboarding";
import { colors, radii } from "@confri/tokens";
import type { Convoy } from "@/services/convoy";

export default function CreateConvoyScreen() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Convoy | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const profile = await getProfile();
      const convoy = await createConvoy(name.trim(), profile ?? {
        name: "Driver",
        phone: "",
        vehicle: "car",
      });
      setCreated(convoy);
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!created) return;
    await Share.share({
      message: `Join my convoy "${created.name}" on ConvoyFriends!\n\nCode: ${created.code}`,
      title: "Join my convoy",
    });
  }

  function handleCopyFeedback() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-6 pt-6 pb-4 justify-between">

          {/* Header */}
          <View className="gap-6">
            <View className="flex-row items-center justify-between">
              <Text
                className="text-ink"
                style={{ fontFamily: "Sora-ExtraBold", fontSize: 24, letterSpacing: -0.4 }}
              >
                {created ? "Convoy created!" : "Create a convoy"}
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.ink.soft} />
              </TouchableOpacity>
            </View>

            {!created ? (
              /* ── Form step ─────────────────────────────── */
              <View className="gap-2">
                <Text
                  style={{ fontFamily: "Sora-SemiBold", fontSize: 12, color: colors.ink.soft, letterSpacing: 0.8 }}
                >
                  CONVOY NAME
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Weekend Road Trip"
                  placeholderTextColor={colors.ink.soft}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleCreate}
                  style={{
                    height: 52,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: colors.line.strong,
                    backgroundColor: colors.bg.elevated,
                    paddingHorizontal: 16,
                    fontFamily: "Inter-Regular",
                    fontSize: 16,
                    color: colors.ink.primary,
                  }}
                />
              </View>
            ) : (
              /* ── Success step ──────────────────────────── */
              <View className="gap-6">
                <Text
                  className="text-ink-mute text-body"
                  style={{ fontFamily: "Inter-Regular", lineHeight: 22 }}
                >
                  Share this code with your group. Everyone who joins sees each
                  other on the convoy map.
                </Text>

                {/* Code block */}
                <View
                  style={{
                    borderRadius: radii.lg,
                    borderWidth: 1,
                    borderColor: colors.accent.cyan + "55",
                    backgroundColor: colors.glass.tinted,
                    padding: 24,
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{ fontFamily: "Inter-Medium", fontSize: 12, color: colors.ink.soft, letterSpacing: 1 }}
                  >
                    CONVOY CODE
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Sora-ExtraBold",
                      fontSize: 44,
                      color: colors.accent.cyan,
                      letterSpacing: 6,
                    }}
                  >
                    {created.code}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleShare}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: 14,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: colors.line.strong,
                    backgroundColor: colors.bg.elevated,
                  }}
                >
                  <Ionicons name="share-outline" size={18} color={colors.ink.mute} />
                  <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: colors.ink.mute }}>
                    Share invite
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* CTA */}
          {!created ? (
            loading ? (
              <View style={{ height: 56, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={colors.accent.cyan} />
              </View>
            ) : (
              <GradientButton
                label="Create convoy →"
                onPress={handleCreate}
                disabled={name.trim().length < 2}
              />
            )
          ) : (
            <GradientButton
              label="Let's go →"
              onPress={() => router.replace("/(tabs)/convoy")}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
