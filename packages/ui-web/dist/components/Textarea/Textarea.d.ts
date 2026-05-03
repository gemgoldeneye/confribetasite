import { ComponentPropsWithoutRef } from 'react';
export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
    label?: string;
    hint?: string;
    error?: string;
}
export declare const Textarea: import('react').ForwardRefExoticComponent<TextareaProps & import('react').RefAttributes<HTMLTextAreaElement>>;
