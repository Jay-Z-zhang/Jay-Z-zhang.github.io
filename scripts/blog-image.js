#!/usr/bin/env node
/**
 * 博客图片管理工具
 * 用法: node scripts/blog-image.js <图片路径> [选项]
 *
 * 功能:
 * 1. 自动复制/移动图片到 public/images/blog/
 * 2. 压缩和缩放到指定尺寸（默认最大 1200px 宽，2MB）
 * 3. 生成 Markdown 引用代码（可直接粘贴到文章）
 * 4. 支持 PNG/JPG/WebP/SVG/GIF
 *
 * 选项:
 *   --copy          复制模式（默认）
 *   --move          移动模式（原文件会被移走）
 *   --compress      压缩图片（默认 PNG/JPG/WebP）
 *   --max-size=2MB  最大文件大小（默认 2MB，单位 MB）
 *   --max-width=1200 最大宽度（默认 1200px）
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public/images/blog');

// Parse arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('用法: node scripts/blog-image.js <图片路径> [选项]');
  console.log('');
  console.log('示例:');
  console.log('  node scripts/blog-image.js ~/Desktop/screenshot.png');
  console.log('  node scripts/blog-image.js ~/Desktop/screenshot.png --move --compress');
  console.log('  node scripts/blog-image.js ~/Desktop/photo.jpg --max-size=1 --max-width=800');
  console.log('');
  console.log('选项:');
  console.log('  --copy              复制模式（默认）');
  console.log('  --move              移动模式（原文件会被移走）');
  console.log('  --compress          压缩图片（默认 PNG/JPG/WebP）');
  console.log('  --max-size=<MB>     最大文件大小，单位 MB（默认 2）');
  console.log('  --max-width=<px>    最大宽度，单位 px（默认 1200）');
  console.log('');
  console.log('支持的格式: PNG, JPG, JPEG, WebP, SVG, GIF');
  process.exit(1);
}

// Parse options
const imagePath = path.resolve(args[0]);
const mode = args.includes('--move') ? 'move' : 'copy';
const compress = args.includes('--compress');
const maxSizeArg = args.find(a => a.startsWith('--max-size='));
const maxWidthArg = args.find(a => a.startsWith('--max-width='));

const maxSizeMB = maxSizeArg ? parseFloat(maxSizeArg.split('=')[1]) : 2;
const maxWidthPx = maxWidthArg ? parseInt(maxWidthArg.split('=')[1]) : 1200;
const maxSizeBytes = maxSizeMB * 1024 * 1024;

// Validate
if (!fs.existsSync(imagePath)) {
  console.error(`❌ 文件不存在：${imagePath}`);
  process.exit(1);
}

const ext = path.extname(imagePath).toLowerCase();
const validExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];
if (!validExts.includes(ext)) {
  console.error(`❌ 不支持的格式：${ext}`);
  console.error(`支持的格式：${validExts.join(', ')}`);
  process.exit(1);
}

// Check file size
const fileSize = fs.statSync(imagePath).size;
const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
console.log(`📊 原始文件大小：${fileSizeMB} MB`);

if (fileSize > maxSizeBytes) {
  console.log(`⚠️  文件超过 ${maxSizeMB}MB 限制，将自动压缩`);
}

// Ensure target directory exists
if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
}

// Generate filename (kebab-case, timestamp for uniqueness)
const baseName = path.basename(imagePath, ext);
const timestamp = Date.now();
const safeName = baseName
  .replace(/[^a-zA-Z0-9一-鿿]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
  .toLowerCase();

async function processImage() {
  const isVector = ext === '.svg';
  const isAnimated = ext === '.gif';

  // Skip compression for SVG and GIF
  if (isVector || isAnimated || (!compress && fileSize <= maxSizeBytes)) {
    // Direct copy/move
    const fileName = `${safeName}-${timestamp}${ext}`;
    const destPath = path.join(IMG_DIR, fileName);

    if (mode === 'move') {
      fs.renameSync(imagePath, destPath);
      console.log(`✅ 已移动：${imagePath}`);
    } else {
      fs.copyFileSync(imagePath, destPath);
      console.log(`✅ 已复制：${imagePath}`);
    }

    return { fileName, destPath };
  }

  // Compress and resize
  const fileName = `${safeName}-${timestamp}${ext}`;
  const destPath = path.join(IMG_DIR, fileName);

  let pipeline = sharp(imagePath);

  // Get metadata
  const metadata = await pipeline.metadata();
  console.log(` 原始尺寸：${metadata.width}x${metadata.height}`);

  // Resize if needed
  if (metadata.width > maxWidthPx) {
    pipeline = pipeline.resize(maxWidthPx, undefined, { withoutEnlargement: true });
    console.log(` 缩放到宽度：${maxWidthPx}px`);
  }

  // Compress based on format
  if (ext === '.png') {
    pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
  } else if (['.jpg', '.jpeg'].includes(ext)) {
    pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 85 });
  }

  await pipeline.toFile(destPath);

  const newSize = fs.statSync(destPath).size;
  const newSizeMB = (newSize / 1024 / 1024).toFixed(2);
  const reduction = ((1 - newSize / fileSize) * 100).toFixed(1);

  console.log(`✅ 已压缩：${fileSizeMB} MB → ${newSizeMB} MB (减少 ${reduction}%)`);

  if (newSize > maxSizeBytes) {
    console.log(`⚠️  警告：压缩后仍超过 ${maxSizeMB}MB，请手动处理`);
  }

  return { fileName, destPath };
}

// Execute
const { fileName, destPath } = await processImage();

// Generate Markdown reference
const relativePath = `/images/blog/${fileName}`;
const markdownCode = `![${baseName}](${relativePath})`;

console.log('');
console.log('─────────────────────────────────────────────────────');
console.log(`│ 文件：${fileName}`);
console.log(`│ 路径：${relativePath}`);
console.log(`│ 大小：${(fs.statSync(destPath).size / 1024).toFixed(1)} KB`);
console.log('│');
console.log(`│ Markdown 代码：`);
console.log(`│   ${markdownCode}`);
console.log('└─────────────────────────────────────────────────────');
console.log('');
console.log('复制上面的 Markdown 代码粘贴到文章中即可 ');
