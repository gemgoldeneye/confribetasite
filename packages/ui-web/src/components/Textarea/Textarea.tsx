import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn.js";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, rows = 4, ...rest }, ref) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-small font-display font-bold text-ink-mute"
          >
            {label}
          </label>
        ) : null}
        <div
          className={cn(
            "rounded-md border bg-glass-wash transition-colors duration-fast ease-standard",
            "border-line-subtle hover:border-line-strong",
            "focus-within:border-cyan focus-within:bg-glass-tinted",
            error && "border-warn focus-within:border-warn",
          )}
        >
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            className={cn(
              "block w-full resize-y bg-transparent px-4 py-3 font-body text-body text-ink outline-none",
              "placeholder:text-ink-soft",
              className,
            )}
            {...rest}
          />
        </div>
        {error ? (
          <span id={`${inputId}-error`} className="text-caption text-warn">
            {error}
          </span>
        ) : hint ? (
          <span id={`${inputId}-hint`} className="text-caption text-ink-soft">
            {hint}
          </span>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
