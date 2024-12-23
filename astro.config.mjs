// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import codeTheme from "./src/vitesse-dark-green.json";

export default defineConfig({
  site: "https://notes.benjavicente.dev",
  integrations: [mdx(), sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // @ts-expect-error: can't type themes
      theme: codeTheme,
    },
  },
});
