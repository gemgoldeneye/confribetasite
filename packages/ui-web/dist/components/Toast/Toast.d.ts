import { ReactNode } from 'react';
export interface ToastProps {
    /** Whether the toast is visible. Parent controls timing/dismissal. */
    open: boolean;
    message: ReactNode;
    /** Optional leading icon. Defaults to a check mark. */
    icon?: ReactNode;
    className?: string;
}
/**
 * Pill-shaped success toast that slides up from the bottom center
 * of the viewport. Matches the cfhandoff `.toast` pattern: brand
 * gradient surface, dark ink text, springy entry curve.
 *
 * The component is presentational — parents own visibility and
 * dismissal logic. Use a portal in production to escape stacking
 * contexts; Storybook stories don't need one.
 */
export declare const Toast: ({ open, message, icon, className }: ToastProps) => import("react/jsx-runtime").JSX.Element;
