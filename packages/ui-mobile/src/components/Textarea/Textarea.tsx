import { forwardRef, useState } from "react";
import {
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
  type TextInputProps,
} from "react-native";
import { tokens } from "@confri/tokens";
import { cn } from "../../lib/cn.js";

export interface TextareaProps extends Omit<TextInputProps, "className" | "multiline" | "numberOfLines"> {
  label?: string;
  hint?: string;
  error?: string;
  /** Minimum visible rows. Default 4. */
  rows?: number;
  className?: string;
}

/**
 * Mobile multi-line text input. Same prop surface as `@confri/ui-web`'s
 * Textarea, with `rows` mapped to `numberOfLines` and a fixed `multiline`.
 */
export const Textarea = forwardRef<TextInput, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      rows = 4,
      onFocus,
      onBlur,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <View className={cn("flex-col gap-2", className)}>
        {label ? (
          <Text className="text-small font-display font-bold text-ink-mute">
            {label}
          </Text>
        ) : null}
        <View
          className={cn(
            "rounded-md border bg-glass-wash px-4",
            error
              ? "border-warn"
              : isFocused
              ? "border-cyan bg-glass-tinted"
              : "border-line-subtle",
          )}
        >
          <TextInput
            ref={ref}
            multiline
            numberOfLines={rows}
            textAlignVertical="top"
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={tokens.colors.ink.soft}
            className="font-body text-body text-ink"
            style={[{ paddingVertical: 12, minHeight: rows * 24 }, style]}
            {...rest}
          />
        </View>
        {error ? (
          <Text className="text-caption text-warn">{error}</Text>
        ) : hint ? (
          <Text className="text-caption text-ink-soft">{hint}</Text>
        ) : null}
      </View>
    );
  },
);
Textarea.displayName = "Textarea";
