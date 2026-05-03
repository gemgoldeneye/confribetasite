import { ReactNode } from 'react';
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
export declare const RadioPill: <T extends string>({ name, options, value, defaultValue, onChange, label, hint, error, className, }: RadioPillProps<T>) => import("react/jsx-runtime").JSX.Element;
