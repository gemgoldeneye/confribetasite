import type { Config } from "tailwindcss";
import { colors, radii, spacing, fontFamily, fontSize } from "@confri/tokens";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ground: colors.bg.ground,
        surface: colors.bg.surface,
        elevated: colors.bg.elevated,
        cyan: colors.accent.cyan,
        aqua: colors.accent.aqua,
        teal: colors.accent.teal,
        ink: colors.ink.primary,
        "ink-mute": colors.ink.mute,
        "ink-soft": colors.ink.soft,
        "ink-on-accent": colors.ink.onAccent,
        amber: colors.status.amber,
        warn: colors.status.warn,
        success: colors.status.success,
      },
      fontFamily: {
        display: [fontFamily.display],
        body: [fontFamily.body],
        mono: [fontFamily.mono],
      },
      fontSize: {
        micro: `${fontSize.micro}px`,
        caption: `${fontSize.caption}px`,
        small: `${fontSize.small}px`,
        body: `${fontSize.body}px`,
        lede: `${fontSize.lede}px`,
        lg: `${fontSize.lg}px`,
        h3: `${fontSize.h3}px`,
        h2: `${fontSize.h2}px`,
        h1: `${fontSize.h1}px`,
        display: `${fontSize.display}px`,
      },
      borderRadius: {
        sm: `${radii.sm}px`,
        md: `${radii.md}px`,
        lg: `${radii.lg}px`,
        xl: `${radii.xl}px`,
        xxl: `${radii.xxl}px`,
        pill: `${radii.pill}px`,
      },
      gap: {
        1: `${spacing[1]}px`,
        2: `${spacing[2]}px`,
        3: `${spacing[3]}px`,
        4: `${spacing[4]}px`,
        5: `${spacing[5]}px`,
        6: `${spacing[6]}px`,
      },
    },
  },
} satisfies Config;
