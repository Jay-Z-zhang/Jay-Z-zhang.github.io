import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://www.jayzzhang.online",
  integrations: [
    sitemap({
      customPages: [
        "https://www.jayzzhang.online/apps/resume-builder/",
        "https://www.jayzzhang.online/apps/viral-calculator/",
      ],
    }),
    mdx(),
    pagefind(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
