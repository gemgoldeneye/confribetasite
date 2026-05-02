import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea.js";

const meta: Meta<typeof Textarea> = {
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [(Story) => <div className="w-[480px]"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: "Dream convoy",
    placeholder: "If you had a weekend convoy trip, where would you go and how many friends?",
    name: "dream",
    rows: 4,
  },
};

export const WithHint: Story = {
  args: {
    label: "Dream convoy",
    placeholder: "Tell us about it…",
    hint: "Be specific — the answer helps us prioritize features.",
    name: "dream",
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    label: "Dream convoy",
    placeholder: "Tell us about it…",
    error: "Tell us a little more — at least 20 characters.",
    defaultValue: "Manila to Baguio",
    name: "dream",
    rows: 4,
  },
};
