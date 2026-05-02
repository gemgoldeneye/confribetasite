import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../lib/cn.js";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  /** Optional adornment rendered inside the field, before the input. */
  leadingIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, leadingIcon, id, ...rest }, ref) => {
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
            "group relative flex items-center gap-2 rounded-md border bg-glass-wash px-4 transition-colors duration-fast ease-standard",
            "border-line-subtle hover:border-line-strong",
            "focus-within:border-cyan focus-within:bg-glass-tinted",
            error && "border-warn focus-within:border-warn",
          )}
        >
          {leadingIcon ? (
            <span className="text-ink-soft group-focus-within:text-cyan transition-colors duration-fast">
              {leadingIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            className={cn(
              "flex-1 bg-transparent py-3 font-body text-body text-ink outline-none",
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
Input.displayName = "Input";
