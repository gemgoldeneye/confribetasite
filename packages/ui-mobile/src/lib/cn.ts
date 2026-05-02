import { clsx, type ClassValue } from "clsx";

/** Compose class names. Mirrors `@confri/ui-web`'s `cn` exactly. */
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
