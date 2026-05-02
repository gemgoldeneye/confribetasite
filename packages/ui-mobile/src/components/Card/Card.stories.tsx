import type { Meta, StoryObj } from "@storybook/react";
import { Text, View } from "react-native";
import { Card } from "./Card.js";

const meta: Meta<typeof Card> = {
  title: "Mobile/Card",
  component: Card,
};
export default meta;
type Story = StoryObj<typeof Card>;

const Body = () => (
  <>
    <Text className="font-display text-caption font-bold text-cyan">
      SECTION / 03
    </Text>
    <Text className="mt-3 font-display text-h2 font-bold text-ink">
      Beta landing page
    </Text>
    <Text className="mt-2 font-body text-body text-ink-mute">
      A self-contained brief covering the product, audience, brand system,
      and the beta landing page already built.
    </Text>
  </>
);

export const Glass: Story = {
  args: { variant: "glass", padding: "md", radius: "xl" },
  render: (args) => (
    <View style={{ width: 360 }}>
      <Card {...args}>
        <Body />
      </Card>
    </View>
  ),
};

export const GlassElevated: Story = {
  args: { variant: "glassElevated", padding: "lg", radius: "xxl", accentRule: "top" },
  render: (args) => (
    <View style={{ width: 360 }}>
      <Card {...args}>
        <Body />
      </Card>
    </View>
  ),
};

export const Solid: Story = {
  args: { variant: "solid", padding: "md", radius: "lg" },
  render: (args) => (
    <View style={{ width: 360 }}>
      <Card {...args}>
        <Body />
      </Card>
    </View>
  ),
};
