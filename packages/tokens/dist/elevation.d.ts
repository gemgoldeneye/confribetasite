/**
 * Elevation tokens — shadow recipes per surface depth.
 *
 * The brand shadow is **long, low-opacity, and color-tinted by accent**
 * (project.md §4). Never use neutral grey shadows — they read as
 * generic / off-brand against the night ground.
 *
 * Each token exports both a CSS `box-shadow` string and the structured
 * pieces so React Native (`shadowColor`, `shadowOffset`, etc.) can build
 * its own form.
 */
export interface ShadowRecipe {
    /** CSS `box-shadow` value. */
    css: string;
    /** Structured form for React Native + canvas APIs. */
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    /** RGBA color string. */
    color: string;
    /** Decomposed alpha — for RN `shadowOpacity`. */
    opacity: number;
}
export declare const elevation: {
    /** No shadow. Flat surfaces, inputs at rest. */
    readonly flat: {
        css: string;
        offsetX: number;
        offsetY: number;
        blur: number;
        spread: number;
        color: string;
        opacity: number;
    };
    /** Resting card. Subtle teal tint. */
    readonly resting: ShadowRecipe;
    /** Pressed / hovered card. */
    readonly hover: ShadowRecipe;
    /** Brand-mark, primary buttons (cfhandoff `.brand-mark`). */
    readonly brandMark: ShadowRecipe;
    /** Primary CTA button (cfhandoff `.btn`). */
    readonly cta: ShadowRecipe;
    /** Floating toast / popover (cfhandoff `.toast`). */
    readonly toast: ShadowRecipe;
    /** Modal / bottom sheet — deepest. */
    readonly modal: ShadowRecipe;
};
export type Elevation = keyof typeof elevation;
//# sourceMappingURL=elevation.d.ts.map