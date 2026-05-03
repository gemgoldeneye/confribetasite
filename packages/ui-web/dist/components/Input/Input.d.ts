import { ComponentPropsWithoutRef, ReactNode } from 'react';
export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
    label?: string;
    hint?: string;
    error?: string;
    /** Optional adornment rendered inside the field, before the input. */
    leadingIcon?: ReactNode;
}
export declare const Input: import('react').ForwardRefExoticComponent<InputProps & import('react').RefAttributes<HTMLInputElement>>;
