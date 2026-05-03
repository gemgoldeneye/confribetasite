/**
 * @confri/tokens — single source of truth for the ConvoyFriends design system.
 *
 * Re-exports every token group. Consumers should pick the most specific
 * import path possible:
 *
 *   import { colors } from "@confri/tokens/colors";
 *   import { gradients } from "@confri/tokens/gradients";
 *
 * The barrel below exists for convenience and Storybook.
 */
export { colors } from "./colors.js";
export type { Colors } from "./colors.js";
export { gradients } from "./gradients.js";
export type { Gradients, GradientName, GradientStop, LinearGradient } from "./gradients.js";
export { fontFamily, fontWeight, fontSize, letterSpacing, lineHeight, textStyles, } from "./typography.js";
export type { FontFamily, FontWeight, FontSize, LetterSpacing, LineHeight, TextStyle, } from "./typography.js";
export { radii } from "./radii.js";
export type { Radius } from "./radii.js";
export { spacing, minTouchTarget, gutter } from "./spacing.js";
export type { Spacing } from "./spacing.js";
export { duration, easing, transition } from "./motion.js";
export type { Duration, Easing, Transition } from "./motion.js";
export { elevation } from "./elevation.js";
export type { Elevation, ShadowRecipe } from "./elevation.js";
/**
 * The full token set as a single object. Useful for Storybook
 * theme objects, Tailwind config consumption, or anywhere a single
 * `theme` import is more ergonomic than seven.
 */
export declare const tokens: {
    readonly colors: {
        readonly bg: {
            readonly ground: "#050B16";
            readonly surface: "#0A1628";
            readonly elevated: "#0F1E36";
        };
        readonly accent: {
            readonly cyan: "#3DD9F5";
            readonly aqua: "#34D2C7";
            readonly teal: "#2BC4A8";
        };
        readonly status: {
            readonly amber: "#F2B26B";
            readonly warn: "#F26B6B";
            readonly success: "#2BC4A8";
        };
        readonly ink: {
            readonly primary: "#F5F8FF";
            readonly mute: "#9AA8C2";
            readonly soft: "#6B7891";
            readonly onAccent: "#06121F";
        };
        readonly line: {
            readonly subtle: "rgba(255, 255, 255, 0.08)";
            readonly strong: "rgba(255, 255, 255, 0.16)";
            readonly accent: "rgba(61, 217, 245, 0.30)";
        };
        readonly glass: {
            readonly wash: "rgba(255, 255, 255, 0.02)";
            readonly hover: "rgba(255, 255, 255, 0.04)";
            readonly tinted: "rgba(61, 217, 245, 0.06)";
        };
    };
    readonly gradients: {
        readonly brand: {
            readonly angle: 92;
            readonly stops: readonly [{
                readonly color: "#3DD9F5";
                readonly position: 0;
            }, {
                readonly color: "#34D2C7";
                readonly position: 48;
            }, {
                readonly color: "#2BC4A8";
                readonly position: 100;
            }];
            readonly css: "linear-gradient(92deg, #3DD9F5 0%, #34D2C7 48%, #2BC4A8 100%)";
        };
        readonly brandVertical: {
            readonly angle: 180;
            readonly stops: readonly [{
                readonly color: "#3DD9F5";
                readonly position: 0;
            }, {
                readonly color: "#34D2C7";
                readonly position: 48;
            }, {
                readonly color: "#2BC4A8";
                readonly position: 100;
            }];
            readonly css: "linear-gradient(180deg, #3DD9F5 0%, #34D2C7 48%, #2BC4A8 100%)";
        };
        readonly surfaceCard: {
            readonly angle: 180;
            readonly stops: readonly [{
                readonly color: "rgba(15, 30, 54, 0.55)";
                readonly position: 0;
            }, {
                readonly color: "rgba(10, 22, 40, 0.30)";
                readonly position: 100;
            }];
            readonly css: "linear-gradient(180deg, rgba(15,30,54,0.55) 0%, rgba(10,22,40,0.30) 100%)";
        };
        readonly surfaceCardElevated: {
            readonly angle: 180;
            readonly stops: readonly [{
                readonly color: "rgba(15, 30, 54, 0.70)";
                readonly position: 0;
            }, {
                readonly color: "rgba(10, 22, 40, 0.40)";
                readonly position: 100;
            }];
            readonly css: "linear-gradient(180deg, rgba(15,30,54,0.70) 0%, rgba(10,22,40,0.40) 100%)";
        };
    };
    readonly typography: {
        readonly fontFamily: {
            readonly display: "Sora";
            readonly body: "Inter";
            readonly mono: "JetBrains Mono";
        };
        readonly fontWeight: {
            readonly regular: "400";
            readonly medium: "500";
            readonly semibold: "600";
            readonly bold: "700";
            readonly extrabold: "800";
        };
        readonly fontSize: {
            readonly micro: 11;
            readonly caption: 12;
            readonly small: 13;
            readonly body: 14.5;
            readonly lede: 16.5;
            readonly lg: 18;
            readonly h3: 20;
            readonly h2: 22;
            readonly h1: 34;
            readonly display: 52;
        };
        readonly letterSpacing: {
            readonly tight: {
                readonly em: -0.025;
            };
            readonly wide: {
                readonly em: 0.14;
            };
            readonly normal: {
                readonly em: 0;
            };
        };
        readonly lineHeight: {
            readonly display: 1.05;
            readonly heading: 1.2;
            readonly tight: 1.55;
            readonly body: 1.65;
            readonly loose: 1.7;
        };
        readonly textStyles: {
            readonly display: {
                readonly family: "Sora";
                readonly weight: "800";
                readonly size: 52;
                readonly lineHeight: 1.05;
                readonly letterSpacing: {
                    readonly em: -0.025;
                };
            };
            readonly h1: {
                readonly family: "Sora";
                readonly weight: "800";
                readonly size: 34;
                readonly lineHeight: 1.2;
                readonly letterSpacing: {
                    readonly em: -0.025;
                };
            };
            readonly h2: {
                readonly family: "Sora";
                readonly weight: "700";
                readonly size: 22;
                readonly lineHeight: 1.2;
                readonly letterSpacing: {
                    readonly em: -0.015;
                };
            };
            readonly h3: {
                readonly family: "Sora";
                readonly weight: "600";
                readonly size: 20;
                readonly lineHeight: 1.2;
                readonly letterSpacing: {
                    readonly em: -0.01;
                };
            };
            readonly eyebrow: {
                readonly family: "Sora";
                readonly weight: "700";
                readonly size: 12;
                readonly lineHeight: 1.2;
                readonly letterSpacing: {
                    readonly em: 0.14;
                };
                readonly textTransform: "uppercase";
            };
            readonly lede: {
                readonly family: "Inter";
                readonly weight: "400";
                readonly size: 16.5;
                readonly lineHeight: 1.65;
                readonly letterSpacing: {
                    readonly em: 0;
                };
            };
            readonly body: {
                readonly family: "Inter";
                readonly weight: "400";
                readonly size: 14.5;
                readonly lineHeight: 1.65;
                readonly letterSpacing: {
                    readonly em: 0;
                };
            };
            readonly bodyStrong: {
                readonly family: "Inter";
                readonly weight: "600";
                readonly size: 14.5;
                readonly lineHeight: 1.65;
                readonly letterSpacing: {
                    readonly em: 0;
                };
            };
            readonly label: {
                readonly family: "Sora";
                readonly weight: "700";
                readonly size: 13;
                readonly lineHeight: 1.2;
                readonly letterSpacing: {
                    readonly em: 0;
                };
            };
            readonly caption: {
                readonly family: "Inter";
                readonly weight: "500";
                readonly size: 12;
                readonly lineHeight: 1.2;
                readonly letterSpacing: {
                    readonly em: 0;
                };
            };
            readonly mono: {
                readonly family: "JetBrains Mono";
                readonly weight: "500";
                readonly size: 14.5;
                readonly lineHeight: 1.2;
                readonly letterSpacing: {
                    readonly em: 0;
                };
            };
            readonly monoLarge: {
                readonly family: "JetBrains Mono";
                readonly weight: "600";
                readonly size: 22;
                readonly lineHeight: 1.2;
                readonly letterSpacing: {
                    readonly em: 0;
                };
            };
        };
    };
    readonly radii: {
        readonly none: 0;
        readonly sm: 8;
        readonly md: 12;
        readonly lg: 16;
        readonly xl: 20;
        readonly xxl: 24;
        readonly pill: 999;
    };
    readonly spacing: {
        readonly 0: 0;
        readonly px: 1;
        readonly 1: 4;
        readonly 2: 8;
        readonly 3: 12;
        readonly 4: 16;
        readonly 5: 20;
        readonly 6: 24;
        readonly 7: 28;
        readonly 8: 32;
        readonly 9: 36;
        readonly 10: 40;
        readonly 11: 44;
        readonly 12: 48;
        readonly 14: 56;
        readonly 16: 64;
        readonly 20: 80;
        readonly 24: 96;
        readonly 32: 128;
    };
    readonly minTouchTarget: 44;
    readonly gutter: {
        readonly mobile: 20;
        readonly tablet: 28;
        readonly desktop: 48;
    };
    readonly motion: {
        readonly duration: {
            readonly instant: 100;
            readonly fast: 160;
            readonly base: 240;
            readonly slow: 360;
            readonly deliberate: 600;
            readonly hero: 900;
        };
        readonly easing: {
            readonly standard: {
                readonly css: "cubic-bezier(0.2, 0, 0, 1)";
                readonly points: readonly [0.2, 0, 0, 1];
            };
            readonly decelerate: {
                readonly css: "cubic-bezier(0, 0, 0, 1)";
                readonly points: readonly [0, 0, 0, 1];
            };
            readonly accelerate: {
                readonly css: "cubic-bezier(0.3, 0, 1, 1)";
                readonly points: readonly [0.3, 0, 1, 1];
            };
            readonly spring: {
                readonly css: "cubic-bezier(0.2, 1.4, 0.6, 1)";
                readonly points: readonly [0.2, 1.4, 0.6, 1];
            };
            readonly easeInOut: {
                readonly css: "cubic-bezier(0.4, 0, 0.2, 1)";
                readonly points: readonly [0.4, 0, 0.2, 1];
            };
            readonly linear: {
                readonly css: "linear";
                readonly points: readonly [0, 0, 1, 1];
            };
        };
        readonly transition: {
            readonly hover: {
                readonly duration: 160;
                readonly easing: {
                    readonly css: "cubic-bezier(0.2, 0, 0, 1)";
                    readonly points: readonly [0.2, 0, 0, 1];
                };
            };
            readonly press: {
                readonly duration: 100;
                readonly easing: {
                    readonly css: "cubic-bezier(0.3, 0, 1, 1)";
                    readonly points: readonly [0.3, 0, 1, 1];
                };
            };
            readonly page: {
                readonly duration: 240;
                readonly easing: {
                    readonly css: "cubic-bezier(0.2, 0, 0, 1)";
                    readonly points: readonly [0.2, 0, 0, 1];
                };
            };
            readonly modalEnter: {
                readonly duration: 360;
                readonly easing: {
                    readonly css: "cubic-bezier(0, 0, 0, 1)";
                    readonly points: readonly [0, 0, 0, 1];
                };
            };
            readonly modalExit: {
                readonly duration: 240;
                readonly easing: {
                    readonly css: "cubic-bezier(0.3, 0, 1, 1)";
                    readonly points: readonly [0.3, 0, 1, 1];
                };
            };
            readonly toast: {
                readonly duration: 360;
                readonly easing: {
                    readonly css: "cubic-bezier(0.2, 1.4, 0.6, 1)";
                    readonly points: readonly [0.2, 1.4, 0.6, 1];
                };
            };
            readonly celebrate: {
                readonly duration: 600;
                readonly easing: {
                    readonly css: "cubic-bezier(0.2, 1.4, 0.6, 1)";
                    readonly points: readonly [0.2, 1.4, 0.6, 1];
                };
            };
        };
    };
    readonly elevation: {
        readonly flat: {
            css: string;
            offsetX: number;
            offsetY: number;
            blur: number;
            spread: number;
            color: string;
            opacity: number;
        };
        readonly resting: import("./elevation.js").ShadowRecipe;
        readonly hover: import("./elevation.js").ShadowRecipe;
        readonly brandMark: import("./elevation.js").ShadowRecipe;
        readonly cta: import("./elevation.js").ShadowRecipe;
        readonly toast: import("./elevation.js").ShadowRecipe;
        readonly modal: import("./elevation.js").ShadowRecipe;
    };
};
export type Tokens = typeof tokens;
//# sourceMappingURL=index.d.ts.map