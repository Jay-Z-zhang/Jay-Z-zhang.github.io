import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

const publicDir = fileURLToPath(new URL("./public", import.meta.url));

// Vite's dev server does not serve public/<dir>/index.html for /<dir>/.
function servePublicIndex() {
  return {
    name: "serve-public-index",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url ?? "";
        const qIndex = raw.indexOf("?");
        const pathname = qIndex === -1 ? raw : raw.slice(0, qIndex);
        const search = qIndex === -1 ? "" : raw.slice(qIndex);
        if (!pathname.endsWith("/")) return next();
        const indexPath = path.resolve(publicDir, pathname.slice(1), "index.html");
        const publicRoot = publicDir.endsWith(path.sep) ? publicDir : publicDir + path.sep;
        if (!indexPath.startsWith(publicRoot) || !fs.existsSync(indexPath)) return next();
        req.url = `${pathname}index.html${search}`;
        next();
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://www.jayzzhang.online",
  redirects: {
    "/resume-builder": "/apps/resume-builder/",
    "/viral-calculator": "/apps/viral-calculator/",
    "/haloflux": "/apps/haloflux/",
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
        "https://www.jayzzhang.online/apps/haloflux/",
      ],
    }),
    mdx(),
    pagefind(),
  ],
  vite: {
    plugins: [servePublicIndex(), tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
