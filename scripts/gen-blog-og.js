import sharp from 'sharp';
import fs from 'fs';

const width = 1200;
const height = 630;

const articles = [
  { id: '00-mau-arr-pmf', title: 'MAU、ARR、PMF', subtitle: '初创公司必懂的 3 个核心指标', tag: '创业' },
  { id: '01-convertible-bonds', title: '可转债 vs 可转换优先股', subtitle: '两种融资工具的核心区别', tag: '融资' },
  { id: '02-safe-financing', title: 'SAFE 融资工具详解', subtitle: 'Y Combinator 推出的新型融资方案', tag: '融资' },
  { id: '03-overseas-promotion', title: '海外社媒推广指南', subtitle: '7 大平台搭建出海流量矩阵', tag: '出海' },
  { id: '04-funding-rounds', title: '天使轮·A轮·B轮·C轮', subtitle: '一文搞懂创业融资全流程', tag: '融资' },
  { id: '05-prelaunch-checklist', title: '应用上线前自查清单', subtitle: '操作·安全·可靠·性能·成本', tag: '技术' },
  { id: '06-ltv-cac', title: 'LTV/CAC > 3？', subtitle: '单位经济模型的健康度检验', tag: '增长' },
  { id: '07-growth-metrics', title: '增长指标体系搭建', subtitle: '从虚荣指标到北极星指标', tag: '增长' },
  { id: '08-overseas-channels', title: '海外推广渠道全攻略', subtitle: 'Reddit·Twitter·ProductHunt 实战', tag: '出海' },
];

const svg = (item) => `
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
  <rect x="80" y="120" width="80" height="32" rx="16" fill="#4ade80" opacity="0.15"/>
  <text x="120" y="142" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#4ade80">${item.tag}</text>
  <text x="80" y="240" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="bold" fill="#ffffff">${item.title}</text>
  <text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#94a3b8">${item.subtitle}</text>
  <text x="80" y="540" font-family="Arial, sans-serif" font-size="18" fill="#4ade80">jayzzhang.online</text>
  <circle cx="1080" cy="100" r="35" fill="#4ade80" opacity="0.08"/>
  <circle cx="1120" cy="530" r="55" fill="#4ade80" opacity="0.06"/>
</svg>
`;

if (!fs.existsSync('public/og')) {
  fs.mkdirSync('public/og', { recursive: true });
}

await Promise.all(articles.map(item =>
  sharp(Buffer.from(svg(item))).png().toFile(`public/og/${item.id}.png`)
));
console.log(`✅ Generated ${articles.length} OG images`);
