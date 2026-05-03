import { jsxs as o, jsx as n } from "react/jsx-runtime";
import { forwardRef as m, useId as x } from "react";
import { cn as r } from "../../lib/cn.js";
const b = m(
  ({ className: l, label: a, hint: s, error: e, leadingIcon: i, id: d, ...c }, p) => {
    const f = x(), t = d ?? f, u = e ? `${t}-error` : s ? `${t}-hint` : void 0;
    return /* @__PURE__ */ o("div", { className: "flex flex-col gap-2", children: [
      a ? /* @__PURE__ */ n(
        "label",
        {
          htmlFor: t,
          className: "text-small font-display font-bold text-ink-mute",
          children: a
        }
      ) : null,
      /* @__PURE__ */ o(
        "div",
        {
          className: r(
            "group relative flex items-center gap-2 rounded-md border bg-glass-wash px-4 transition-colors duration-fast ease-standard",
            "border-line-subtle hover:border-line-strong",
            "focus-within:border-cyan focus-within:bg-glass-tinted",
            e && "border-warn focus-within:border-warn"
          ),
          children: [
            i ? /* @__PURE__ */ n("span", { className: "text-ink-soft group-focus-within:text-cyan transition-colors duration-fast", children: i }) : null,
            /* @__PURE__ */ n(
              "input",
              {
                ref: p,
                id: t,
                "aria-describedby": u,
                "aria-invalid": !!e,
                className: r(
                  "flex-1 bg-transparent py-3 font-body text-body text-ink outline-none",
                  "placeholder:text-ink-soft",
                  l
                ),
                ...c
              }
            )
          ]
        }
      ),
      e ? /* @__PURE__ */ n("span", { id: `${t}-error`, className: "text-caption text-warn", children: e }) : s ? /* @__PURE__ */ n("span", { id: `${t}-hint`, className: "text-caption text-ink-soft", children: s }) : null
    ] });
  }
);
b.displayName = "Input";
export {
  b as Input
};
//# sourceMappingURL=Input.js.map
