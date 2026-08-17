import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'robots.txt',
      ],

      manifest: {
        name: 'EMATEA',
        short_name: 'EMATEA',
        description: 'Empresa de tecnologia e desenvolvimento EMATEA',
        theme_color: '#0B0E11',
        background_color: '#0B0E11',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'pt-PT',

        icons: [
          {
            src: '/assets/icons/icon-192.webp',
            sizes: '192x192',
            type: 'image/webp',
            purpose: 'any',
          },
          {
            src: '/assets/icons/icon-512.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any',
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallbackDenylist: [
          /^\/api\//,
        ],
      },
    }),
  ],

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
  },
})