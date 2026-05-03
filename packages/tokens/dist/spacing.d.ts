/**
 * Spacing tokens — 4pt grid.
 *
 * Numeric keys map to multiples of 4px (Tailwind-style):
 *   spacing[2] === 8, spacing[6] === 24, etc.
 *
 * Use these for padding, margin, gap, and icon hit-target sizing.
 * Hit targets must be ≥ spacing[11] (44pt) for a11y.
 */
export declare const spacing: {
    readonly 0: 0;
    readonly px: 1;
    readonly 1: 4;
    readonly 2: 8;
    readonly 3: 12;
    readonly 4: 16;
    readonly 5: 20;
    readonly 6: 24;
    readonly 7: 28;
    readonly 8: 32;
    readonly 9: 36;
    readonly 10: 40;
    readonly 11: 44;
    readonly 12: 48;
    readonly 14: 56;
    readonly 16: 64;
    readonly 20: 80;
    readonly 24: 96;
    readonly 32: 128;
};
export type Spacing = keyof typeof spacing;
/**
 * Minimum touch target on iOS HIG / Android Material — 44pt / 48dp.
 * Use as a floor for any tappable element.
 */
export declare const minTouchTarget: 44;
/**
 * Page gutter — outer horizontal padding for content.
 * Matches the cfhandoff `.wrap { padding: 48px 28px 80px }`.
 */
export declare const gutter: {
    readonly mobile: 20;
    readonly tablet: 28;
    readonly desktop: 48;
};
//# sourceMappingURL=spacing.d.ts.map