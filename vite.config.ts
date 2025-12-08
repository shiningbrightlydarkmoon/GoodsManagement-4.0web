import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 添加服务器代理配置
  server: {
    proxy: {
      '/api': {
        target: 'http://10.30.23.165:9750/mif/api', // 直接在target中包含基础路径
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 移除/api前缀
        secure: false, // 忽略证书错误
      }
    }
  }
})
