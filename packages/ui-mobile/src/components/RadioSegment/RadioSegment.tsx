import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { brandGradientProps } from "../../helpers/gradients.js";
import { elevationToRNStyle } from "../../helpers/elevation.js";
import { cn } from "../../lib/cn.js";

export interface RadioSegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface RadioSegmentProps<T extends string> {
  options: ReadonlyArray<RadioSegmentOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  label?: string;
  className?: string;
}

const ctaShadow = elevationToRNStyle("cta");

/**
 * Mobile segmented radio. The active segment carries the brand gradient
 * (rendered via `<LinearGradient>` since RN has no CSS gradient).
 * Mirrors `@confri/ui-web`'s RadioSegment in vocabulary.
 */
export const RadioSegment = <T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  label,
  className,
}: RadioSegmentProps<T>) => {
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
        className="flex-row self-start rounded-md border border-line-subtle bg-glass-wash p-1"
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
              className="relative flex-1 items-center justify-center overflow-hidden rounded-sm px-5 py-2"
              style={isSelected ? ctaShadow : undefined}
            >
              {isSelected ? (
                <LinearGradient
                  colors={brandGradientProps.colors}
                  locations={brandGradientProps.locations}
                  start={brandGradientProps.start}
                  end={brandGradientProps.end}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              ) : null}
              <Text
                className={cn(
                  "font-display text-small font-bold",
                  isSelected ? "text-ink-on-accent" : "text-ink-mute",
                )}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
