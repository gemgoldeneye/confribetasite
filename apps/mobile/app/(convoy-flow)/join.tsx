import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { GradientButton } from "@/components/GradientButton";
import { joinConvoy } from "@/services/convoy";
import { getProfile } from "@/lib/onboarding";
import { colors, radii } from "@confri/tokens";

const CODE_LENGTH = 6;

export default function JoinConvoyScreen() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleCodeChange(text: string) {
    const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(clean);
    if (error) setError("");
  }

  async function handleJoin() {
    if (code.length < CODE_LENGTH) {
      setError("Code must be 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const profile = await getProfile();
      await joinConvoy(code, profile ?? { name: "Driver", phone: "", vehicle: "car" });
      router.replace("/(tabs)/convoy");
    } catch {
      setError("Couldn't find that convoy. Check the code and try again.");
    } finally {
      setLoading(false);
    }
  }

  const isReady = code.length === CODE_LENGTH;

  return (
    <SafeAreaView className="flex-1 bg-surface" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-6 pt-6 pb-4 justify-between">

          {/* Header */}
          <View className="gap-8">
            <View className="flex-row items-center justify-between">
              <Text
                className="text-ink"
                style={{ fontFamily: "Sora-ExtraBold", fontSize: 24, letterSpacing: -0.4 }}
              >
                Join a convoy
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.ink.soft} />
              </TouchableOpacity>
            </View>

            <View className="gap-6">
              <View className="gap-2">
                <Text
                  style={{ fontFamily: "Sora-SemiBold", fontSize: 12, color: colors.ink.soft, letterSpacing: 0.8 }}
                >
                  CONVOY CODE
                </Text>
                <TextInput
                  value={code}
                  onChangeText={handleCodeChange}
                  placeholder="A3K9F2"
                  placeholderTextColor={colors.ink.soft}
                  autoFocus
                  autoCapitalize="characters"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleJoin}
                  style={{
                    height: 64,
                    borderRadius: radii.md,
                    borderWidth: 1.5,
                    borderColor: error
                      ? colors.status.warn
                      : code.length === CODE_LENGTH
                      ? colors.accent.cyan
                      : colors.line.strong,
                    backgroundColor: colors.bg.elevated,
                    paddingHorizontal: 20,
                    fontFamily: "Sora-ExtraBold",
                    fontSize: 28,
                    color: colors.ink.primary,
                    letterSpacing: 6,
                    textAlign: "center",
                  }}
                />
                {error ? (
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: colors.status.warn }}>
                    {error}
                  </Text>
                ) : (
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: colors.ink.soft }}>
                    Ask your convoy leader for the 6-character code.
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* CTA */}
          {loading ? (
            <View style={{ height: 56, alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator color={colors.accent.cyan} />
            </View>
          ) : (
            <GradientButton
              label="Join convoy →"
              onPress={handleJoin}
              disabled={!isReady}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
