import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { Input } from "./Input.js";
import { tokens } from "@confri/tokens";

const MailIcon = () => (
  <Svg viewBox="0 0 24 24" width={16} height={16} fill="none">
    <Rect x={2} y={4} width={20} height={16} rx={2} stroke={tokens.colors.ink.soft} strokeWidth={2} />
    <Path d="m22 7-10 6L2 7" stroke={tokens.colors.ink.soft} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const meta: Meta<typeof Input> = {
  title: "Mobile/Input",
  component: Input,
  decorators: [
    (Story) => (
      <View style={{ width: 360 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: "Full name", placeholder: "Chuck Rodriguez" },
};

export const WithHint: Story = {
  args: {
    label: "City, Region/Country",
    placeholder: "Manila, PH",
    hint: "We use this to match you with nearby beta drivers.",
  },
};

export const WithLeadingIcon: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    keyboardType: "email-address",
    autoCapitalize: "none",
    leadingIcon: <MailIcon />,
  },
};

export const WithError: Story = {
  args: {
    label: "Phone",
    placeholder: "+63 …",
    keyboardType: "phone-pad",
    error: "Phone number must be at least 7 digits.",
    defaultValue: "+63 91",
  },
};
