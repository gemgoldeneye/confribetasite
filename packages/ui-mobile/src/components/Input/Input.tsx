import { forwardRef, useState, type ReactNode } from "react";
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

export interface InputProps extends Omit<TextInputProps, "className"> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  className?: string;
}

/**
 * Mobile text input. Same vocabulary as web Input — label + hint + error
 * + leadingIcon. Focus state is tracked locally to drive the cyan
 * border tint, since RN doesn't have `:focus-within`.
 */
export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      hint,
      error,
      leadingIcon,
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
            "flex-row items-center gap-2 rounded-md border bg-glass-wash px-4",
            error
              ? "border-warn"
              : isFocused
              ? "border-cyan bg-glass-tinted"
              : "border-line-subtle",
          )}
        >
          {leadingIcon ? (
            <View className="shrink-0">{leadingIcon}</View>
          ) : null}
          <TextInput
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={tokens.colors.ink.soft}
            className="flex-1 py-3 font-body text-body text-ink"
            style={style}
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
Input.displayName = "Input";
