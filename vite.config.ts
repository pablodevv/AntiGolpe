import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from 'vite-prerender-plugin'


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
