import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { cmsApiPlugin } from './server/api.js'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), cmsApiPlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api/cninfo': {
        target: 'http://www.cninfo.com.cn',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/cninfo/, '/new'),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
