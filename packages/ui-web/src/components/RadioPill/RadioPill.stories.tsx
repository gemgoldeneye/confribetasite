import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioPill } from "./RadioPill.js";

const meta: Meta<typeof RadioPill<string>> = {
  title: "Primitives/RadioPill",
  component: RadioPill,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [(Story) => <div className="w-[640px]"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof RadioPill<string>>;

const VehicleIcon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const vehicleOptions = [
  { value: "motor", label: "Motor", icon: <VehicleIcon d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm14 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-9-3 3-7h4l1 3" /> },
  { value: "car", label: "Car", icon: <VehicleIcon d="M3 17h18M5 17v-4l3-5h8l3 5v4M7 17v2m10-2v2" /> },
  { value: "supercar", label: "Supercar", icon: <VehicleIcon d="M3 16h18M4 16l2-5 4-2h8l3 5v2M7 16v2m10-2v2" /> },
  { value: "truck", label: "Truck", icon: <VehicleIcon d="M2 17h12V8H2zM14 11h5l3 3v3H14M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /> },
  { value: "bus", label: "Bus", icon: <VehicleIcon d="M5 17V6h14v11M5 13h14M7 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /> },
] as const;

export const VehiclePicker: Story = {
  args: {
    name: "vehicle",
    label: "Your vehicle",
    options: vehicleOptions,
  },
};

export const Controlled: Story = {
  render: () => {
    const [v, setV] = useState<string>("car");
    return (
      <div className="flex flex-col gap-4">
        <RadioPill
          name="vehicle-controlled"
          label="Your vehicle"
          options={vehicleOptions}
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

export const WithError: Story = {
  args: {
    name: "vehicle-error",
    label: "Your vehicle",
    options: vehicleOptions,
    error: "Pick the vehicle you'll be driving in convoy.",
  },
};
