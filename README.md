# Jayz Zhang's Blog

> Growth PM · 用 AI 重构工作方式

[jayzzhang.online](https://www.jayzzhang.online)

---

## 关于

我是 Jayz Zhang（张志），Trip & TrainPal 的增长产品经理，专注 UK/EU 市场的裂变拉新。

这个博客是我记录增长方法论、创业认知和产品思考的地方。每一篇文章都来自真实工作场景中的问题——不是教科书式的理论搬运，而是「我遇到了什么坑、怎么解决的、数据说明了什么」。

## 核心主题

### 增长方法论

增长的底层逻辑是 **K 因子 × 转化率 × 留存率**。我写了一系列文章拆解这个公式的每个环节：

- **归因系统**：从 0 到 1 搭建归因，SHEIN 两层模型 vs TrainPal 实战
- **渠道质量评估**：大盘 LTV 对比、回本公式、漏斗差异
- **LTV/CAC 单位经济**：为什么很多公司死在「每单都亏钱」
- **北极星指标**：从虚荣指标到可执行的增长指标体系

### 创业融资

写给 0-1 岁创业者的融资指南，用大白话讲清楚复杂的金融概念：

- **融资工具对比**：SAFE / 可转债 / 可转换优先股，什么时候选哪个
- **融资路线图**：种子轮 → 天使轮 → A 轮 → B 轮 → IPO，每个阶段该做什么
- **核心指标**：MAU 怎么算、ARR 有哪些「水分」、PMF 的五种幻觉

### 出海推广

面向全球市场的产品如何做海外营销：

- **社媒矩阵**：Reddit、Twitter、Facebook、ProductHunt 等 7 大平台的定位和运营策略
- **渠道组合**：1 人团队 / 2-3 人团队 / 完整团队分别怎么配置
- **实战复盘**：从 0 到 1 搭建海外流量矩阵的完整流程

### 技术实践

- **上线前自查**：操作卓越 / 安全 / 可靠 / 性能 / 成本，五大维度 20 个关键动作
- **AI 工具**：Agent 工作流、Vibe Coding、用 AI 重构日常工作方式

## 项目作品

| 项目 | 说明 |
|------|------|
| [裂变漏斗计算器](https://www.jayzzhang.online/apps/viral-calculator/) | 增长 PM 必备，实时估算 K 因子 / CAC / ROI |
| [简历修改器](https://www.jayzzhang.online/resume-builder/) | 多模板在线简历工具，AI 分析 + PDF 导出 + 中英双语 |

## 文章列表

| # | 标题 | 核心观点 |
|---|------|----------|
| 00 | [MAU、ARR、PMF：初创公司必懂的 3 个核心指标](https://www.jayzzhang.online/blog/00-mau-arr-pmf/) | 指标不是数字游戏，是业务健康的体检报告 |
| 01 | [可转债 vs 可转换优先股](https://www.jayzzhang.online/blog/01-convertible-bonds/) | 选融资工具就是选「赌未来」还是「保底 + 赌未来」 |
| 02 | [SAFE 融资工具详解](https://www.jayzzhang.online/blog/02-safe-financing/) | YC 发明的延迟估值方案，5 页纸完成融资 |
| 03 | [海外社媒推广指南](https://www.jayzzhang.online/blog/03-overseas-promotion/) | 7 大流量池的定位、运营策略和避坑指南 |
| 04 | [创业融资全流程](https://www.jayzzhang.online/blog/04-funding-rounds/) | 从天使轮到 IPO，每个阶段该找谁、融多少 |
| 05 | [应用上线前自查清单](https://www.jayzzhang.online/blog/05-prelaunch-checklist/) | 五大维度 20 个关键动作，避免上线翻车 |
| 06 | [LTV/CAC > 3 的单位经济](https://www.jayzzhang.online/blog/06-ltv-cac/) | 用收入代替毛利润算 LTV，差距可能达到 3 倍 |
| 07 | [增长指标体系搭建](https://www.jayzzhang.online/blog/07-growth-metrics/) | 从虚荣指标到北极星指标的分层模型 |
| 08 | [海外推广渠道全攻略](https://www.jayzzhang.online/blog/08-overseas-channels/) | Reddit / Twitter / ProductHunt 实战经验 |

## 技术实现

博客基于 [Astro](https://astro.build) 构建，使用 Astro Micro 主题。核心设计理念是 **性能优先**：

- **零 JS 运行时**：大部分页面纯静态，客户端 JS 仅用于交互增强
- **IntersectionObserver**：动画、评论、Canvas 都在进入视口时才激活
- **字体精简**：只加载必要的字体权重
- **懒加载**：图片 lazy loading + async decoding
- **预取**：导航链接和上下篇文章自动 prefetch

内容使用 Markdown 编写，支持暗色/亮色双主题，评论系统基于 [Giscus](https://giscus.app)（GitHub Discussions）。

## 博客配图

每篇文章的封面图通过 `scripts/gen-blog-images.js` 自动生成。使用 SVG 模板 + Sharp 转换为 PNG，保持与网站统一的暗色主题风格。

## 联系

- jay_z_zhang@qq.com
- [GitHub](https://github.com/Jay-Z-zhang)
- [jayzzhang.online](https://www.jayzzhang.online)

---

MIT License · Copyright 2025 Jayz Zhang
