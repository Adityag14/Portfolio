import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'node:url'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ['**/public/Certificates/**', '**/public/uploads/**'],
    },
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  resolve: {
    alias:{
      '@': path.resolve(currentDirectory, './src'),
    },
  },
})
