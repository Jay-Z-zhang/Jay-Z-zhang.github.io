# Jayz Zhang's Blog

> Growth PM · 用 AI 重构工作方式

![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?style=flat&logo=astro&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-181717?style=flat&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

个人博客 & 作品集 — [jayzzhang.online](https://www.jayzzhang.online)

---

## 关于我

我是 Jayz Zhang（张志），Trip & TrainPal 的增长产品经理，专注 UK/EU 市场的裂变拉新。

信奉「用 AI 重构工作方式」，在博客里记录增长方法论、产品思考和 AI 工具实践。

## 博客内容

- **增长方法论** — 归因系统、渠道质量评估、LTV 模型、北极星指标体系
- **裂变活动** — K 因子、ROI 预估、活动设计复盘
- **创业融资** — SAFE/可转债/优先股对比、融资轮次、LTV/CAC 单位经济
- **出海推广** — 海外社媒矩阵、渠道策略、Reddit/Twitter/ProductHunt 实战
- **AI 工具实践** — Agent 工作流、Vibe Coding、效率提升
- **竞品分析** — SHEIN vs TrainPal、行业洞察
- **技术运维** — 上线前自查清单（安全/可靠/性能/成本）

## 文章列表

| # | 标题 | 主题 |
|---|------|------|
| 00 | MAU、ARR、PMF：初创公司必懂的 3 个核心指标 | 指标 · 创业 |
| 01 | 可转债 vs 可转换优先股：两种融资工具的核心区别 | 融资 · 股权 |
| 02 | SAFE 融资工具详解：Y Combinator 的新型融资方案 | 融资 · 创业 |
| 03 | 海外社媒推广指南：7 大平台搭建出海流量矩阵 | 出海 · 社媒 |
| 04 | 天使轮·A 轮·B 轮·C 轮：一文搞懂创业融资全流程 | 融资 · 创业 |
| 05 | 应用上线前自查清单：操作·安全·可靠·性能·成本 | 技术 · 运维 |
| 06 | LTV/CAC > 3？详解单位经济模型的健康度 | 增长 · 融资 |
| 07 | 增长指标体系搭建：从虚荣指标到北极星指标 | 增长 · 指标 |
| 08 | 海外推广渠道全攻略：Reddit·Twitter·ProductHunt 实战 | 出海 · 增长 |

## 项目作品

| 项目 | 说明 | 链接 |
|------|------|------|
| 裂变漏斗计算器 | 增长 PM 必备，实时估算 K 因子 / CAC / ROI | [在线体验](https://www.jayzzhang.online/apps/viral-calculator/) |
| 简历修改器 | 多模板在线简历工具，实时预览 + PDF 导出 | [在线体验](https://www.jayzzhang.online/resume-builder/) |

## 技术栈

- **框架**: Astro 5.x + Astro Micro 主题
- **样式**: TailwindCSS v4 + 自定义暗色/亮色双主题
- **内容**: Markdown + MDX
- **搜索**: Pagefind
- **评论**: Giscus（基于 GitHub Discussions）
- **部署**: GitHub Actions → GitHub Pages
- **域名**: jayzzhang.online

## 主题特性

- 暗色主题（默认）— 深色背景 + 绿色高亮
- 亮色主题 — 清爽白底 + 绿色强调
- 一键切换 — 右上角按钮，偏好自动保存
- 系统跟随 — 首次访问自动检测系统明暗设置

## 性能优化

- IntersectionObserver 懒加载动画 / Giscus 评论 / Canvas 视口暂停
- 图片 lazy loading + async decoding
- 合并 scroll 监听器 + requestAnimationFrame 节流
- 导航链接 prefetch
- 零多余字体加载

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/Jay-Z-zhang/Jay-Z-zhang.github.io.git
cd Jay-Z-zhang.github.io

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:4321

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── components/       # 可复用组件
├── content/
│   ├── blog/         # 博客文章 (Markdown)
│   └── projects/     # 项目介绍
├── layouts/          # 页面布局
├── pages/            # 路由页面
└── styles/           # 全局样式
public/
├── apps/             # 独立应用 (计算器等)
├── images/           # 静态图片
└── og/               # OG 封面图
scripts/
── gen-blog-images.js # 博客配图生成脚本
```

## 添加新文章

在 `src/content/blog/` 下创建文件夹，添加 `index.md`：

```markdown
---
title: "文章标题"
description: "文章简介"
date: "2025-01-01"
tags:
  - 增长
  - 产品
---

文章内容...
```

使用 `scripts/gen-blog-images.js` 生成文章配图：

```bash
node scripts/gen-blog-images.js
# 生成 800x450 的 SVG→PNG 配图到 public/images/blog/
```

## 联系

- jay_z_zhang@qq.com
- [GitHub](https://github.com/Jay-Z-zhang)
- [jayzzhang.online](https://www.jayzzhang.online)

---

基于 [Astro Micro](https://github.com/trevortylerlee/astro-micro) 主题构建。

MIT License · Copyright 2025 Jayz Zhang
