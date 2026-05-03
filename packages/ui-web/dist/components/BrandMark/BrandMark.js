import { jsx as n, jsxs as l } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
const c = ({ size: r, ...t }) => /* @__PURE__ */ l(
  "svg",
  {
    viewBox: "0 0 24 24",
    width: Math.round(r * 0.55),
    height: Math.round(r * 0.55),
    fill: "none",
    "aria-hidden": "true",
    ...t,
    children: [
      /* @__PURE__ */ n("circle", { cx: 5, cy: 12, r: 2.4, fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: 12, cy: 6, r: 2.4, fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: 19, cy: 12, r: 2.4, fill: "currentColor" }),
      /* @__PURE__ */ n(
        "path",
        {
          d: "M6.5 11 10.5 7M13.5 7l4 4M6.5 13l11 0",
          stroke: "currentColor",
          strokeWidth: 1.6,
          strokeLinecap: "round"
        }
      )
    ]
  }
), h = ({
  size: r = 40,
  variant: t = "chip",
  className: e,
  ...i
}) => t === "glyph" ? /* @__PURE__ */ n(c, { size: r, className: o("text-ink", e), ...i }) : /* @__PURE__ */ n(
  "span",
  {
    className: o(
      "inline-grid place-items-center bg-gradient-brand shadow-brand-mark text-ink-on-accent",
      e
    ),
    style: { width: r, height: r, borderRadius: Math.round(r * 0.275) },
    role: "img",
    "aria-label": "ConvoyFriends",
    children: /* @__PURE__ */ n(c, { size: r })
  }
);
export {
  h as BrandMark
};
//# sourceMappingURL=BrandMark.js.map
