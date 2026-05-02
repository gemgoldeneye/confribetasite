import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioSegment } from "./RadioSegment.js";

const meta: Meta<typeof RadioSegment<string>> = {
  title: "Primitives/RadioSegment",
  component: RadioSegment,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof RadioSegment<string>>;

export const DevicePicker: Story = {
  args: {
    name: "device",
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
      <div className="flex flex-col items-center gap-4">
        <RadioSegment
          name="device-controlled"
          label="Your phone"
          options={[
            { value: "iphone", label: "iPhone" },
            { value: "android", label: "Android" },
          ]}
          value={v}
          onChange={setV}
        />
        <p className="font-mono text-caption text-ink-soft">
          selected: <span className="text-cyan">{v}</span>
        </p>
      </div>
    );
  },
};

export const ThreeWay: Story = {
  args: {
    name: "lane",
    label: "Driving lane",
    options: [
      { value: "lead", label: "Lead" },
      { value: "middle", label: "Middle" },
      { value: "tail", label: "Tail" },
    ],
    defaultValue: "middle",
  },
};
