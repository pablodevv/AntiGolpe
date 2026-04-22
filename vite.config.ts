import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePrerenderPlugin } from 'vite-prerender-plugin'

export default defineConfig({
  plugins: [
    react(),
    VitePrerenderPlugin({
      staticDir: 'dist',
      routes: [
        '/',
        '/check',
        '/about'
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
