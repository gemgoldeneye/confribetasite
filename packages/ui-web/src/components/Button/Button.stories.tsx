import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button.js";
import { BrandMark } from "../BrandMark/BrandMark.js";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <rect x={9} y={9} width={13} height={13} rx={2} />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: { type: "radio" }, options: ["primary", "ghost", "icon"] },
    size: { control: { type: "radio" }, options: ["sm", "md", "lg"] },
  },
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

export const Icon: Story = {
  args: {
    variant: "icon",
    children: <BrandMark variant="glyph" size={40} />,
    "aria-label": "ConvoyFriends",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="icon" aria-label="Brand"><BrandMark variant="glyph" size={28} /></Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: "primary", children: "Locked", disabled: true },
};
