/**
 * Color tokens — every authoritative color in the ConvoyFriends brand.
 *
 * Source of truth: project.md §4. Do not introduce raw hex values
 * elsewhere in the codebase — import from this module instead.
 */
export const colors = {
    /** Page-level surfaces, darkest → lightest */
    bg: {
        /** Page background. The night ground. */
        ground: "#050B16",
        /** Card / surface background — sits one step above ground. */
        surface: "#0A1628",
        /** Elevated card / modal — sits two steps above ground. */
        elevated: "#0F1E36",
    },
    /** Brand accents — used on highlights, never on large surfaces. */
    accent: {
        cyan: "#3DD9F5",
        /** Midpoint of the brand gradient. Useful as a single solid token. */
        aqua: "#34D2C7",
        teal: "#2BC4A8",
    },
    /** Status / feedback colors — extend the brand without breaking it. */
    status: {
        /** "Heads up" — used for late drivers in the 3–10 min ETA range (F6). */
        amber: "#F2B26B",
        /** "Critical" — used for late drivers >10 min, error states (F6). */
        warn: "#F26B6B",
        /** "Success" — voice on, convoy joined. Re-uses brand teal. */
        success: "#2BC4A8",
    },
    /** Text colors — primary, secondary, tertiary on the night ground. */
    ink: {
        /** Body and primary headings. */
        primary: "#F5F8FF",
        /** Secondary text — lede copy, captions. */
        mute: "#9AA8C2",
        /** Tertiary text — meta lines, footers, labels. */
        soft: "#6B7891",
        /** On the brand gradient — sits on the cyan→teal surface. */
        onAccent: "#06121F",
    },
    /** Hairline borders / dividers. Low-alpha whites over dark surfaces. */
    line: {
        subtle: "rgba(255, 255, 255, 0.08)",
        strong: "rgba(255, 255, 255, 0.16)",
        /** Used for hover/focus emphasis on otherwise-subtle borders. */
        accent: "rgba(61, 217, 245, 0.30)",
    },
    /** Translucent fills — for glass-card surfaces over the night ground. */
    glass: {
        /** Faint wash, used on .pill and meta backgrounds. */
        wash: "rgba(255, 255, 255, 0.02)",
        /** Light wash, used on hover states. */
        hover: "rgba(255, 255, 255, 0.04)",
        /** Tinted brand wash, used to indicate active/selected. */
        tinted: "rgba(61, 217, 245, 0.06)",
    },
};
//# sourceMappingURL=colors.js.map