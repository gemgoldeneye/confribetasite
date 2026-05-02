import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast.js";
import { Button } from "../Button/Button.js";

const meta: Meta<typeof Toast> = {
  title: "Primitives/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Open: Story = {
  args: { open: true, message: "Copied to clipboard" },
  render: (args) => (
    <div className="relative h-[300px] w-full">
      <Toast {...args} />
    </div>
  ),
};

export const Hidden: Story = {
  args: { open: false, message: "Copied to clipboard" },
  render: (args) => (
    <div className="relative h-[300px] w-full">
      <Toast {...args} />
    </div>
  ),
};

export const Triggerable: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const trigger = () => {
      setOpen(true);
      window.setTimeout(() => setOpen(false), 1800);
    };
    return (
      <div className="relative flex h-[400px] flex-col items-center justify-center">
        <Button onClick={trigger}>Show toast</Button>
        <Toast open={open} message="Copied to clipboard" />
      </div>
    );
  },
};
