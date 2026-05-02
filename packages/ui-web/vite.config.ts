import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

/**
 * Library mode. Bundles src/index.ts (and its tree) into ESM,
 * emits .d.ts via vite-plugin-dts, and externalizes peer deps
 * so consumers' React / Tailwind versions win.
 *
 * Components don't exist yet — F0.2.2 fills them in. The build is
 * configured now so that pipeline is ready when the first primitive lands.
 */
export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/*.stories.tsx"],
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "clsx",
        "class-variance-authority",
        /^@confri\//,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
    sourcemap: true,
    target: "es2022",
    emptyOutDir: true,
  },
});
