import type { ReactNode } from "react";
import { cn } from "../../lib/cn.js";

export interface ToastProps {
  /** Whether the toast is visible. Parent controls timing/dismissal. */
  open: boolean;
  message: ReactNode;
  /** Optional leading icon. Defaults to a check mark. */
  icon?: ReactNode;
  className?: string;
}

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Pill-shaped success toast that slides up from the bottom center
 * of the viewport. Matches the cfhandoff `.toast` pattern: brand
 * gradient surface, dark ink text, springy entry curve.
 *
 * The component is presentational — parents own visibility and
 * dismissal logic. Use a portal in production to escape stacking
 * contexts; Storybook stories don't need one.
 */
export const Toast = ({ open, message, icon = <CheckIcon />, className }: ToastProps) => (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className={cn(
      "pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2",
      "inline-flex items-center gap-2 rounded-pill bg-gradient-brand px-6 py-3",
      "font-display text-body font-bold text-ink-on-accent shadow-toast",
      "transition-transform duration-slow ease-spring",
      open ? "translate-y-0" : "translate-y-24",
      className,
    )}
  >
    <span className="inline-flex shrink-0">{icon}</span>
    <span>{message}</span>
  </div>
);
