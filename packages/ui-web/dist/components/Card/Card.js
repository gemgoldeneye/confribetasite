import { jsx as s } from "react/jsx-runtime";
import { forwardRef as i } from "react";
import { cva as b } from "class-variance-authority";
import { cn as c } from "../../lib/cn.js";
const m = b(
  ["relative overflow-hidden border border-line-subtle"],
  {
    variants: {
      variant: {
        glass: "bg-gradient-surface-card backdrop-blur-sm",
        glassElevated: "bg-gradient-surface-card-elevated backdrop-blur-sm",
        solid: "bg-elevated"
      },
      padding: {
        none: "p-0",
        sm: "p-5",
        md: "p-7",
        lg: "p-9"
      },
      radius: {
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        xxl: "rounded-xxl"
      },
      accentRule: {
        none: "",
        top: "before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-brand"
      }
    },
    defaultVariants: {
      variant: "glass",
      padding: "md",
      radius: "xl",
      accentRule: "none"
    }
  }
), f = i(
  ({ className: e, variant: r, padding: a, radius: d, accentRule: o, children: n, ...t }, l) => /* @__PURE__ */ s(
    "div",
    {
      ref: l,
      className: c(m({ variant: r, padding: a, radius: d, accentRule: o }), e),
      ...t,
      children: n
    }
  )
);
f.displayName = "Card";
export {
  f as Card
};
//# sourceMappingURL=Card.js.map
