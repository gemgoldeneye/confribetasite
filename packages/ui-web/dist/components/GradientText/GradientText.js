import { jsx as s } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
const d = {
  brand: "bg-gradient-brand",
  brandVertical: "bg-gradient-brand-vertical"
}, o = ({
  as: t,
  gradient: a = "brand",
  children: r,
  className: n,
  ...e
}) => /* @__PURE__ */ s(
  t ?? "span",
  {
    className: c(
      d[a],
      "bg-clip-text text-transparent text-cyan",
      n
    ),
    ...e,
    children: r
  }
);
export {
  o as GradientText
};
//# sourceMappingURL=GradientText.js.map
