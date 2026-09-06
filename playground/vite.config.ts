import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 演示站自身的 @ 指向本工程 src（与 drizzol-nook 惯例一致）
      '@': path.resolve(import.meta.dirname, './src'),
      // 库源码与样式的源码别名（dev 直接消费源码）
      '@xmdrizzol/drizzol-ui': path.resolve(import.meta.dirname, '../packages/ui/src/index.ts'),
      '@ui': path.resolve(import.meta.dirname, '../packages/ui/src'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 与库构建一致的全局注入：mixin/animations（来自库 styles）
        additionalData: `@use "@ui/styles/_mixin.scss" as *;\n@use "@ui/styles/_animations.scss" as *;`
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5177
  }
})
