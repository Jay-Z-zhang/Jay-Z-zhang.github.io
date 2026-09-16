import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://www.jayzzhang.online",
  redirects: {
    "/resume-builder": "/apps/resume-builder/",
    "/viral-calculator": "/apps/viral-calculator/",
    "/tags": "/blog/",
    "/tags/上线": "/blog/",
    "/tags/出海": "/blog/",
    "/tags/创业": "/blog/",
    "/tags/增长": "/blog/",
    "/tags/技术": "/blog/",
    "/tags/指标": "/blog/",
    "/tags/数据分析": "/blog/",
    "/tags/社交媒体": "/blog/",
    "/tags/融资": "/blog/",
    "/tags/股权": "/blog/",
    "/tags/营销": "/blog/",
    "/tags/运维": "/blog/",
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.startsWith("/ops") && !path.startsWith("/tags");
      },
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
