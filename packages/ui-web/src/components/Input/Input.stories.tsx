import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input.js";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x={2} y={4} width={20} height={16} rx={2} />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [(Story) => <div className="w-[420px]"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: "Full name", placeholder: "Chuck Rodriguez", name: "name" },
};

export const WithHint: Story = {
  args: {
    label: "City, Region/Country",
    placeholder: "Manila, PH",
    hint: "We use this to match you with nearby beta drivers.",
    name: "location",
  },
};

export const WithLeadingIcon: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    type: "email",
    leadingIcon: <MailIcon />,
    name: "email",
  },
};

export const WithError: Story = {
  args: {
    label: "Phone",
    placeholder: "+63 …",
    type: "tel",
    error: "Phone number must be at least 7 digits.",
    defaultValue: "+63 91",
    name: "phone",
  },
};

export const Stack: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <Input label="Full name" placeholder="Chuck Rodriguez" name="name1" />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leadingIcon={<MailIcon />}
        name="email1"
      />
      <Input
        label="Phone"
        type="tel"
        placeholder="+63 …"
        error="Phone number must be at least 7 digits."
        defaultValue="+63 91"
        name="phone1"
      />
    </div>
  ),
};
