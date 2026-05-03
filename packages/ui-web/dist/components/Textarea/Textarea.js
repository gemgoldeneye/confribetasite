import { jsxs as f, jsx as a } from "react/jsx-runtime";
import { forwardRef as m, useId as p } from "react";
import { cn as o } from "../../lib/cn.js";
const u = m(
  ({ className: r, label: s, hint: n, error: t, id: i, rows: d = 4, ...l }, c) => {
    const x = p(), e = i ?? x, b = t ? `${e}-error` : n ? `${e}-hint` : void 0;
    return /* @__PURE__ */ f("div", { className: "flex flex-col gap-2", children: [
      s ? /* @__PURE__ */ a(
        "label",
        {
          htmlFor: e,
          className: "text-small font-display font-bold text-ink-mute",
          children: s
        }
      ) : null,
      /* @__PURE__ */ a(
        "div",
        {
          className: o(
            "rounded-md border bg-glass-wash transition-colors duration-fast ease-standard",
            "border-line-subtle hover:border-line-strong",
            "focus-within:border-cyan focus-within:bg-glass-tinted",
            t && "border-warn focus-within:border-warn"
          ),
          children: /* @__PURE__ */ a(
            "textarea",
            {
              ref: c,
              id: e,
              rows: d,
              "aria-describedby": b,
              "aria-invalid": !!t,
              className: o(
                "block w-full resize-y bg-transparent px-4 py-3 font-body text-body text-ink outline-none",
                "placeholder:text-ink-soft",
                r
              ),
              ...l
            }
          )
        }
      ),
      t ? /* @__PURE__ */ a("span", { id: `${e}-error`, className: "text-caption text-warn", children: t }) : n ? /* @__PURE__ */ a("span", { id: `${e}-hint`, className: "text-caption text-ink-soft", children: n }) : null
    ] });
  }
);
u.displayName = "Textarea";
export {
  u as Textarea
};
//# sourceMappingURL=Textarea.js.map
