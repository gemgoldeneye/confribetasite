import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
type GradientName = "brand" | "brandVertical";
export interface GradientTextProps<T extends ElementType = "span"> {
    as?: T;
    gradient?: GradientName;
    children: ReactNode;
    className?: string;
}
/**
 * Inline text painted with a brand gradient via `background-clip: text`.
 *
 * Use sparingly — gradient text is a brand moment, not a default.
 * The fallback (where bg-clip is unsupported) keeps text readable in
 * the cyan accent color.
 */
export declare const GradientText: <T extends ElementType = "span">({ as, gradient, children, className, ...rest }: GradientTextProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof GradientTextProps<T>>) => import("react/jsx-runtime").JSX.Element;
export {};
