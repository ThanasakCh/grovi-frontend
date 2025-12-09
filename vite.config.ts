// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true,
    // ✅ ยอมทุกโดเมน/พอร์ต
    allowedHosts: true,
    // ✅ ให้ HMR ใช้งานหลัง tunnel
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    }
  },
  define: { global: 'globalThis' }
})
