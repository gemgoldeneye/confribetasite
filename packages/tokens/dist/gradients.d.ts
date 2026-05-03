/**
 * Gradient tokens.
 *
 * Each gradient is exported as both a CSS string (for web) and a
 * structured `stops` array (for React Native, Canvas, SVG, etc.).
 * Consumers should never reconstruct a gradient by hand — pick one here.
 */
export interface GradientStop {
    /** Hex color at this stop. */
    color: string;
    /** Position along the gradient axis, 0–100 (percent). */
    position: number;
}
export interface LinearGradient {
    /** Angle in degrees, CSS convention (0 = bottom→top, 90 = left→right). */
    angle: number;
    stops: readonly GradientStop[];
    /** Pre-rendered CSS `linear-gradient(...)` string. */
    css: string;
}
export declare const gradients: {
    /**
     * The single canonical brand gradient. 92° cyan → aqua → teal.
     * Use for: primary buttons, eyebrow rules, headline accents,
     * brand-mark surface, focus glows. Never on large flat surfaces.
     */
    readonly brand: {
        readonly angle: 92;
        readonly stops: readonly [{
            readonly color: "#3DD9F5";
            readonly position: 0;
        }, {
            readonly color: "#34D2C7";
            readonly position: 48;
        }, {
            readonly color: "#2BC4A8";
            readonly position: 100;
        }];
        readonly css: "linear-gradient(92deg, #3DD9F5 0%, #34D2C7 48%, #2BC4A8 100%)";
    };
    /**
     * Vertical brand gradient — used in section dividers and the
     * 2px highlight rule above intro cards (`.intro::before`).
     */
    readonly brandVertical: {
        readonly angle: 180;
        readonly stops: readonly [{
            readonly color: "#3DD9F5";
            readonly position: 0;
        }, {
            readonly color: "#34D2C7";
            readonly position: 48;
        }, {
            readonly color: "#2BC4A8";
            readonly position: 100;
        }];
        readonly css: "linear-gradient(180deg, #3DD9F5 0%, #34D2C7 48%, #2BC4A8 100%)";
    };
    /**
     * Glass-card backdrop. Subtle vertical fade, used on cards that
     * sit on the night ground (`section.block`, `.intro`).
     */
    readonly surfaceCard: {
        readonly angle: 180;
        readonly stops: readonly [{
            readonly color: "rgba(15, 30, 54, 0.55)";
            readonly position: 0;
        }, {
            readonly color: "rgba(10, 22, 40, 0.30)";
            readonly position: 100;
        }];
        readonly css: "linear-gradient(180deg, rgba(15,30,54,0.55) 0%, rgba(10,22,40,0.30) 100%)";
    };
    /**
     * Elevated glass-card backdrop — slightly more opaque than `surfaceCard`.
     */
    readonly surfaceCardElevated: {
        readonly angle: 180;
        readonly stops: readonly [{
            readonly color: "rgba(15, 30, 54, 0.70)";
            readonly position: 0;
        }, {
            readonly color: "rgba(10, 22, 40, 0.40)";
            readonly position: 100;
        }];
        readonly css: "linear-gradient(180deg, rgba(15,30,54,0.70) 0%, rgba(10,22,40,0.40) 100%)";
    };
};
export type Gradients = typeof gradients;
export type GradientName = keyof Gradients;
//# sourceMappingURL=gradients.d.ts.map