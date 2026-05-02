import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { OnboardingShell } from "@/components/OnboardingShell";
import { GradientButton } from "@/components/GradientButton";
import { colors, radii } from "@confri/tokens";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DRIVER_KEY = "onboarding_driver";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
  autoComplete?: React.ComponentProps<typeof TextInput>["autoComplete"];
}

function Field({ label, value, onChange, placeholder, keyboardType, autoComplete }: FieldProps) {
  return (
    <View className="gap-2">
      <Text
        style={{ fontFamily: "Sora-SemiBold", fontSize: 13, color: colors.ink.mute, letterSpacing: 0.4 }}
      >
        {label.toUpperCase()}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.ink.soft}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        autoCorrect={false}
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
  );
}

export default function DriverScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function handleContinue() {
    await AsyncStorage.setItem(DRIVER_KEY, JSON.stringify({ name: name.trim(), phone: phone.trim() }));
    router.push("/(onboarding)/vehicle");
  }

  const canContinue = name.trim().length >= 2;

  return (
    <OnboardingShell step={2} totalSteps={3}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", paddingTop: 24, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-8">
            <View className="gap-2">
              <Text
                className="text-ink"
                style={{ fontFamily: "Sora-ExtraBold", fontSize: 28, letterSpacing: -0.5 }}
              >
                Who's driving?
              </Text>
              <Text
                className="text-ink-mute text-body"
                style={{ fontFamily: "Inter-Regular", lineHeight: 22 }}
              >
                Your name shows up for convoy members when you're on the map.
              </Text>
            </View>

            <View className="gap-5">
              <Field
                label="Your name"
                value={name}
                onChange={setName}
                placeholder="e.g. Alex"
                autoComplete="name"
              />
              <Field
                label="Phone number"
                value={phone}
                onChange={setPhone}
                placeholder="+1 555 000 0000"
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
          </View>

          <GradientButton
            label="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
            style={{ marginTop: 32 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingShell>
  );
}
