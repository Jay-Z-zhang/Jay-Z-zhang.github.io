import sharp from 'sharp';
import fs from 'fs';

const width = 1200;
const height = 630;

const posts = [
  {
    id: '01-attribution-system',
    title: '归因系统从 0 到 1',
    subtitle: '增长 PM 的完整指南',
    desc: '从 SHEIN 两层模型到 TrainPal 实战落地',
    tag: '归因'
  },
  {
    id: '02-shein-vs-trainpal',
    title: 'SHEIN vs TrainPal',
    subtitle: '增长方法论的底层共通逻辑',
    desc: '大盘 LTV 对比 / 渠道质量矩阵 / 回本公式',
    tag: '竞品分析'
  },
  {
    id: '03-viral-campaign-design',
    title: '裂变活动效果计算器',
    subtitle: '增长 PM 的必备工具',
    desc: '快速估算裂变活动 ROI',
    tag: '工具'
  },
  {
    id: '04-ai-workflow',
    title: '用 AI 重构工作方式',
    subtitle: '我的 Agent 全流程实践',
    desc: '从调研到落地的 AI Agent 工作流',
    tag: 'AI'
  }
];

const projects = [
  {
    id: 'viral-calculator',
    title: '裂变漏斗计算器',
    subtitle: '增长 PM 必备工具',
    desc: '实时估算 K 因子 / CAC / ROI',
    tag: '工具'
  },
  {
    id: 'resume-builder',
    title: '简历生成器',
    subtitle: '多模板在线简历工具',
    desc: '4 模板 / 8 字体 / 双语 / 导出 PDF',
    tag: '工具'
  }
];

function generateImage(item) {
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <g opacity="0.04">
    ${Array.from({length: 20}, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${height}" stroke="#4ade80" stroke-width="1"/>`).join('')}
    ${Array.from({length: 12}, (_, i) => `<line x1="0" y1="${i * 60}" x2="${width}" y2="${i * 60}" stroke="#4ade80" stroke-width="1"/>`).join('')}
  </g>
  <!-- Tag badge -->
  <rect x="80" y="120" width="80" height="32" rx="16" fill="#4ade80" opacity="0.15"/>
  <text x="120" y="142" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#4ade80">${item.tag}</text>
  <!-- Title -->
  <text x="80" y="240" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="bold" fill="#ffffff">${item.title}</text>
  <!-- Subtitle -->
  <text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#94a3b8">${item.subtitle}</text>
  <!-- Description -->
  <text x="80" y="360" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#64748b">${item.desc}</text>
  <!-- Branding -->
  <text x="80" y="540" font-family="Arial, sans-serif" font-size="18" fill="#4ade80">jayzzhang.online</text>
  <circle cx="1080" cy="100" r="35" fill="#4ade80" opacity="0.08"/>
  <circle cx="1120" cy="530" r="55" fill="#4ade80" opacity="0.06"/>
</svg>
  `;

  return sharp(Buffer.from(svg)).png().toFile(`public/og/${item.id}.png`);
}

// Create og directory
if (!fs.existsSync('public/og')) {
  fs.mkdirSync('public/og', { recursive: true });
}

// Generate all images
const allItems = [...posts, ...projects];
await Promise.all(allItems.map(generateImage));
console.log(`✅ Generated ${allItems.length} OG images in public/og/`);
