#!/usr/bin/env node
/**
 * 博客图片管理工具
 * 用法: node scripts/blog-image.js <图片路径> [--copy|--move]
 *
 * 功能:
 * 1. 自动复制/移动图片到 public/images/blog/
 * 2. 生成 Markdown 引用代码（可直接粘贴到文章）
 * 3. 支持 PNG/JPG/WebP/SVG
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public/images/blog');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('用法: node scripts/blog-image.js <图片路径> [--copy|--move]');
  console.log('');
  console.log('示例:');
  console.log('  node scripts/blog-image.js ~/Desktop/screenshot.png');
  console.log('  node scripts/blog-image.js ~/Desktop/screenshot.png --move');
  console.log('');
  console.log('支持的格式: PNG, JPG, JPEG, WebP, SVG, GIF');
  process.exit(1);
}

const imagePath = path.resolve(args[0]);
const mode = args.includes('--move') ? 'move' : 'copy';

// Validate
if (!fs.existsSync(imagePath)) {
  console.error(`❌ 文件不存在: ${imagePath}`);
  process.exit(1);
}

const ext = path.extname(imagePath).toLowerCase();
const validExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];
if (!validExts.includes(ext)) {
  console.error(`❌ 不支持的格式: ${ext}`);
  console.error(`支持的格式: ${validExts.join(', ')}`);
  process.exit(1);
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
const fileName = `${safeName}-${timestamp}${ext}`;
const destPath = path.join(IMG_DIR, fileName);

// Copy or move
if (mode === 'move') {
  fs.renameSync(imagePath, destPath);
  console.log(`✅ 已移动: ${imagePath}`);
} else {
  fs.copyFileSync(imagePath, destPath);
  console.log(`✅ 已复制: ${imagePath}`);
}

// Generate Markdown reference
const relativePath = `/images/blog/${fileName}`;
const markdownCode = `![${baseName}](${relativePath})`;

console.log('');
console.log('┌─────────────────────────────────────────────────────');
console.log(`│ 文件: ${fileName}`);
console.log(`│ 路径: ${relativePath}`);
console.log(`│ 大小: ${(fs.statSync(destPath).size / 1024).toFixed(1)} KB`);
console.log('│');
console.log(`│ Markdown 代码:`);
console.log(`│   ${markdownCode}`);
console.log('└─────────────────────────────────────────────────────');
console.log('');
console.log('复制上面的 Markdown 代码粘贴到文章中即可 ️');
