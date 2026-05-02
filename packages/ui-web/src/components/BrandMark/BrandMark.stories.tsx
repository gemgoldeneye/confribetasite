import type { Meta, StoryObj } from "@storybook/react";
import { BrandMark } from "./BrandMark.js";

const meta: Meta<typeof BrandMark> = {
  title: "Primitives/BrandMark",
  component: BrandMark,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 24, max: 96, step: 4 } },
    variant: { control: { type: "radio" }, options: ["chip", "glyph"] },
  },
};
export default meta;
type Story = StoryObj<typeof BrandMark>;

export const Chip: Story = {
  args: { variant: "chip", size: 40 },
};

export const Glyph: Story = {
  args: { variant: "glyph", size: 40 },
  render: (args) => (
    <div className="text-cyan">
      <BrandMark {...args} />
    </div>
  ),
};

export const SizeScale: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {[28, 40, 56, 72].map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <BrandMark size={s} />
          <span className="font-mono text-caption text-ink-soft">{s}px</span>
        </div>
      ))}
    </div>
  ),
};
