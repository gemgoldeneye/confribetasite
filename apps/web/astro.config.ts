import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://convoyfriends.app",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        // sharp is a native Node.js addon — keep it external, resolve at runtime.
        external: ["sharp"],
      },
    },
  },
});
