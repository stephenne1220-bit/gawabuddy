import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'gawa-icon.jpg'],
      manifest: {
        id: '/',
        name: 'GawaBuddy',
        short_name: 'GawaBuddy',
        description: 'Personal budgeting and money tracking.',
        lang: 'en-KE',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#0B3D2E',
        background_color: '#0B3D2E',
        icons: [
          { 
            src: 'gawa-icon.jpg', 
            sizes: '192x192', 
            type: 'image/jpeg' 
          },
          { 
            src: 'gawa-icon.jpg', 
            sizes: '512x512', 
            type: 'image/jpeg' 
          },
          { 
            src: 'gawa-icon.jpg', 
            sizes: '512x512', 
            type: 'image/jpeg', 
            purpose: 'maskable' 
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})