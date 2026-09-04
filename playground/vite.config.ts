import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 演示站直接消费库源码（改动即时生效，同 vite dev 无构建差异）
      '@': path.resolve(import.meta.dirname, '../packages/ui/src'),
      '@drizzol/ui': path.resolve(import.meta.dirname, '../packages/ui/src/index.ts')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/_mixin.scss" as *;\n@use "@/styles/_animations.scss" as *;`
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5177
  }
})
