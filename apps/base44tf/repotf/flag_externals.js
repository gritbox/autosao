#!/usr/bin/env node
/**
 * flag_externals.js — Audit remaining external dependencies in src/.
 *
 * Scans for: https/http URLs, <iframe> tags, external <script src=>, external CSS @import url().
 * Writes flagged_externals.txt. Informational only — does not fail.
 */

import fs from 'fs';
import path from 'path';

const WORK_DIR = process.env.WORK_DIR;
if (!WORK_DIR) {
  console.error('[FAIL] WORK_DIR environment variable is required');
  process.exit(1);
}
const OUTPUT_FILE = path.join(WORK_DIR, 'flagged_externals.txt');
const EXTENSIONS = /\.(jsx|js|ts|tsx|css|html)$/;

function resolve(...segs) {
  return path.join(WORK_DIR, ...segs);
}

function categorize(match) {
  const lower = match.toLowerCase();

  // iframe
  if (/<iframe/i.test(lower)) return 'iframe';

  // external script
  if (/<script\s[^>]*src\s*=/i.test(match)) return 'script';

  // CSS @import
  if (/@import\s+url\s*\(/i.test(match)) return 'stylesheet';

  // URL-based categorization
  if (/\.(woff2?|ttf|otf|eot)(\?|$|"|')/i.test(lower)) return 'font';
  if (/\.(png|jpe?g|gif|svg|webp|ico|avif)(\?|$|"|')/i.test(lower)) return 'image';
  if (/\.(css)(\?|$|"|')/i.test(lower)) return 'stylesheet';
  if (/\.(js|mjs)(\?|$|"|')/i.test(lower)) return 'script';
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(lower)) return 'font';

  return 'other';
}

function scanFile(filePath, findings) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');
  const rel = path.relative(WORK_DIR, filePath);

  const patterns = [
    // External URLs (https:// or http://)
    { regex: /https?:\/\/[^\s"'`<>)}\]]+/g, type: 'url' },
    // <iframe tags
    { regex: /<iframe\b[^>]*>/gi, type: 'tag' },
    // External <script src=...>
    { regex: /<script\s[^>]*src\s*=\s*["']https?:\/\/[^"']+["'][^>]*>/gi, type: 'tag' },
    // CSS @import url(...)
    { regex: /@import\s+url\s*\(\s*["']?https?:\/\/[^"')]+["']?\s*\)/gi, type: 'tag' },
  ];

  lines.forEach((line, i) => {
    for (const { regex } of patterns) {
      // Reset regex state
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(line)) !== null) {
        const value = match[0];
        // Skip data URIs, localhost, and relative-looking things
        if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(value)) continue;
        const category = categorize(value);
        findings.push({
          file: rel,
          line: i + 1,
          value: value.length > 200 ? value.slice(0, 200) + '...' : value,
          category,
        });
      }
    }
  });
}

function walk(dir, findings) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
      walk(full, findings);
    } else if (EXTENSIONS.test(entry.name)) {
      scanFile(full, findings);
    }
  }
}

try {
  console.log('=== flag_externals.js ===');

  const findings = [];

  // Scan src/
  walk(resolve('src'), findings);

  // Also scan root index.html
  const indexHtml = resolve('index.html');
  if (fs.existsSync(indexHtml)) {
    scanFile(indexHtml, findings);
  }

  // Deduplicate by file+line+value
  const seen = new Set();
  const unique = findings.filter(f => {
    const key = `${f.file}:${f.line}:${f.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Build output
  const lines = [
    `# External Dependencies Report`,
    `# Generated: ${new Date().toISOString()}`,
    `# Total findings: ${unique.length}`,
    ``,
  ];

  // Group by category
  const byCategory = {};
  for (const f of unique) {
    if (!byCategory[f.category]) byCategory[f.category] = [];
    byCategory[f.category].push(f);
  }

  for (const [cat, items] of Object.entries(byCategory).sort()) {
    lines.push(`## ${cat} (${items.length})`);
    for (const item of items) {
      lines.push(`  ${item.file}:${item.line}  ${item.value}`);
    }
    lines.push('');
  }

  fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf8');

  // Summary
  const cats = Object.entries(byCategory).map(([k, v]) => `${k}: ${v.length}`).join(', ');
  console.log(`Flagged ${unique.length} external reference(s): ${cats || 'none'}`);
  console.log(`Written to flagged_externals.txt`);
  console.log('=== flag_externals.js DONE ===');
} catch (err) {
  console.error(`[FAIL] flag_externals.js: ${err.message}`);
  process.exit(1);
}
