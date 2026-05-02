import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Text, View } from "react-native";
import { RadioSegment } from "./RadioSegment.js";

const meta: Meta<typeof RadioSegment<string>> = {
  title: "Mobile/RadioSegment",
  component: RadioSegment,
};
export default meta;
type Story = StoryObj<typeof RadioSegment<string>>;

export const DevicePicker: Story = {
  args: {
    label: "Your phone",
    options: [
      { value: "iphone", label: "iPhone" },
      { value: "android", label: "Android" },
    ],
    defaultValue: "iphone",
  },
};

export const Controlled: Story = {
  render: () => {
    const [v, setV] = useState<string>("android");
    return (
      <View style={{ gap: 16, alignItems: "center" }}>
        <RadioSegment
          label="Your phone"
          options={[
            { value: "iphone", label: "iPhone" },
            { value: "android", label: "Android" },
          ]}
          value={v}
          onChange={setV}
        />
        <Text className="font-mono text-caption text-ink-soft">
          selected: {v}
        </Text>
      </View>
    );
  },
};

export const ThreeWay: Story = {
  args: {
    label: "Driving lane",
    options: [
      { value: "lead", label: "Lead" },
      { value: "middle", label: "Middle" },
      { value: "tail", label: "Tail" },
    ],
    defaultValue: "middle",
  },
};
