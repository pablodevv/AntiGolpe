import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import prerender from 'vite-plugin-prerender';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: [
        '/',
        '/blog',
        '/blog/is-temu-a-scam-shocking-truth-2026',
        '/blog/how-to-detect-fake-websites-instantly',
        '/blog/10-most-dangerous-websites-right-now-2026',
        '/is-site-safe/amazon',
        '/is-site-safe/instagram',
        '/is-site-safe/shopee',
        '/is-site-safe/aliexpress',
        '/is-site-safe/temu'
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
