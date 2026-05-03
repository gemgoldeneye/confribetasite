import { ComponentPropsWithoutRef } from 'react';
import { VariantProps } from 'class-variance-authority';
declare const card: (props?: ({
    variant?: "glass" | "glassElevated" | "solid" | null | undefined;
    padding?: "none" | "sm" | "md" | "lg" | null | undefined;
    radius?: "md" | "lg" | "xl" | "xxl" | null | undefined;
    accentRule?: "none" | "top" | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string;
export interface CardProps extends ComponentPropsWithoutRef<"div">, VariantProps<typeof card> {
}
export declare const Card: import('react').ForwardRefExoticComponent<CardProps & import('react').RefAttributes<HTMLDivElement>>;
export {};
