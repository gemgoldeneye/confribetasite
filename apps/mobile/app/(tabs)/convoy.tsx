import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";
import { getActiveConvoy, leaveConvoy, VEHICLE_EMOJI } from "@/services/convoy";
import { colors, radii } from "@confri/tokens";
import type { Convoy } from "@/services/convoy";

// ── Member row ────────────────────────────────────────────────────────────────

function MemberRow({ member }: { member: Convoy["members"][number] }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.line.subtle,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          backgroundColor: colors.bg.elevated,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>{VEHICLE_EMOJI[member.vehicle]}</Text>
      </View>
      <Text
        style={{ flex: 1, fontFamily: "Sora-SemiBold", fontSize: 15, color: colors.ink.primary }}
      >
        {member.name}
      </Text>
      {member.isLeader && (
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: colors.glass.tinted,
            borderWidth: 1,
            borderColor: colors.accent.cyan + "44",
          }}
        >
          <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 11, color: colors.accent.cyan }}>
            Leader
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ConvoyScreen() {
  const [convoy, setConvoy] = useState<Convoy | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getActiveConvoy().then((c) => {
        if (active) {
          setConvoy(c);
          setLoading(false);
        }
      });
      return () => { active = false; };
    }, []),
  );

  function confirmLeave() {
    Alert.alert(
      "Leave convoy?",
      `You'll be removed from "${convoy?.name}". You can rejoin using the code.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            await leaveConvoy();
            setConvoy(null);
          },
        },
      ],
    );
  }

  async function handleShare() {
    if (!convoy) return;
    await Share.share({
      message: `Join my convoy "${convoy.name}" on ConvoyFriends!\n\nCode: ${convoy.code}`,
    });
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-ground items-center justify-center">
        <ActivityIndicator color={colors.accent.cyan} />
      </SafeAreaView>
    );
  }

  /* ── Empty state ─────────────────────────────────────────────────────────── */
  if (!convoy) {
    return (
      <SafeAreaView className="flex-1 bg-ground">
        <View className="flex-1 px-6 justify-between py-8">
          <View className="flex-1 items-center justify-center gap-5">
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: radii.xxl,
                backgroundColor: colors.bg.elevated,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="car-outline" size={32} color={colors.accent.teal} />
            </View>
            <View style={{ alignItems: "center", gap: 8 }}>
              <Text
                className="text-ink"
                style={{ fontFamily: "Sora-Bold", fontSize: 20 }}
              >
                No active convoy
              </Text>
              <Text
                className="text-ink-mute text-body text-center"
                style={{ fontFamily: "Inter-Regular", lineHeight: 22 }}
              >
                Create a convoy and share the code, or enter a code to join your group.
              </Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.push("/(convoy-flow)/create")}
              activeOpacity={0.8}
            >
              <View
                style={{
                  height: 56,
                  borderRadius: radii.md,
                  backgroundColor: colors.accent.cyan,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Sora-Bold", fontSize: 15, color: colors.ink.onAccent }}>
                  Create a convoy
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(convoy-flow)/join")}
              activeOpacity={0.8}
              style={{
                height: 56,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.line.strong,
                backgroundColor: colors.bg.elevated,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 15, color: colors.ink.mute }}>
                Join with a code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /* ── Active convoy ───────────────────────────────────────────────────────── */
  return (
    <SafeAreaView className="flex-1 bg-ground">
      <ScrollView
        contentContainerStyle={{ padding: 24, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Convoy header card */}
        <View
          style={{
            borderRadius: radii.xl,
            borderWidth: 1,
            borderColor: colors.accent.cyan + "44",
            backgroundColor: colors.bg.elevated,
            padding: 20,
            gap: 12,
          }}
        >
          {/* Status + name */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: colors.accent.teal }}
            />
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: colors.accent.teal, letterSpacing: 0.6 }}>
              ACTIVE
            </Text>
          </View>
          <Text
            style={{ fontFamily: "Sora-ExtraBold", fontSize: 26, color: colors.ink.primary, letterSpacing: -0.4 }}
          >
            {convoy.name}
          </Text>

          {/* Code */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              alignSelf: "flex-start",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: colors.bg.surface,
              borderWidth: 1,
              borderColor: colors.line.strong,
            }}
          >
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: colors.ink.soft }}>
              Code
            </Text>
            <Text style={{ fontFamily: "Sora-Bold", fontSize: 16, color: colors.ink.primary, letterSpacing: 3 }}>
              {convoy.code}
            </Text>
          </View>
        </View>

        {/* Members list */}
        <View
          style={{
            borderRadius: radii.xl,
            borderWidth: 1,
            borderColor: colors.line.subtle,
            backgroundColor: colors.bg.elevated,
            paddingHorizontal: 20,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16 }}>
            <Text style={{ fontFamily: "Sora-Bold", fontSize: 15, color: colors.ink.primary }}>
              Members
            </Text>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: colors.ink.soft }}>
              {convoy.members.length}
            </Text>
          </View>
          {convoy.members.map((m) => (
            <MemberRow key={m.id} member={m} />
          ))}
          <View style={{ height: 4 }} />
        </View>

        {/* Actions */}
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              height: 52,
              borderRadius: radii.md,
              borderWidth: 1,
              borderColor: colors.line.strong,
              backgroundColor: colors.bg.elevated,
            }}
          >
            <Ionicons name="share-outline" size={18} color={colors.ink.mute} />
            <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: colors.ink.mute }}>
              Share code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={confirmLeave}
            activeOpacity={0.8}
            style={{
              height: 52,
              borderRadius: radii.md,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: colors.status.warn }}>
              Leave convoy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
