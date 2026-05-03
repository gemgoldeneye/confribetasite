/**
 * Motion tokens — durations + easing curves.
 *
 * Motion is a feature, not decoration (per frontend-plan.md). Every
 * transition picks a duration *and* an easing curve from this module.
 * Components must respect `prefers-reduced-motion` regardless.
 */
/** Durations in milliseconds. */
export declare const duration: {
    /** Sub-perceptual snap — checkbox check, segment switch. */
    readonly instant: 100;
    /** Hover, press, focus rings. */
    readonly fast: 160;
    /** Default page transitions, reveals, modals. */
    readonly base: 240;
    /** Larger panels, bottom sheets, screen pushes. */
    readonly slow: 360;
    /** Deliberate moments — onboarding step transitions, success states. */
    readonly deliberate: 600;
    /** Hero-level moments — splash dismissal, success celebrations. */
    readonly hero: 900;
};
export type Duration = keyof typeof duration;
/**
 * Easing curves — CSS cubic-bezier strings. React Native consumers can
 * read the `points` tuple to feed Reanimated / Easing APIs.
 */
export declare const easing: {
    /** Material standard — most general-purpose. */
    readonly standard: {
        readonly css: "cubic-bezier(0.2, 0, 0, 1)";
        readonly points: readonly [0.2, 0, 0, 1];
    };
    /** Decelerating — incoming elements. */
    readonly decelerate: {
        readonly css: "cubic-bezier(0, 0, 0, 1)";
        readonly points: readonly [0, 0, 0, 1];
    };
    /** Accelerating — outgoing elements. */
    readonly accelerate: {
        readonly css: "cubic-bezier(0.3, 0, 1, 1)";
        readonly points: readonly [0.3, 0, 1, 1];
    };
    /** Springy bounce — confirmation toasts, success reveals. */
    readonly spring: {
        readonly css: "cubic-bezier(0.2, 1.4, 0.6, 1)";
        readonly points: readonly [0.2, 1.4, 0.6, 1];
    };
    /** Standard ease-in-out — symmetric transitions. */
    readonly easeInOut: {
        readonly css: "cubic-bezier(0.4, 0, 0.2, 1)";
        readonly points: readonly [0.4, 0, 0.2, 1];
    };
    /** Linear — only for marquee / continuous loops. */
    readonly linear: {
        readonly css: "linear";
        readonly points: readonly [0, 0, 1, 1];
    };
};
export type Easing = keyof typeof easing;
/**
 * Pre-composed transition recipes. Use these instead of hand-rolling
 * `${duration}ms ${easing}` strings in components.
 */
export declare const transition: {
    /** Hover / focus state on interactive surfaces. */
    readonly hover: {
        readonly duration: 160;
        readonly easing: {
            readonly css: "cubic-bezier(0.2, 0, 0, 1)";
            readonly points: readonly [0.2, 0, 0, 1];
        };
    };
    /** Press state — subtle scale + opacity dip. */
    readonly press: {
        readonly duration: 100;
        readonly easing: {
            readonly css: "cubic-bezier(0.3, 0, 1, 1)";
            readonly points: readonly [0.3, 0, 1, 1];
        };
    };
    /** Default page / route transition. */
    readonly page: {
        readonly duration: 240;
        readonly easing: {
            readonly css: "cubic-bezier(0.2, 0, 0, 1)";
            readonly points: readonly [0.2, 0, 0, 1];
        };
    };
    /** Modal / bottom-sheet entry. */
    readonly modalEnter: {
        readonly duration: 360;
        readonly easing: {
            readonly css: "cubic-bezier(0, 0, 0, 1)";
            readonly points: readonly [0, 0, 0, 1];
        };
    };
    /** Modal / bottom-sheet exit. */
    readonly modalExit: {
        readonly duration: 240;
        readonly easing: {
            readonly css: "cubic-bezier(0.3, 0, 1, 1)";
            readonly points: readonly [0.3, 0, 1, 1];
        };
    };
    /** Toast / snackbar reveal — bouncy. */
    readonly toast: {
        readonly duration: 360;
        readonly easing: {
            readonly css: "cubic-bezier(0.2, 1.4, 0.6, 1)";
            readonly points: readonly [0.2, 1.4, 0.6, 1];
        };
    };
    /** Success celebrations — onboarding completion, "convoy joined". */
    readonly celebrate: {
        readonly duration: 600;
        readonly easing: {
            readonly css: "cubic-bezier(0.2, 1.4, 0.6, 1)";
            readonly points: readonly [0.2, 1.4, 0.6, 1];
        };
    };
};
export type Transition = keyof typeof transition;
//# sourceMappingURL=motion.d.ts.map