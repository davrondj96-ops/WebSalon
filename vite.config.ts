import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';

// Соцсети и мессенджеры берут превью только по полному адресу картинки.
// Если задан VITE_SITE_URL, относительные /og.png и og:url становятся абсолютными.
function absoluteOgUrls(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/+$/, '');
  return {
    name: 'absolute-og-urls',
    transformIndexHtml(html) {
      if (!base) return html;
      return html
        .replaceAll('content="/og.png"', `content="${base}/og.png"`)
        .replace('<meta property="og:type"', `<meta property="og:url" content="${base}/" />\n    <meta property="og:type"`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), tailwindcss(), absoluteOgUrls(env.VITE_SITE_URL || '')],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
