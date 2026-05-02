import { useId } from "react";
import { cn } from "../../lib/cn.js";

export interface RadioSegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface RadioSegmentProps<T extends string> {
  name: string;
  options: ReadonlyArray<RadioSegmentOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  label?: string;
  className?: string;
}

/**
 * Segmented radio control. Used for binary/ternary choices like
 * iPhone | Android on the beta application form. Looks like a single
 * pill split into segments; the active segment carries the brand gradient.
 */
export const RadioSegment = <T extends string>({
  name,
  options,
  value,
  defaultValue,
  onChange,
  label,
  className,
}: RadioSegmentProps<T>) => {
  const groupId = useId();
  const isControlled = value !== undefined;

  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <legend className="text-small font-display font-bold text-ink-mute">
          {label}
        </legend>
      ) : null}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        className="inline-flex rounded-md border border-line-subtle bg-glass-wash p-1"
      >
        {options.map((opt) => {
          const id = `${groupId}-${opt.value}`;
          const isChecked = isControlled ? value === opt.value : undefined;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                "relative flex flex-1 cursor-pointer items-center justify-center rounded-sm px-5 py-2",
                "font-display text-small font-bold text-ink-mute",
                "transition-colors duration-fast ease-standard",
                "hover:text-ink",
                "has-[:checked]:bg-gradient-brand has-[:checked]:text-ink-on-accent has-[:checked]:shadow-cta",
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
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
