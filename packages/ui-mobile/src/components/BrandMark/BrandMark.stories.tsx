import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import { BrandMark } from "./BrandMark.js";

const meta: Meta<typeof BrandMark> = {
  title: "Mobile/BrandMark",
  component: BrandMark,
};
export default meta;
type Story = StoryObj<typeof BrandMark>;

export const Chip: Story = {
  args: { variant: "chip", size: 40 },
};

export const Glyph: Story = {
  args: { variant: "glyph", size: 40 },
};

export const SizeScale: Story = {
  render: () => (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 16 }}>
      {[28, 40, 56, 72].map((s) => (
        <BrandMark key={s} size={s} />
      ))}
    </View>
  ),
};
