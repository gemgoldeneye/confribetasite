import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card.js";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: { type: "radio" }, options: ["glass", "glassElevated", "solid"] },
    padding: { control: { type: "radio" }, options: ["none", "sm", "md", "lg"] },
    radius: { control: { type: "radio" }, options: ["md", "lg", "xl", "xxl"] },
    accentRule: { control: { type: "radio" }, options: ["none", "top"] },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

const Body = () => (
  <>
    <span className="font-display font-bold text-caption uppercase tracking-wider text-cyan">
      Section / 03
    </span>
    <h3 className="mt-3 font-display text-h2 font-bold text-ink">Beta landing page</h3>
    <p className="mt-2 font-body text-body text-ink-mute">
      A self-contained brief covering the product, audience, brand system,
      and the beta landing page already built.
    </p>
  </>
);

export const Glass: Story = {
  args: { variant: "glass", padding: "md", radius: "xl" },
  render: (args) => (
    <div className="w-[480px]">
      <Card {...args}>
        <Body />
      </Card>
    </div>
  ),
};

export const GlassElevated: Story = {
  args: { variant: "glassElevated", padding: "lg", radius: "xxl", accentRule: "top" },
  render: (args) => (
    <div className="w-[480px]">
      <Card {...args}>
        <Body />
      </Card>
    </div>
  ),
};

export const Solid: Story = {
  args: { variant: "solid", padding: "md", radius: "lg" },
  render: (args) => (
    <div className="w-[480px]">
      <Card {...args}>
        <Body />
      </Card>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[1100px]">
      <Card variant="glass" padding="md" radius="xl">
        <Body />
      </Card>
      <Card variant="glassElevated" padding="md" radius="xl" accentRule="top">
        <Body />
      </Card>
      <Card variant="solid" padding="md" radius="xl">
        <Body />
      </Card>
    </div>
  ),
};
