import { SVGProps } from 'react';
export interface BrandMarkProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
    /** Outer square size in px. Default 40 — matches the cfhandoff lockup. */
    size?: number;
    /** Render as a chip (rounded square + brand gradient + shadow) or just the glyph. */
    variant?: "chip" | "glyph";
    className?: string;
}
/**
 * The ConvoyFriends brand mark — three connected dots representing
 * a convoy of vehicles linked together.
 *
 * - `chip` (default): the lockup version — rounded square, brand gradient,
 *   brand-mark shadow. Use in headers and brand moments.
 * - `glyph`: just the SVG, sized to the parent's color (`currentColor`).
 *   Use inside buttons, list rows, anywhere the chip is overkill.
 */
export declare const BrandMark: ({ size, variant, className, ...rest }: BrandMarkProps) => import("react/jsx-runtime").JSX.Element;
