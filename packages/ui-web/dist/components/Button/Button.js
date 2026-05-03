import { jsxs as c, jsx as s } from "react/jsx-runtime";
import { forwardRef as b } from "react";
import { cva as m } from "class-variance-authority";
import { cn as g } from "../../lib/cn.js";
const v = m(
  [
    "inline-flex items-center justify-center gap-2",
    "font-display font-bold",
    "cursor-pointer select-none",
    "transition-[transform,filter,box-shadow,background-color,color] duration-fast ease-standard",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-brand text-ink-on-accent shadow-cta",
          "hover:-translate-y-0.5 hover:brightness-105",
          "active:translate-y-0 active:brightness-100"
        ],
        ghost: [
          "bg-transparent text-ink border border-line-strong",
          "hover:bg-glass-hover hover:border-cyan",
          "active:bg-glass-wash"
        ],
        icon: [
          "bg-glass-wash text-ink border border-line-subtle",
          "hover:bg-glass-hover hover:border-line-strong hover:text-cyan",
          "active:bg-glass-wash"
        ]
      },
      size: {
        sm: "text-small h-9 px-4 rounded-md",
        md: "text-body h-11 px-5 rounded-md",
        lg: "text-lede h-12 px-6 rounded-lg"
      }
    },
    compoundVariants: [
      { variant: "icon", size: "sm", className: "w-9 px-0" },
      { variant: "icon", size: "md", className: "w-11 px-0" },
      { variant: "icon", size: "lg", className: "w-12 px-0" }
    ],
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
), f = b(
  ({ className: n, variant: a, size: o, iconLeft: e, iconRight: r, children: t, type: i = "button", ...l }, d) => /* @__PURE__ */ c(
    "button",
    {
      ref: d,
      type: i,
      className: g(v({ variant: a, size: o }), n),
      ...l,
      children: [
        e ? /* @__PURE__ */ s("span", { className: "inline-flex shrink-0", children: e }) : null,
        t,
        r ? /* @__PURE__ */ s("span", { className: "inline-flex shrink-0", children: r }) : null
      ]
    }
  )
);
f.displayName = "Button";
export {
  f as Button
};
//# sourceMappingURL=Button.js.map
