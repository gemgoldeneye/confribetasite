import { jsxs as o, jsx as l } from "react/jsx-runtime";
import { useId as v } from "react";
import { cn as t } from "../../lib/cn.js";
const k = ({
  name: d,
  options: c,
  value: a,
  defaultValue: u,
  onChange: f,
  label: s,
  className: h
}) => {
  const n = v(), i = a !== void 0;
  return /* @__PURE__ */ o("fieldset", { className: t("flex flex-col gap-2", h), children: [
    s ? /* @__PURE__ */ l("legend", { className: "text-small font-display font-bold text-ink-mute", children: s }) : null,
    /* @__PURE__ */ l(
      "div",
      {
        role: "radiogroup",
        "aria-labelledby": s ? `${n}-label` : void 0,
        className: "inline-flex rounded-md border border-line-subtle bg-glass-wash p-1",
        children: c.map((e) => {
          const r = `${n}-${e.value}`, m = i ? a === e.value : void 0;
          return /* @__PURE__ */ o(
            "label",
            {
              htmlFor: r,
              className: t(
                "relative flex flex-1 cursor-pointer items-center justify-center rounded-sm px-5 py-2",
                "font-display text-small font-bold text-ink-mute",
                "transition-colors duration-fast ease-standard",
                "hover:text-ink",
                "has-[:checked]:bg-gradient-brand has-[:checked]:text-ink-on-accent has-[:checked]:shadow-cta",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ground"
              ),
              children: [
                /* @__PURE__ */ l(
                  "input",
                  {
                    id: r,
                    type: "radio",
                    name: d,
                    value: e.value,
                    checked: m,
                    defaultChecked: !i && u === e.value,
                    onChange: () => f?.(e.value),
                    className: "sr-only"
                  }
                ),
                e.label
              ]
            },
            e.value
          );
        })
      }
    )
  ] });
};
export {
  k as RadioSegment
};
//# sourceMappingURL=RadioSegment.js.map
