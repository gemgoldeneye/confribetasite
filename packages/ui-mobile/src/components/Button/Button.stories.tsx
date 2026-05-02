import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { Button } from "./Button.js";
import { BrandMark } from "../BrandMark/BrandMark.js";
import { tokens } from "@confri/tokens";

const ArrowIcon = ({ color = tokens.colors.ink.primary }: { color?: string }) => (
  <Svg viewBox="0 0 24 24" width={16} height={16} fill="none">
    <Path d="M7 17 17 7M9 7h8v8" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CopyIcon = ({ color = tokens.colors.ink.onAccent }: { color?: string }) => (
  <Svg viewBox="0 0 24 24" width={16} height={16} fill="none">
    <Rect x={9} y={9} width={13} height={13} rx={2} stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 15V5a2 2 0 0 1 2-2h10" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const meta: Meta<typeof Button> = {
  title: "Mobile/Button",
  component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", size: "md", children: "Apply for the beta" },
};

export const PrimaryWithIcon: Story = {
  args: {
    variant: "primary",
    children: "Copy Claude prompt",
    iconLeft: <CopyIcon />,
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Open the landing page",
    iconRight: <ArrowIcon />,
  },
};

export const Variants: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="icon" accessibilityLabel="Brand">
        <BrandMark variant="glyph" size={28} />
      </Button>
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </View>
  ),
};
