#!/usr/bin/env node
/**
 * fetch_assets.js — Download external assets from media.base44.com and rewrite URLs.
 *
 * - Scans .jsx, .js, .ts, .tsx, .css, .html under src/ and index.html for media.base44.com URLs
 * - Downloads each to public/assets/, handling filename collisions with short hashes
 * - Rewrites all source occurrences to /assets/<filename>
 * - Logs failures to failed_downloads.txt
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import crypto from 'crypto';

const WORK_DIR = process.env.WORK_DIR || '/Users/wm/Code/GRITBOX_GH/autosao/apps/base44tf/transformed';
const ASSETS_DIR = path.join(WORK_DIR, 'public', 'assets');
const EXTENSIONS = /\.(jsx|js|ts|tsx|css|html)$/;
const URL_PATTERN = /https:\/\/media\.base44\.com\/[^\s"'`)]+/g;

function resolve(...segs) {
  return path.join(WORK_DIR, ...segs);
}

function shortHash(str) {
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 8);
}

/**
 * Collect all unique media.base44.com URLs from source files.
 */
function collectUrls() {
  const urlSet = new Set();
  const scanDirs = [resolve('src'), resolve('index.html')];

  function walkFile(filePath) {
    const text = fs.readFileSync(filePath, 'utf8');
    const matches = text.match(URL_PATTERN);
    if (matches) {
      matches.forEach(u => urlSet.add(u));
    }
  }

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const stat = fs.statSync(dir);
    if (stat.isFile()) {
      if (EXTENSIONS.test(dir) || dir.endsWith('.html')) {
        walkFile(dir);
      }
      return;
    }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
        walk(full);
      } else if (EXTENSIONS.test(entry.name)) {
        walkFile(full);
      }
    }
  }

  scanDirs.forEach(d => walk(d));
  return [...urlSet];
}

/**
 * Download a URL to a local file. Returns a promise.
 */
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);

    const request = proto.get(url, { timeout: 30000 }, (response) => {
      // Follow redirects (up to 5)
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        file.close();
        fs.unlinkSync(dest);
        const redirectUrl = response.headers.location;
        if (!redirectUrl) {
          reject(new Error(`Redirect with no location header`));
          return;
        }
        download(redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).href, dest)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', (err) => { fs.unlinkSync(dest); reject(err); });
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });

    request.on('timeout', () => {
      request.destroy();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(new Error('Download timed out'));
    });
  });
}

/**
 * Build a URL → local filename map, avoiding collisions.
 */
function buildFilenameMap(urls) {
  const map = new Map(); // url → local filename
  const usedNames = new Set();

  for (const url of urls) {
    const parsed = new URL(url);
    let basename = path.basename(parsed.pathname);

    // If no extension, try to infer from path
    if (!path.extname(basename)) {
      basename += '.bin';
    }

    let finalName = basename;
    if (usedNames.has(finalName)) {
      const ext = path.extname(basename);
      const stem = path.basename(basename, ext);
      finalName = `${stem}_${shortHash(url)}${ext}`;
    }

    usedNames.add(finalName);
    map.set(url, finalName);
  }

  return map;
}

/**
 * Rewrite all occurrences of the URLs in source files.
 */
function rewriteUrls(urlToFilename) {
  function rewriteFile(filePath) {
    let text = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const [url, filename] of urlToFilename) {
      if (text.includes(url)) {
        text = text.split(url).join(`/assets/${filename}`);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, text, 'utf8');
    }
  }

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const stat = fs.statSync(dir);
    if (stat.isFile()) {
      rewriteFile(dir);
      return;
    }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'public') continue;
        walk(full);
      } else if (EXTENSIONS.test(entry.name)) {
        rewriteFile(full);
      }
    }
  }

  // Scan src/ and also root-level index.html
  walk(resolve('src'));
  const indexHtml = resolve('index.html');
  if (fs.existsSync(indexHtml)) {
    rewriteFile(indexHtml);
  }
}

async function main() {
  console.log('=== fetch_assets.js ===');

  // Ensure public/assets/ exists
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  // Collect URLs
  const urls = collectUrls();
  console.log(`Found ${urls.length} media.base44.com URL(s)`);

  if (urls.length === 0) {
    console.log('Nothing to download.');
    console.log('=== fetch_assets.js DONE ===');
    return;
  }

  // Build filename map
  const urlToFilename = buildFilenameMap(urls);

  // Download all
  let downloaded = 0;
  let failed = 0;
  const failures = [];

  for (const [url, filename] of urlToFilename) {
    const dest = path.join(ASSETS_DIR, filename);
    try {
      await download(url, dest);
      downloaded++;
      console.log(`  [DL] ${filename}`);
    } catch (err) {
      failed++;
      failures.push(`${url} — ${err.message}`);
      console.log(`  [FAIL] ${filename} — ${err.message}`);
    }
  }

  // Write failures log
  if (failures.length > 0) {
    fs.writeFileSync(
      path.join(WORK_DIR, 'failed_downloads.txt'),
      failures.join('\n') + '\n',
      'utf8'
    );
  }

  // Rewrite URLs in source
  rewriteUrls(urlToFilename);
  console.log('Rewrote source URLs to local /assets/ paths');

  console.log(`${urls.length} URLs found, ${downloaded} downloaded, ${failed} failed.`);
  console.log('=== fetch_assets.js DONE ===');
}

main().catch(err => {
  console.error(`[FAIL] fetch_assets.js: ${err.message}`);
  process.exit(1);
});
