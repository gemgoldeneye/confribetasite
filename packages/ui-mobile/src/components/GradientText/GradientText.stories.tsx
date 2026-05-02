import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "react-native";
import { GradientText } from "./GradientText.js";

const meta: Meta<typeof GradientText> = {
  title: "Mobile/GradientText",
  component: GradientText,
};
export default meta;
type Story = StoryObj<typeof GradientText>;

export const InHeadline: Story = {
  render: () => (
    <Text className="font-display text-display font-extrabold text-ink">
      Drive Together,{" "}
      <GradientText>Navigate Smarter.</GradientText>
    </Text>
  ),
};

export const VerticalGradient: Story = {
  render: () => (
    <Text className="font-display text-h1 font-bold text-ink">
      Drive together,{" "}
      <GradientText gradient="brandVertical">navigate smarter.</GradientText>
    </Text>
  ),
};
