/**
 * Border-radius tokens — px values.
 *
 * Component vocabulary from project.md §4: rounded radii 12–24px is the
 * brand sweet spot. Outside that range needs a justification.
 */
export declare const radii: {
    /** Square corners. Use sparingly — the brand is friendly, not industrial. */
    readonly none: 0;
    /** Small chips, tags, segmented controls. */
    readonly sm: 8;
    /** Inputs, buttons, compact cards. **Brand floor: 12px.** */
    readonly md: 12;
    /** Standard cards. */
    readonly lg: 16;
    /** Sectioned cards (`section.block`). */
    readonly xl: 20;
    /** Hero cards, intro panels. **Brand ceiling: 24px.** */
    readonly xxl: 24;
    /** Pills, fully-round chips, dot indicators. */
    readonly pill: 999;
};
export type Radius = keyof typeof radii;
//# sourceMappingURL=radii.d.ts.map