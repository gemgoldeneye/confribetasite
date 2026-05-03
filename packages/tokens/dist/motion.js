/**
 * Motion tokens — durations + easing curves.
 *
 * Motion is a feature, not decoration (per frontend-plan.md). Every
 * transition picks a duration *and* an easing curve from this module.
 * Components must respect `prefers-reduced-motion` regardless.
 */
/** Durations in milliseconds. */
export const duration = {
    /** Sub-perceptual snap — checkbox check, segment switch. */
    instant: 100,
    /** Hover, press, focus rings. */
    fast: 160,
    /** Default page transitions, reveals, modals. */
    base: 240,
    /** Larger panels, bottom sheets, screen pushes. */
    slow: 360,
    /** Deliberate moments — onboarding step transitions, success states. */
    deliberate: 600,
    /** Hero-level moments — splash dismissal, success celebrations. */
    hero: 900,
};
/**
 * Easing curves — CSS cubic-bezier strings. React Native consumers can
 * read the `points` tuple to feed Reanimated / Easing APIs.
 */
export const easing = {
    /** Material standard — most general-purpose. */
    standard: {
        css: "cubic-bezier(0.2, 0, 0, 1)",
        points: [0.2, 0, 0, 1],
    },
    /** Decelerating — incoming elements. */
    decelerate: {
        css: "cubic-bezier(0, 0, 0, 1)",
        points: [0, 0, 0, 1],
    },
    /** Accelerating — outgoing elements. */
    accelerate: {
        css: "cubic-bezier(0.3, 0, 1, 1)",
        points: [0.3, 0, 1, 1],
    },
    /** Springy bounce — confirmation toasts, success reveals. */
    spring: {
        css: "cubic-bezier(0.2, 1.4, 0.6, 1)",
        points: [0.2, 1.4, 0.6, 1],
    },
    /** Standard ease-in-out — symmetric transitions. */
    easeInOut: {
        css: "cubic-bezier(0.4, 0, 0.2, 1)",
        points: [0.4, 0, 0.2, 1],
    },
    /** Linear — only for marquee / continuous loops. */
    linear: {
        css: "linear",
        points: [0, 0, 1, 1],
    },
};
/**
 * Pre-composed transition recipes. Use these instead of hand-rolling
 * `${duration}ms ${easing}` strings in components.
 */
export const transition = {
    /** Hover / focus state on interactive surfaces. */
    hover: { duration: duration.fast, easing: easing.standard },
    /** Press state — subtle scale + opacity dip. */
    press: { duration: duration.instant, easing: easing.accelerate },
    /** Default page / route transition. */
    page: { duration: duration.base, easing: easing.standard },
    /** Modal / bottom-sheet entry. */
    modalEnter: { duration: duration.slow, easing: easing.decelerate },
    /** Modal / bottom-sheet exit. */
    modalExit: { duration: duration.base, easing: easing.accelerate },
    /** Toast / snackbar reveal — bouncy. */
    toast: { duration: duration.slow, easing: easing.spring },
    /** Success celebrations — onboarding completion, "convoy joined". */
    celebrate: { duration: duration.deliberate, easing: easing.spring },
};
//# sourceMappingURL=motion.js.map