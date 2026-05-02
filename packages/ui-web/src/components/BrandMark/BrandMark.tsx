import type { SVGProps } from "react";
import { cn } from "../../lib/cn.js";

export interface BrandMarkProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Outer square size in px. Default 40 — matches the cfhandoff lockup. */
  size?: number;
  /** Render as a chip (rounded square + brand gradient + shadow) or just the glyph. */
  variant?: "chip" | "glyph";
  className?: string;
}

const Glyph = ({ size, ...rest }: { size: number } & SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={Math.round(size * 0.55)}
    height={Math.round(size * 0.55)}
    fill="none"
    aria-hidden="true"
    {...rest}
  >
    <circle cx={5} cy={12} r={2.4} fill="currentColor" />
    <circle cx={12} cy={6} r={2.4} fill="currentColor" />
    <circle cx={19} cy={12} r={2.4} fill="currentColor" />
    <path
      d="M6.5 11 10.5 7M13.5 7l4 4M6.5 13l11 0"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * The ConvoyFriends brand mark — three connected dots representing
 * a convoy of vehicles linked together.
 *
 * - `chip` (default): the lockup version — rounded square, brand gradient,
 *   brand-mark shadow. Use in headers and brand moments.
 * - `glyph`: just the SVG, sized to the parent's color (`currentColor`).
 *   Use inside buttons, list rows, anywhere the chip is overkill.
 */
export const BrandMark = ({
  size = 40,
  variant = "chip",
  className,
  ...rest
}: BrandMarkProps) => {
  if (variant === "glyph") {
    return (
      <Glyph size={size} className={cn("text-ink", className)} {...rest} />
    );
  }
  return (
    <span
      className={cn(
        "inline-grid place-items-center bg-gradient-brand shadow-brand-mark text-ink-on-accent",
        className,
      )}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.275) }}
      role="img"
      aria-label="ConvoyFriends"
    >
      <Glyph size={size} />
    </span>
  );
};
