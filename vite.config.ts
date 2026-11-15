import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
