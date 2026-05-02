import { Stack } from "expo-router";

export default function ConvoyFlowLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        animation: "slide_from_bottom",
        contentStyle: { backgroundColor: "transparent" },
      }}
    />
  );
}
