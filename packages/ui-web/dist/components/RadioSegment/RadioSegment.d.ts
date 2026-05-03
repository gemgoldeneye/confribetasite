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
export declare const RadioSegment: <T extends string>({ name, options, value, defaultValue, onChange, label, className, }: RadioSegmentProps<T>) => import("react/jsx-runtime").JSX.Element;
