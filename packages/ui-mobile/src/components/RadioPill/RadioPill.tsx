import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { elevationToRNStyle } from "../../helpers/elevation.js";
import { cn } from "../../lib/cn.js";

export interface RadioPillOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface RadioPillProps<T extends string> {
  options: ReadonlyArray<RadioPillOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

const brandMarkShadow = elevationToRNStyle("brandMark");

/**
 * Pill-grid radio. Mirrors web RadioPill's vocabulary; on mobile each
 * option is a `<Pressable>` (not `<input type=radio>`), and the
 * "selected" state is reflected via tinted background, cyan border,
 * and the brand-mark shadow recipe.
 */
export const RadioPill = <T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  label,
  hint,
  error,
  className,
}: RadioPillProps<T>) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<T | undefined>(defaultValue);
  const current = isControlled ? value : internal;

  const select = (next: T) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <View className={cn("flex-col gap-2", className)}>
      {label ? (
        <Text className="text-small font-display font-bold text-ink-mute">
          {label}
        </Text>
      ) : null}
      <View
        className="flex-row flex-wrap gap-2"
        accessibilityRole="radiogroup"
      >
        {options.map((opt) => {
          const isSelected = current === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => select(opt.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={opt.label}
              className={cn(
                "flex-row items-center gap-2 rounded-pill border px-4 py-2.5",
                isSelected
                  ? "border-cyan bg-glass-tinted"
                  : "border-line-strong bg-glass-wash",
              )}
              style={isSelected ? brandMarkShadow : undefined}
            >
              {opt.icon ? <View className="shrink-0">{opt.icon}</View> : null}
              <Text
                className={cn(
                  "font-display text-small font-bold",
                  isSelected ? "text-ink" : "text-ink-mute",
                )}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text className="text-caption text-warn">{error}</Text>
      ) : hint ? (
        <Text className="text-caption text-ink-soft">{hint}</Text>
      ) : null}
    </View>
  );
};
