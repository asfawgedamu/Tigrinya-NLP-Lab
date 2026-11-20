import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

// Browser-enforced allowlist: only this site's own scripts run, and the page may talk only to the
// services it needs (Firebase, GitHub API, the contact-form webhook, fonts and badges).
// Applied to production builds only, because the dev server needs inline scripts for hot reload.
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://apis.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://img.shields.io https://*.githubusercontent.com https://*.googleusercontent.com https://www.google.com/images/cleardot.gif",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://api.github.com https://script.google.com https://script.googleusercontent.com https://www.google.com/recaptcha/",
  "frame-src https://*.firebaseapp.com https://accounts.google.com https://www.google.com/recaptcha/ https://recaptcha.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

// SHA-256 of the deployed model file. The browser re-computes it after download and refuses a mismatching file.
const modelFile = path.join(__dirname, 'public', 'models', 'tdi_model.json');
const TDI_MODEL_SHA256 = fs.existsSync(modelFile) ? crypto.createHash('sha256').update(fs.readFileSync(modelFile)).digest('hex') : '';

export default defineConfig({
  define: { __TDI_MODEL_SHA256__: JSON.stringify(TDI_MODEL_SHA256) },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'security-headers',
      apply: 'build',
      transformIndexHtml: () => [
        { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
        { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
      ],
    },
    {
      // In dev, serve the static pages in /public (work.html, cv.html, ...) instead of the SPA shell.
      name: 'serve-public-html',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.endsWith('.html') && req.url !== '/' && req.url !== '/index.html') {
            const filePath = path.join(__dirname, 'public', req.url.split('?')[0]);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(fs.readFileSync(filePath));
              return;
            }
          }
          next();
        });
      },
    },
  ],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  server: { port: 3000, host: '0.0.0.0' },
});
