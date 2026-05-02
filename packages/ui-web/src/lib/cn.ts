import { clsx, type ClassValue } from "clsx";

/** Compose class names. Wraps `clsx` so consumers don't need to install it directly. */
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
