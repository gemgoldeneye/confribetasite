import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn.js";

const card = cva(
  ["relative overflow-hidden border border-line-subtle"],
  {
    variants: {
      variant: {
        glass: "bg-gradient-surface-card backdrop-blur-sm",
        glassElevated: "bg-gradient-surface-card-elevated backdrop-blur-sm",
        solid: "bg-elevated",
      },
      padding: {
        none: "p-0",
        sm: "p-5",
        md: "p-7",
        lg: "p-9",
      },
      radius: {
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        xxl: "rounded-xxl",
      },
      accentRule: {
        none: "",
        top: "before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-brand",
      },
    },
    defaultVariants: {
      variant: "glass",
      padding: "md",
      radius: "xl",
      accentRule: "none",
    },
  },
);

export interface CardProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof card> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, radius, accentRule, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(card({ variant, padding, radius, accentRule }), className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
Card.displayName = "Card";
