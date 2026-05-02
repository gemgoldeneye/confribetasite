import { useId, type ReactNode } from "react";
import { cn } from "../../lib/cn.js";

export interface RadioPillOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface RadioPillProps<T extends string> {
  /** Form name. Required for native radio behavior. */
  name: string;
  options: ReadonlyArray<RadioPillOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** Accessible label for the entire group. */
  label?: string;
  /** Optional hint shown below the group. */
  hint?: string;
  /** Error message — replaces the hint slot when present. */
  error?: string;
  className?: string;
}

/**
 * A grid of pill-shaped radio buttons. Used for the vehicle picker
 * (Motor / Car / Supercar / Truck / Bus) on the beta application form.
 *
 * The selected pill gets a cyan border, brand-tinted background, and
 * brand-mark shadow so it reads as the most weighted element on the page.
 */
export const RadioPill = <T extends string>({
  name,
  options,
  value,
  defaultValue,
  onChange,
  label,
  hint,
  error,
  className,
}: RadioPillProps<T>) => {
  const groupId = useId();
  const isControlled = value !== undefined;

  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <legend className="text-small font-display font-bold text-ink-mute">
          {label}
        </legend>
      ) : null}
      <div role="radiogroup" aria-labelledby={label ? `${groupId}-label` : undefined} className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const id = `${groupId}-${opt.value}`;
          const isChecked = isControlled ? value === opt.value : undefined;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                "group relative inline-flex cursor-pointer items-center gap-2 rounded-pill border px-4 py-2.5",
                "border-line-strong bg-glass-wash text-ink-mute",
                "transition-[border-color,background-color,color,box-shadow] duration-fast ease-standard",
                "hover:border-cyan hover:text-ink",
                "has-[:checked]:border-cyan has-[:checked]:bg-glass-tinted has-[:checked]:text-ink has-[:checked]:shadow-brand-mark",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ground",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={isChecked}
                defaultChecked={!isControlled && defaultValue === opt.value}
                onChange={() => onChange?.(opt.value)}
                className="sr-only"
              />
              {opt.icon ? <span className="inline-flex shrink-0">{opt.icon}</span> : null}
              <span className="font-display text-small font-bold tracking-wide">{opt.label}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <span className="text-caption text-warn">{error}</span>
      ) : hint ? (
        <span className="text-caption text-ink-soft">{hint}</span>
      ) : null}
    </fieldset>
  );
};
