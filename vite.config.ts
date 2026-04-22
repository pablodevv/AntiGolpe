import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteSSG } from 'vite-plugin-ssg'

export default defineConfig({
  plugins: [
    react(),
    ViteSSG({
      routes: [
        '/',
        '/about',
        '/contact',
        '/faq'
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
