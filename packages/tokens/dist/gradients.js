/**
 * Gradient tokens.
 *
 * Each gradient is exported as both a CSS string (for web) and a
 * structured `stops` array (for React Native, Canvas, SVG, etc.).
 * Consumers should never reconstruct a gradient by hand — pick one here.
 */
const brandStops = [
    { color: "#3DD9F5", position: 0 },
    { color: "#34D2C7", position: 48 },
    { color: "#2BC4A8", position: 100 },
];
export const gradients = {
    /**
     * The single canonical brand gradient. 92° cyan → aqua → teal.
     * Use for: primary buttons, eyebrow rules, headline accents,
     * brand-mark surface, focus glows. Never on large flat surfaces.
     */
    brand: {
        angle: 92,
        stops: brandStops,
        css: "linear-gradient(92deg, #3DD9F5 0%, #34D2C7 48%, #2BC4A8 100%)",
    },
    /**
     * Vertical brand gradient — used in section dividers and the
     * 2px highlight rule above intro cards (`.intro::before`).
     */
    brandVertical: {
        angle: 180,
        stops: brandStops,
        css: "linear-gradient(180deg, #3DD9F5 0%, #34D2C7 48%, #2BC4A8 100%)",
    },
    /**
     * Glass-card backdrop. Subtle vertical fade, used on cards that
     * sit on the night ground (`section.block`, `.intro`).
     */
    surfaceCard: {
        angle: 180,
        stops: [
            { color: "rgba(15, 30, 54, 0.55)", position: 0 },
            { color: "rgba(10, 22, 40, 0.30)", position: 100 },
        ],
        css: "linear-gradient(180deg, rgba(15,30,54,0.55) 0%, rgba(10,22,40,0.30) 100%)",
    },
    /**
     * Elevated glass-card backdrop — slightly more opaque than `surfaceCard`.
     */
    surfaceCardElevated: {
        angle: 180,
        stops: [
            { color: "rgba(15, 30, 54, 0.70)", position: 0 },
            { color: "rgba(10, 22, 40, 0.40)", position: 100 },
        ],
        css: "linear-gradient(180deg, rgba(15,30,54,0.70) 0%, rgba(10,22,40,0.40) 100%)",
    },
};
//# sourceMappingURL=gradients.js.map