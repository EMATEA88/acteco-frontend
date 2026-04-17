import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // 🔥 obrigatório para Render

  plugins: [
    react()
  ],

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1600
  }
})