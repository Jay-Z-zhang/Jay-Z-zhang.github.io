import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "Jayz Zhang",
  DESCRIPTION: "Growth PM @ Trip & TrainPal | 用 AI 重构工作方式",
  EMAIL: "jay_z_zhang@qq.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Jayz Zhang - Growth PM, AI-driven product builder.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "增长方法论、产品思考、AI 工具实践。",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "我做过的产品和工具，大部分开源在 GitHub。",
};

export const SOCIALS: Socials = [
  {
    NAME: "GitHub",
    HREF: "https://github.com/Jay-Z-zhang",
  },
  {
    NAME: "Website",
    HREF: "https://www.jayzzhang.online",
  },
];
