/**
 * Typography tokens.
 *
 * - Display: Sora — headlines, UI labels, brand moments.
 * - Body: Inter — long-form copy, form fields.
 * - Mono: JetBrains Mono — IDs, codes, reference strings.
 *
 * Consumers (ui-web, ui-mobile) own font *loading* — Google Fonts CDN
 * for web, expo-font for mobile. This module declares names + weights only.
 */
export declare const fontFamily: {
    readonly display: "Sora";
    readonly body: "Inter";
    readonly mono: "JetBrains Mono";
};
export type FontFamily = typeof fontFamily;
/**
 * Font weights, expressed as strings so they pass through to both
 * CSS `font-weight` and React Native `fontWeight` without coercion.
 */
export declare const fontWeight: {
    readonly regular: "400";
    readonly medium: "500";
    readonly semibold: "600";
    readonly bold: "700";
    readonly extrabold: "800";
};
export type FontWeight = keyof typeof fontWeight;
/**
 * Type scale — sizes in px. Matches the cfhandoff.html lockup:
 * meta lines 12–13, body 14.5, lede 16.5, h2 22, h1 clamped 34→52.
 */
export declare const fontSize: {
    readonly micro: 11;
    readonly caption: 12;
    readonly small: 13;
    readonly body: 14.5;
    readonly lede: 16.5;
    readonly lg: 18;
    readonly h3: 20;
    readonly h2: 22;
    readonly h1: 34;
    readonly display: 52;
};
export type FontSize = keyof typeof fontSize;
/**
 * Letter-spacing values. CSS uses em (multiplied by font size at render
 * time); React Native uses absolute px. Both are exported so each
 * platform can pick the correct unit.
 */
export declare const letterSpacing: {
    /** Headlines — Sora @ -0.025em looks right per cfhandoff. */
    readonly tight: {
        readonly em: -0.025;
    };
    /** Eyebrow / uppercase labels — wider tracking. */
    readonly wide: {
        readonly em: 0.14;
    };
    /** Body — system default. */
    readonly normal: {
        readonly em: 0;
    };
};
export type LetterSpacing = keyof typeof letterSpacing;
/**
 * Line heights — unitless multipliers (CSS-friendly).
 */
export declare const lineHeight: {
    /** Display headlines — `h1` line-height 1.05. */
    readonly display: 1.05;
    /** Section headings. */
    readonly heading: 1.2;
    /** Tight body. */
    readonly tight: 1.55;
    /** Default body. */
    readonly body: 1.65;
    /** Looser body — used for the lede. */
    readonly loose: 1.7;
};
export type LineHeight = keyof typeof lineHeight;
/**
 * Composed roles — semantic styles that compose family + weight + size + tracking.
 * Use these in components rather than the atomic tokens above when possible.
 */
export declare const textStyles: {
    readonly display: {
        readonly family: "Sora";
        readonly weight: "800";
        readonly size: 52;
        readonly lineHeight: 1.05;
        readonly letterSpacing: {
            readonly em: -0.025;
        };
    };
    readonly h1: {
        readonly family: "Sora";
        readonly weight: "800";
        readonly size: 34;
        readonly lineHeight: 1.2;
        readonly letterSpacing: {
            readonly em: -0.025;
        };
    };
    readonly h2: {
        readonly family: "Sora";
        readonly weight: "700";
        readonly size: 22;
        readonly lineHeight: 1.2;
        readonly letterSpacing: {
            readonly em: -0.015;
        };
    };
    readonly h3: {
        readonly family: "Sora";
        readonly weight: "600";
        readonly size: 20;
        readonly lineHeight: 1.2;
        readonly letterSpacing: {
            readonly em: -0.01;
        };
    };
    readonly eyebrow: {
        readonly family: "Sora";
        readonly weight: "700";
        readonly size: 12;
        readonly lineHeight: 1.2;
        readonly letterSpacing: {
            readonly em: 0.14;
        };
        readonly textTransform: "uppercase";
    };
    readonly lede: {
        readonly family: "Inter";
        readonly weight: "400";
        readonly size: 16.5;
        readonly lineHeight: 1.65;
        readonly letterSpacing: {
            readonly em: 0;
        };
    };
    readonly body: {
        readonly family: "Inter";
        readonly weight: "400";
        readonly size: 14.5;
        readonly lineHeight: 1.65;
        readonly letterSpacing: {
            readonly em: 0;
        };
    };
    readonly bodyStrong: {
        readonly family: "Inter";
        readonly weight: "600";
        readonly size: 14.5;
        readonly lineHeight: 1.65;
        readonly letterSpacing: {
            readonly em: 0;
        };
    };
    readonly label: {
        readonly family: "Sora";
        readonly weight: "700";
        readonly size: 13;
        readonly lineHeight: 1.2;
        readonly letterSpacing: {
            readonly em: 0;
        };
    };
    readonly caption: {
        readonly family: "Inter";
        readonly weight: "500";
        readonly size: 12;
        readonly lineHeight: 1.2;
        readonly letterSpacing: {
            readonly em: 0;
        };
    };
    readonly mono: {
        readonly family: "JetBrains Mono";
        readonly weight: "500";
        readonly size: 14.5;
        readonly lineHeight: 1.2;
        readonly letterSpacing: {
            readonly em: 0;
        };
    };
    readonly monoLarge: {
        readonly family: "JetBrains Mono";
        readonly weight: "600";
        readonly size: 22;
        readonly lineHeight: 1.2;
        readonly letterSpacing: {
            readonly em: 0;
        };
    };
};
export type TextStyle = keyof typeof textStyles;
//# sourceMappingURL=typography.d.ts.map