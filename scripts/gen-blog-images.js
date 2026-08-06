import sharp from 'sharp';
import fs from 'fs';

const W = 800, H = 450;

function img(svg, name) {
  return sharp(Buffer.from(svg)).png().toFile(`public/images/blog/${name}.png`);
}

// 00: MAU/ARR/PMF - funnel diagram
await img(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0f172a" rx="12"/>
  <text x="400" y="50" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">PMF → MAU → ARR 增长飞轮</text>
  <polygon points="200,100 600,100 550,200 250,200" fill="#22c55e" opacity="0.8"/>
  <text x="400" y="165" text-anchor="middle" fill="#fff" font-size="22" font-weight="bold" font-family="Arial">PMF 产品市场契合</text>
  <polygon points="230,220 570,220 530,310 270,310" fill="#4ade80" opacity="0.6"/>
  <text x="400" y="275" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">MAU 用户增长</text>
  <polygon points="260,330 540,330 510,410 290,410" fill="#86efac" opacity="0.5"/>
  <text x="400" y="380" text-anchor="middle" fill="#0f172a" font-size="20" font-weight="bold" font-family="Arial">ARR 收入增长</text>
</svg>`, '00-growth-flywheel');

// 01: Convertible bonds vs preferred stock - comparison
await img(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0f172a" rx="12"/>
  <text x="400" y="50" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">可转债 vs 可转换优先股</text>
  <rect x="60" y="80" width="320" height="340" rx="12" fill="#131928" stroke="#22c55e" stroke-width="2"/>
  <text x="220" y="120" text-anchor="middle" fill="#22c55e" font-size="20" font-weight="bold" font-family="Arial">可转债</text>
  <text x="220" y="160" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Arial">• 债权人身份</text>
  <text x="220" y="190" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Arial">• 刚性现金流</text>
  <text x="220" y="220" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Arial">• 转换前不稀释</text>
  <text x="220" y="250" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Arial">• 无投票权</text>
  <text x="220" y="290" text-anchor="middle" fill="#22c55e" font-size="13" font-family="Arial">适合：快速 IPO</text>
  <rect x="420" y="80" width="320" height="340" rx="12" fill="#131928" stroke="#4ade80" stroke-width="2"/>
  <text x="580" y="120" text-anchor="middle" fill="#4ade80" font-size="20" font-weight="bold" font-family="Arial">可转换优先股</text>
  <text x="580" y="160" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Arial">• 股东身份</text>
  <text x="580" y="190" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Arial">• 灵活现金流</text>
  <text x="580" y="220" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Arial">• 立即稀释</text>
  <text x="580" y="250" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Arial">• 有投票权</text>
  <text x="580" y="290" text-anchor="middle" fill="#4ade80" font-size="13" font-family="Arial">适合：现金流紧张</text>
</svg>`, '01-bonds-vs-stock');

// 02: SAFE timeline
await img(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0f172a" rx="12"/>
  <text x="400" y="50" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">SAFE 融资流程</text>
  <line x1="100" y1="120" x2="700" y2="120" stroke="#22c55e" stroke-width="3"/>
  <circle cx="150" cy="120" r="20" fill="#22c55e"/><text x="150" y="126" text-anchor="middle" fill="#0f172a" font-size="14" font-weight="bold" font-family="Arial">1</text>
  <circle cx="400" cy="120" r="20" fill="#22c55e"/><text x="400" y="126" text-anchor="middle" fill="#0f172a" font-size="14" font-weight="bold" font-family="Arial">2</text>
  <circle cx="650" cy="120" r="20" fill="#22c55e"/><text x="650" y="126" text-anchor="middle" fill="#0f172a" font-size="14" font-weight="bold" font-family="Arial">3</text>
  <text x="150" y="170" text-anchor="middle" fill="#fff" font-size="14" font-family="Arial">签 SAFE</text>
  <text x="150" y="195" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">投资人给钱</text>
  <text x="150" y="215" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">不给股份</text>
  <text x="400" y="170" text-anchor="middle" fill="#fff" font-size="14" font-family="Arial">等待融资</text>
  <text x="400" y="195" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">公司发展</text>
  <text x="400" y="215" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">估值增长</text>
  <text x="650" y="170" text-anchor="middle" fill="#fff" font-size="14" font-family="Arial">自动转换</text>
  <text x="650" y="195" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">按优惠价</text>
  <text x="650" y="215" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">变成股份</text>
  <rect x="200" y="260" width="400" height="160" rx="12" fill="#131928" stroke="#22c55e" stroke-width="1"/>
  <text x="400" y="300" text-anchor="middle" fill="#4ade80" font-size="16" font-weight="bold" font-family="Arial">关键优势</text>
  <text x="400" y="340" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Arial">延迟估值 · 文件简单 · 快速成交 · 无到期日</text>
  <text x="400" y="380" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Arial">5 页纸协议，3-7 天完成融资</text>
</svg>`, '02-safe-timeline');

// 03: Social media platforms grid
await img(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0f172a" rx="12"/>
  <text x="400" y="50" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">海外社媒流量矩阵</text>
  ${['Reddit','Twitter','Facebook','Indie Hackers','ProductHunt','Hacker News','LinkedIn'].map((name, i) => {
    const x = 60 + (i % 4) * 185;
    const y = 80 + Math.floor(i / 4) * 170;
    const colors = ['#ff4500','#1da1f2','#1877f2','#059669','#f06543','#ff6600','#0a66c2'];
    return `<rect x="${x}" y="${y}" width="165" height="140" rx="12" fill="#131928" stroke="${colors[i]}" stroke-width="2"/>
      <text x="${x+82}" y="${y+50}" text-anchor="middle" fill="${colors[i]}" font-size="15" font-weight="bold" font-family="Arial">${name}</text>
      <text x="${x+82}" y="${y+80}" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">${['深度论坛','实时互动','社群运营','开发者社区','产品发布','技术极客','职业社交'][i]}</text>
      <text x="${x+82}" y="${y+105}" text-anchor="middle" fill="#64748b" font-size="10" font-family="Arial">${['SEO价值高','算法推荐','28亿用户','高转化','早期用户','数万UV','专业人群'][i]}</text>`;
  }).join('')}
</svg>`, '03-social-matrix');

// 04: Funding rounds staircase
await img(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0f172a" rx="12"/>
  <text x="400" y="50" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">创业融资路线图</text>
  ${[
    {x:40,y:320,w:140,h:100,label:'种子轮',amount:'10-50万',color:'#64748b'},
    {x:180,y:260,w:140,h:160,label:'天使轮',amount:'100-500万',color:'#94a3b8'},
    {x:320,y:200,w:140,h:220,label:'A 轮',amount:'1000万-1亿',color:'#22c55e'},
    {x:460,y:140,w:140,h:280,label:'B 轮',amount:'1-5亿',color:'#4ade80'},
    {x:600,y:80,w:140,h:340,label:'C 轮',amount:'5-20亿+',color:'#86efac'},
  ].map(s => `
    <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="8" fill="${s.color}" opacity="0.3"/>
    <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="8" fill="none" stroke="${s.color}" stroke-width="2"/>
    <text x="${s.x+s.w/2}" y="${s.y+35}" text-anchor="middle" fill="${s.color}" font-size="16" font-weight="bold" font-family="Arial">${s.label}</text>
    <text x="${s.x+s.w/2}" y="${s.y+60}" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">${s.amount}</text>
  `).join('')}
  <text x="400" y="430" text-anchor="middle" fill="#64748b" font-size="12" font-family="Arial">想法 → 原型 → 验证 → 扩张 → 上市</text>
</svg>`, '04-funding-stairs');

// 05: Pre-launch checklist
await img(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0f172a" rx="12"/>
  <text x="400" y="50" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">上线前五大维度自查</text>
  ${[
    {x:40,y:80,label:'操作卓越',color:'#22c55e',items:['事件响应','全链路监控','部署回滚']},
    {x:190,y:80,label:'安全性',color:'#4ade80',items:['WAF防护','CSP策略','权限管控']},
    {x:340,y:80,label:'可靠性',color:'#86efac',items:['冗余部署','缓存策略','可观测性']},
    {x:490,y:80,label:'性能',color:'#bbf7d0',items:['Core Vitals','资源优化','降低延迟']},
    {x:640,y:80,label:'成本',color:'#dcfce7',items:['成本监控','资源优化','缓存策略']},
  ].map(c => `
    <rect x="${c.x}" y="${c.y}" width="140" height="340" rx="12" fill="#131928" stroke="${c.color}" stroke-width="1.5"/>
    <circle cx="${c.x+70}" cy="${c.y+40}" r="20" fill="${c.color}" opacity="0.2"/>
    <text x="${c.x+70}" y="${c.y+46}" text-anchor="middle" fill="${c.color}" font-size="20" font-weight="bold" font-family="Arial">${c.label.charAt(0)}</text>
    <text x="${c.x+70}" y="${c.y+75}" text-anchor="middle" fill="${c.color}" font-size="14" font-weight="bold" font-family="Arial">${c.label}</text>
    ${c.items.map((item, i) => `<text x="${c.x+70}" y="${c.y+110+i*30}" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">✓ ${item}</text>`).join('')}
  `).join('')}
</svg>`, '05-checklist');

// 06: LTV/CAC balance
await img(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0f172a" rx="12"/>
  <text x="400" y="50" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">单位经济模型：LTV vs CAC</text>
  <!-- Scale -->
  <line x1="150" y1="200" x2="650" y2="200" stroke="#475569" stroke-width="4"/>
  <polygon points="380,190 420,190 400,210" fill="#475569"/>
  <!-- LTV side -->
  <rect x="100" y="120" width="280" height="80" rx="12" fill="#22c55e" opacity="0.2"/>
  <text x="240" y="155" text-anchor="middle" fill="#22c55e" font-size="20" font-weight="bold" font-family="Arial">LTV</text>
  <text x="240" y="180" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Arial">用户终身价值（毛利润）</text>
  <!-- CAC side -->
  <rect x="420" y="120" width="280" height="80" rx="12" fill="#ef4444" opacity="0.2"/>
  <text x="560" y="155" text-anchor="middle" fill="#ef4444" font-size="20" font-weight="bold" font-family="Arial">CAC</text>
  <text x="560" y="180" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Arial">完全加载获客成本</text>
  <!-- Result zones -->
  <rect x="60" y="250" width="200" height="60" rx="8" fill="#ef4444" opacity="0.15"/>
  <text x="160" y="280" text-anchor="middle" fill="#ef4444" font-size="14" font-weight="bold" font-family="Arial">LTV/CAC &lt; 1</text>
  <text x="160" y="300" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">每单亏钱</text>
  <rect x="300" y="250" width="200" height="60" rx="8" fill="#eab308" opacity="0.15"/>
  <text x="400" y="280" text-anchor="middle" fill="#eab308" font-size="14" font-weight="bold" font-family="Arial">LTV/CAC = 1-2</text>
  <text x="400" y="300" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">勉强持平</text>
  <rect x="540" y="250" width="200" height="60" rx="8" fill="#22c55e" opacity="0.15"/>
  <text x="640" y="280" text-anchor="middle" fill="#22c55e" font-size="14" font-weight="bold" font-family="Arial">LTV/CAC &gt;= 3</text>
  <text x="640" y="300" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">健康 ✓</text>
  <!-- Key insight -->
  <rect x="150" y="340" width="500" height="80" rx="12" fill="#131928" stroke="#22c55e" stroke-width="1"/>
  <text x="400" y="375" text-anchor="middle" fill="#4ade80" font-size="14" font-weight="bold" font-family="Arial">常见错误：用收入代替毛利润计算 LTV</text>
  <text x="400" y="400" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">差距可能达到 3 倍！</text>
</svg>`, '06-ltv-cac');

// 07: Metrics pyramid
await img(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0f172a" rx="12"/>
  <text x="400" y="40" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">增长指标分层模型</text>
  <!-- Pyramid -->
  <polygon points="300,80 500,80 560,180 240,180" fill="#86efac" opacity="0.3"/>
  <polygon points="260,180 540,180 600,280 200,280" fill="#4ade80" opacity="0.25"/>
  <polygon points="220,280 580,280 640,380 160,380" fill="#22c55e" opacity="0.2"/>
  <polygon points="180,380 620,380 680,440 120,440" fill="#16a34a" opacity="0.15"/>
  <!-- Labels -->
  <text x="400" y="140" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Arial">北极星指标</text>
  <text x="400" y="240" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold" font-family="Arial">一级指标（驱动因素）</text>
  <text x="400" y="340" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="Arial">二级指标（诊断指标）</text>
  <text x="400" y="420" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">健康指标（Guardrail）</text>
  <!-- Examples -->
  <text x="400" y="158" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">如：周订单数</text>
  <text x="400" y="258" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">如：活跃司机数、接单率</text>
  <text x="400" y="358" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">如：拒单率、等待时长</text>
  <text x="400" y="435" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">如：退订率 &lt; 5%</text>
</svg>`, '07-metrics-pyramid');

// 08: Channel strategy
await img(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0f172a" rx="12"/>
  <text x="400" y="50" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">渠道组合策略</text>
  <!-- 3 tiers -->
  <rect x="40" y="80" width="720" height="100" rx="12" fill="#131928" stroke="#22c55e" stroke-width="2"/>
  <text x="100" y="115" fill="#22c55e" font-size="14" font-weight="bold" font-family="Arial">最小组合（1人）</text>
  <text x="100" y="140" fill="#94a3b8" font-size="12" font-family="Arial">Twitter + Reddit + ProductHunt</text>
  <text x="100" y="160" fill="#64748b" font-size="11" font-family="Arial">每天 30 分钟，每周 1-2 篇</text>

  <rect x="40" y="200" width="720" height="100" rx="12" fill="#131928" stroke="#4ade80" stroke-width="2"/>
  <text x="100" y="235" fill="#4ade80" font-size="14" font-weight="bold" font-family="Arial">标准组合（2-3人）</text>
  <text x="100" y="260" fill="#94a3b8" font-size="12" font-family="Arial">Twitter + Medium + Reddit + Facebook Group</text>
  <text x="100" y="280" fill="#64748b" font-size="11" font-family="Arial">每周 2 篇长文，每天互动</text>

  <rect x="40" y="320" width="720" height="100" rx="12" fill="#131928" stroke="#86efac" stroke-width="2"/>
  <text x="100" y="355" fill="#86efac" font-size="14" font-weight="bold" font-family="Arial">全力组合（完整团队）</text>
  <text x="100" y="380" fill="#94a3b8" font-size="12" font-family="Arial">全渠道矩阵 + 付费投放 + PR 发布</text>
  <text x="100" y="400" fill="#64748b" font-size="11" font-family="Arial">内容 + 社区 + 广告 + PR 四轮驱动</text>

  <!-- Key insight -->
  <text x="400" y="440" text-anchor="middle" fill="#4ade80" font-size="13" font-family="Arial">💡 一篇长文 → 拆成 10 条内容分发到不同平台</text>
</svg>`, '08-channel-strategy');

console.log('✅ Generated 8 blog images');
