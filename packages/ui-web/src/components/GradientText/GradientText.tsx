import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn.js";

type GradientName = "brand" | "brandVertical";

export interface GradientTextProps<T extends ElementType = "span"> {
  as?: T;
  gradient?: GradientName;
  children: ReactNode;
  className?: string;
}

const gradientClass: Record<GradientName, string> = {
  brand: "bg-gradient-brand",
  brandVertical: "bg-gradient-brand-vertical",
};

/**
 * Inline text painted with a brand gradient via `background-clip: text`.
 *
 * Use sparingly — gradient text is a brand moment, not a default.
 * The fallback (where bg-clip is unsupported) keeps text readable in
 * the cyan accent color.
 */
export const GradientText = <T extends ElementType = "span">({
  as,
  gradient = "brand",
  children,
  className,
  ...rest
}: GradientTextProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof GradientTextProps<T>>) => {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      className={cn(
        gradientClass[gradient],
        "bg-clip-text text-transparent text-cyan",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
};
