import { jsxs as t, jsx as a } from "react/jsx-runtime";
import { useId as b } from "react";
import { cn as d } from "../../lib/cn.js";
const y = ({
  name: h,
  options: u,
  value: s,
  defaultValue: f,
  onChange: m,
  label: l,
  hint: n,
  error: i,
  className: x
}) => {
  const r = b(), o = s !== void 0;
  return /* @__PURE__ */ t("fieldset", { className: d("flex flex-col gap-2", x), children: [
    l ? /* @__PURE__ */ a("legend", { className: "text-small font-display font-bold text-ink-mute", children: l }) : null,
    /* @__PURE__ */ a("div", { role: "radiogroup", "aria-labelledby": l ? `${r}-label` : void 0, className: "flex flex-wrap gap-2", children: u.map((e) => {
      const c = `${r}-${e.value}`, g = o ? s === e.value : void 0;
      return /* @__PURE__ */ t(
        "label",
        {
          htmlFor: c,
          className: d(
            "group relative inline-flex cursor-pointer items-center gap-2 rounded-pill border px-4 py-2.5",
            "border-line-strong bg-glass-wash text-ink-mute",
            "transition-[border-color,background-color,color,box-shadow] duration-fast ease-standard",
            "hover:border-cyan hover:text-ink",
            "has-[:checked]:border-cyan has-[:checked]:bg-glass-tinted has-[:checked]:text-ink has-[:checked]:shadow-brand-mark",
            "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ground"
          ),
          children: [
            /* @__PURE__ */ a(
              "input",
              {
                id: c,
                type: "radio",
                name: h,
                value: e.value,
                checked: g,
                defaultChecked: !o && f === e.value,
                onChange: () => m?.(e.value),
                className: "sr-only"
              }
            ),
            e.icon ? /* @__PURE__ */ a("span", { className: "inline-flex shrink-0", children: e.icon }) : null,
            /* @__PURE__ */ a("span", { className: "font-display text-small font-bold tracking-wide", children: e.label })
          ]
        },
        e.value
      );
    }) }),
    i ? /* @__PURE__ */ a("span", { className: "text-caption text-warn", children: i }) : n ? /* @__PURE__ */ a("span", { className: "text-caption text-ink-soft", children: n }) : null
  ] });
};
export {
  y as RadioPill
};
//# sourceMappingURL=RadioPill.js.map
