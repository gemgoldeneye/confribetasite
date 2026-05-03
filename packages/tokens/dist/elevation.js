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
const tealShadow = (offsetY, blur, spread, opacity) => ({
    css: `0 ${offsetY}px ${blur}px ${spread}px rgba(43, 196, 168, ${opacity})`,
    offsetX: 0,
    offsetY,
    blur,
    spread,
    color: `rgba(43, 196, 168, ${opacity})`,
    opacity,
});
const cyanShadow = (offsetY, blur, spread, opacity) => ({
    css: `0 ${offsetY}px ${blur}px ${spread}px rgba(61, 217, 245, ${opacity})`,
    offsetX: 0,
    offsetY,
    blur,
    spread,
    color: `rgba(61, 217, 245, ${opacity})`,
    opacity,
});
export const elevation = {
    /** No shadow. Flat surfaces, inputs at rest. */
    flat: {
        css: "none",
        offsetX: 0,
        offsetY: 0,
        blur: 0,
        spread: 0,
        color: "transparent",
        opacity: 0,
    },
    /** Resting card. Subtle teal tint. */
    resting: tealShadow(4, 12, -6, 0.18),
    /** Pressed / hovered card. */
    hover: tealShadow(8, 24, -8, 0.30),
    /** Brand-mark, primary buttons (cfhandoff `.brand-mark`). */
    brandMark: cyanShadow(10, 30, -10, 0.55),
    /** Primary CTA button (cfhandoff `.btn`). */
    cta: tealShadow(14, 30, -14, 0.55),
    /** Floating toast / popover (cfhandoff `.toast`). */
    toast: tealShadow(20, 40, -16, 0.50),
    /** Modal / bottom sheet — deepest. */
    modal: tealShadow(28, 48, -16, 0.55),
};
//# sourceMappingURL=elevation.js.map