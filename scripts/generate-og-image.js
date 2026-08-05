import sharp from 'sharp';

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#4ade80;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#22c55e;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <!-- Decorative grid pattern -->
  <g opacity="0.05">
    ${Array.from({length: 20}, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${height}" stroke="#4ade80" stroke-width="1"/>`).join('')}
    ${Array.from({length: 12}, (_, i) => `<line x1="0" y1="${i * 60}" x2="${width}" y2="${i * 60}" stroke="#4ade80" stroke-width="1"/>`).join('')}
  </g>

  <!-- Green accent bar -->
  <rect x="80" y="200" width="6" height="120" fill="url(#accent)" rx="3"/>

  <!-- Main title -->
  <text x="110" y="260" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="#ffffff">Jayz Zhang</text>

  <!-- Tagline -->
  <text x="110" y="310" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#94a3b8">Growth PM · 用 AI 重构工作方式</text>

  <!-- Description -->
  <text x="110" y="380" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#64748b">增长方法论 · 产品思考 · AI 工具实践</text>

  <!-- Website URL -->
  <text x="110" y="500" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#4ade80">jayzzhang.online</text>

  <!-- Decorative dots -->
  <circle cx="1050" cy="100" r="40" fill="#4ade80" opacity="0.1"/>
  <circle cx="1100" cy="550" r="60" fill="#4ade80" opacity="0.08"/>
  <circle cx="100" cy="550" r="30" fill="#4ade80" opacity="0.12"/>
</svg>
`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('public/og-image.png');

console.log('✅ OG image generated: public/og-image.png');
console.log('   Size: 1200x630px');
