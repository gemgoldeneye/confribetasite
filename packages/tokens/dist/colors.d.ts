/**
 * Color tokens — every authoritative color in the ConvoyFriends brand.
 *
 * Source of truth: project.md §4. Do not introduce raw hex values
 * elsewhere in the codebase — import from this module instead.
 */
export declare const colors: {
    /** Page-level surfaces, darkest → lightest */
    readonly bg: {
        /** Page background. The night ground. */
        readonly ground: "#050B16";
        /** Card / surface background — sits one step above ground. */
        readonly surface: "#0A1628";
        /** Elevated card / modal — sits two steps above ground. */
        readonly elevated: "#0F1E36";
    };
    /** Brand accents — used on highlights, never on large surfaces. */
    readonly accent: {
        readonly cyan: "#3DD9F5";
        /** Midpoint of the brand gradient. Useful as a single solid token. */
        readonly aqua: "#34D2C7";
        readonly teal: "#2BC4A8";
    };
    /** Status / feedback colors — extend the brand without breaking it. */
    readonly status: {
        /** "Heads up" — used for late drivers in the 3–10 min ETA range (F6). */
        readonly amber: "#F2B26B";
        /** "Critical" — used for late drivers >10 min, error states (F6). */
        readonly warn: "#F26B6B";
        /** "Success" — voice on, convoy joined. Re-uses brand teal. */
        readonly success: "#2BC4A8";
    };
    /** Text colors — primary, secondary, tertiary on the night ground. */
    readonly ink: {
        /** Body and primary headings. */
        readonly primary: "#F5F8FF";
        /** Secondary text — lede copy, captions. */
        readonly mute: "#9AA8C2";
        /** Tertiary text — meta lines, footers, labels. */
        readonly soft: "#6B7891";
        /** On the brand gradient — sits on the cyan→teal surface. */
        readonly onAccent: "#06121F";
    };
    /** Hairline borders / dividers. Low-alpha whites over dark surfaces. */
    readonly line: {
        readonly subtle: "rgba(255, 255, 255, 0.08)";
        readonly strong: "rgba(255, 255, 255, 0.16)";
        /** Used for hover/focus emphasis on otherwise-subtle borders. */
        readonly accent: "rgba(61, 217, 245, 0.30)";
    };
    /** Translucent fills — for glass-card surfaces over the night ground. */
    readonly glass: {
        /** Faint wash, used on .pill and meta backgrounds. */
        readonly wash: "rgba(255, 255, 255, 0.02)";
        /** Light wash, used on hover states. */
        readonly hover: "rgba(255, 255, 255, 0.04)";
        /** Tinted brand wash, used to indicate active/selected. */
        readonly tinted: "rgba(61, 217, 245, 0.06)";
    };
};
export type Colors = typeof colors;
//# sourceMappingURL=colors.d.ts.map