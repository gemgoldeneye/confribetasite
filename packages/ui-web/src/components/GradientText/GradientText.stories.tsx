import type { Meta, StoryObj } from "@storybook/react";
import { GradientText } from "./GradientText.js";

const meta: Meta<typeof GradientText> = {
  title: "Primitives/GradientText",
  component: GradientText,
  tags: ["autodocs"],
  argTypes: {
    gradient: { control: { type: "radio" }, options: ["brand", "brandVertical"] },
  },
};
export default meta;
type Story = StoryObj<typeof GradientText>;

export const InHeadline: Story = {
  args: { children: "Drive Together, Navigate Smarter." },
  render: (args) => (
    <h1 className="font-display text-display font-extrabold leading-display tracking-tight text-ink">
      Everything you need to <GradientText {...args} />
    </h1>
  ),
};

export const VerticalGradient: Story = {
  args: { children: "navigate smarter.", gradient: "brandVertical" },
  render: (args) => (
    <p className="font-display text-h1 font-bold text-ink">
      Drive together, <GradientText {...args} />
    </p>
  ),
};

export const AsParagraph: Story = {
  render: () => (
    <p className="font-body text-lede text-ink-mute">
      Apply to the{" "}
      <GradientText as="strong" className="font-display font-bold">
        300-driver beta
      </GradientText>{" "}
      and help shape the first version.
    </p>
  ),
};
