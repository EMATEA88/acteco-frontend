import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      /* =========================
         REGISTRO DO SERVICE WORKER
      ========================= */
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      /* =========================
         PWA ATIVO EM DEV (IMPORTANTE)
      ========================= */
      devOptions: {
        enabled: true, // 🔴 sem isto, NÃO aparece botão instalar em npm run dev
      },

      /* =========================
         ASSETS ESTÁTICOS
      ========================= */
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-512-maskable.png',
      ],

      /* =========================
         MANIFEST
      ========================= */
      manifest: {
        name: 'ACTECO S.A',
        short_name: 'ACTECO',
        description:
          'Plataforma de investimento sustentável ACTECO S.A',

        start_url: '/',
        scope: '/',
        display: 'standalone',

        background_color: '#ffffff',
        theme_color: '#059669',

        orientation: 'portrait',

        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
