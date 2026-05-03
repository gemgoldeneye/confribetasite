import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
const a = () => /* @__PURE__ */ e(
  "svg",
  {
    viewBox: "0 0 24 24",
    width: 16,
    height: 16,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" })
  }
), c = ({ open: t, message: n, icon: o = /* @__PURE__ */ e(a, {}), className: i }) => /* @__PURE__ */ r(
  "div",
  {
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "true",
    className: s(
      "pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2",
      "inline-flex items-center gap-2 rounded-pill bg-gradient-brand px-6 py-3",
      "font-display text-body font-bold text-ink-on-accent shadow-toast",
      "transition-transform duration-slow ease-spring",
      t ? "translate-y-0" : "translate-y-24",
      i
    ),
    children: [
      /* @__PURE__ */ e("span", { className: "inline-flex shrink-0", children: o }),
      /* @__PURE__ */ e("span", { children: n })
    ]
  }
);
export {
  c as Toast
};
//# sourceMappingURL=Toast.js.map
