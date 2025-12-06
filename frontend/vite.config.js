import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'City Companion',
        short_name: 'TravelAI',
        description: 'Your AI Travel Guide',
        theme_color: '#ffffff',
        display: 'standalone', // Makes it look like a real app (no URL bar)
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // need to add these icons to /public later
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})