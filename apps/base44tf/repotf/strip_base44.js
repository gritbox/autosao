#!/usr/bin/env node
/**
 * strip_base44.js — Remove Base44 platform dependencies from the working directory.
 *
 * Steps:
 *   A. Replace src/api/base44Client.js with a no-op stub
 *   B. Replace src/lib/AuthContext.jsx with a passthrough provider
 *   C. Simplify src/lib/PageNotFound.jsx (remove base44.auth.me calls)
 *   D. Clean package.json — remove @base44/* deps
 *   E. Clean vite.config.js — remove Base44 plugin
 *   F. Verify — grep for leftover @base44 / base44.auth references
 */

import fs from 'fs';
import path from 'path';

const WORK_DIR = process.env.WORK_DIR || '/Users/wm/Code/GRITBOX_GH/autosao/apps/base44tf/transformed';

function resolve(...segs) {
  return path.join(WORK_DIR, ...segs);
}

// ─── A. Stub base44Client.js ────────────────────────────────────────────────
function stubBase44Client() {
  const file = resolve('src', 'api', 'base44Client.js');
  const stub = `// Stub: Base44 SDK removed
export const base44 = {
  auth: {
    me: async () => null,
    logout: async () => {},
    redirectToLogin: () => {},
  },
};
export default base44;
`;
  fs.writeFileSync(file, stub, 'utf8');
  console.log('[OK] Replaced src/api/base44Client.js with stub');
}

// ─── B. Passthrough AuthContext ─────────────────────────────────────────────
function replaceAuthContext() {
  const file = resolve('src', 'lib', 'AuthContext.jsx');
  const content = `import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{
      user: null,
      isAuthenticated: false,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: null,
      logout: () => {},
      navigateToLogin: () => {},
      checkAppState: () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
`;
  fs.writeFileSync(file, content, 'utf8');
  console.log('[OK] Replaced src/lib/AuthContext.jsx with passthrough provider');
}

// ─── C. Simplify PageNotFound ───────────────────────────────────────────────
function simplifyPageNotFound() {
  const file = resolve('src', 'lib', 'PageNotFound.jsx');
  const content = `import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-slate-300">404</h1>
            <div className="h-0.5 w-16 bg-slate-200 mx-auto"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-slate-800">Page Not Found</h2>
            <p className="text-slate-600 leading-relaxed">
              The page <span className="font-medium text-slate-700">"{pageName}"</span> could not be found.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(file, content, 'utf8');
  console.log('[OK] Simplified src/lib/PageNotFound.jsx (removed base44.auth.me calls)');
}

// ─── D. Clean package.json ──────────────────────────────────────────────────
function cleanPackageJson() {
  const file = resolve('package.json');
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));

  let removed = [];

  for (const section of ['dependencies', 'devDependencies']) {
    if (!pkg[section]) continue;
    for (const dep of Object.keys(pkg[section])) {
      if (dep.startsWith('@base44/') || dep.startsWith('@base44')) {
        delete pkg[section][dep];
        removed.push(dep);
      }
    }
  }

  // axios is only used inside AuthContext (which we replaced) and base44Client —
  // the stub doesn't use it, so remove if present.
  for (const section of ['dependencies', 'devDependencies']) {
    if (pkg[section] && pkg[section]['axios']) {
      delete pkg[section]['axios'];
      removed.push('axios');
    }
  }

  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log(`[OK] Cleaned package.json — removed: ${removed.join(', ') || 'nothing to remove'}`);

  // Delete package-lock.json — it contains stale @base44 entries and npm install will regenerate it
  const lockFile = resolve('package-lock.json');
  if (fs.existsSync(lockFile)) {
    fs.unlinkSync(lockFile);
    console.log('[OK] Deleted package-lock.json (will be regenerated by npm install)');
  }
}

// ─── E. Clean vite.config.js ────────────────────────────────────────────────
function cleanViteConfig() {
  const file = resolve('vite.config.js');
  const content = `import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`;
  fs.writeFileSync(file, content, 'utf8');
  console.log('[OK] Cleaned vite.config.js — removed Base44 plugin');
}

// ─── F. Fix index.html — favicon + title ────────────────────────────────────
// The favicon at https://base44.com/logo_v2.svg returns HTTP 400 and cannot be
// downloaded. We create a simple placeholder SVG and rewrite the href.
function fixIndexHtml() {
  const file = resolve('index.html');
  if (!fs.existsSync(file)) {
    console.log('[SKIP] index.html not found');
    return;
  }
  let html = fs.readFileSync(file, 'utf8');

  // Replace favicon: base44.com/logo_v2.svg → local placeholder
  html = html.replace(
    /href="https:\/\/base44\.com\/logo_v2\.svg"/,
    'href="/assets/favicon.svg"'
  );

  // Replace title: "Base44 APP" → "Brick Street Deli"
  html = html.replace(
    /<title>Base44 APP<\/title>/,
    '<title>Brick Street Deli</title>'
  );

  fs.writeFileSync(file, html, 'utf8');

  // Create placeholder favicon SVG
  const assetsDir = resolve('public', 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });
  const faviconPath = path.join(assetsDir, 'favicon.svg');
  if (!fs.existsSync(faviconPath)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#2d2d2d"/>
  <text x="32" y="44" font-family="sans-serif" font-size="36" font-weight="bold" fill="#fff" text-anchor="middle">B</text>
</svg>
`;
    fs.writeFileSync(faviconPath, svg, 'utf8');
    console.log('[OK] Created placeholder public/assets/favicon.svg');
  }

  console.log('[OK] Fixed index.html — favicon → /assets/favicon.svg, title → Brick Street Deli');
}

// ─── G. Delete dead code: src/lib/app-params.js ─────────────────────────────
function deleteAppParams() {
  const file = resolve('src', 'lib', 'app-params.js');
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log('[OK] Deleted src/lib/app-params.js (dead code with Base44 refs)');
  } else {
    console.log('[SKIP] src/lib/app-params.js does not exist');
  }
}

// ─── H. Verify ──────────────────────────────────────────────────────────────
function verify() {
  const stubFile = resolve('src', 'api', 'base44Client.js');
  let warnings = 0;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
        walk(full);
      } else if (/\.(js|jsx|ts|tsx|json|css|html)$/.test(entry.name)) {
        // Skip the stub itself — it's allowed to mention base44
        if (full === stubFile) continue;
        const text = fs.readFileSync(full, 'utf8');
        const lines = text.split('\n');
        lines.forEach((line, i) => {
          if (/@base44/.test(line) || /base44\.auth/.test(line)) {
            console.log(`[WARN] Residual base44 reference: ${path.relative(WORK_DIR, full)}:${i + 1} — ${line.trim()}`);
            warnings++;
          }
        });
      }
    }
  }

  walk(WORK_DIR);
  if (warnings === 0) {
    console.log('[OK] Verify — no residual @base44 or base44.auth references found');
  } else {
    console.log(`[WARN] Verify — ${warnings} residual reference(s) found (see above)`);
  }
}

// ─── Run ────────────────────────────────────────────────────────────────────
try {
  console.log('=== strip_base44.js ===');
  stubBase44Client();
  replaceAuthContext();
  simplifyPageNotFound();
  cleanPackageJson();
  cleanViteConfig();
  fixIndexHtml();
  deleteAppParams();
  verify();
  console.log('=== strip_base44.js DONE ===');
} catch (err) {
  console.error(`[FAIL] strip_base44.js: ${err.message}`);
  process.exit(1);
}
