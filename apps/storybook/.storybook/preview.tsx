import type { Preview } from "@storybook/react";
import "../src/main.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "Night ground",
      values: [
        { name: "Night ground", value: "#050B16" },
        { name: "Navy surface", value: "#0A1628" },
        { name: "Deep navy", value: "#0F1E36" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: {
        base: "dark",
        appBg: "#050B16",
        appContentBg: "#0A1628",
        appBorderColor: "rgba(255,255,255,0.08)",
        textColor: "#F5F8FF",
        textMutedColor: "#9AA8C2",
        barTextColor: "#9AA8C2",
        barSelectedColor: "#3DD9F5",
        barBg: "#0A1628",
        colorPrimary: "#3DD9F5",
        colorSecondary: "#2BC4A8",
      },
    },
  },
  globalTypes: {
    surface: {
      description: "Background surface for stories",
      defaultValue: "ground",
      toolbar: {
        title: "Surface",
        icon: "paintbrush",
        items: [
          { value: "ground", title: "Ground (#050B16)" },
          { value: "surface", title: "Surface (#0A1628)" },
          { value: "elevated", title: "Elevated (#0F1E36)" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
