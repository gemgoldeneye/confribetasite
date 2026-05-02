import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import { Toast } from "./Toast.js";
import { Button } from "../Button/Button.js";

const meta: Meta<typeof Toast> = {
  title: "Mobile/Toast",
  component: Toast,
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Open: Story = {
  args: { open: true, message: "Copied to clipboard" },
  render: (args) => (
    <View style={{ height: 240, width: 360 }}>
      <Toast {...args} />
    </View>
  ),
};

export const Hidden: Story = {
  args: { open: false, message: "Copied to clipboard" },
  render: (args) => (
    <View style={{ height: 240, width: 360 }}>
      <Toast {...args} />
    </View>
  ),
};

export const Triggerable: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const trigger = () => {
      setOpen(true);
      setTimeout(() => setOpen(false), 1800);
    };
    return (
      <View style={{ height: 320, width: 360, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={trigger}>Show toast</Button>
        <Toast open={open} message="Copied to clipboard" />
      </View>
    );
  },
};
