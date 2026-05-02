import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn.js";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-display font-bold",
    "cursor-pointer select-none",
    "transition-[transform,filter,box-shadow,background-color,color] duration-fast ease-standard",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ground",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-brand text-ink-on-accent shadow-cta",
          "hover:-translate-y-0.5 hover:brightness-105",
          "active:translate-y-0 active:brightness-100",
        ],
        ghost: [
          "bg-transparent text-ink border border-line-strong",
          "hover:bg-glass-hover hover:border-cyan",
          "active:bg-glass-wash",
        ],
        icon: [
          "bg-glass-wash text-ink border border-line-subtle",
          "hover:bg-glass-hover hover:border-line-strong hover:text-cyan",
          "active:bg-glass-wash",
        ],
      },
      size: {
        sm: "text-small h-9 px-4 rounded-md",
        md: "text-body h-11 px-5 rounded-md",
        lg: "text-lede h-12 px-6 rounded-lg",
      },
    },
    compoundVariants: [
      { variant: "icon", size: "sm", className: "w-9 px-0" },
      { variant: "icon", size: "md", className: "w-11 px-0" },
      { variant: "icon", size: "lg", className: "w-12 px-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof button> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconLeft, iconRight, children, type = "button", ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(button({ variant, size }), className)}
      {...rest}
    >
      {iconLeft ? <span className="inline-flex shrink-0">{iconLeft}</span> : null}
      {children}
      {iconRight ? <span className="inline-flex shrink-0">{iconRight}</span> : null}
    </button>
  ),
);
Button.displayName = "Button";
