import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@ui': path.resolve(import.meta.dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/_mixin.scss" as *;\n@use "@/styles/_animations.scss" as *;`
      }
    }
  },
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      name: 'DrizzolUI',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'drizzol-ui.js' : 'drizzol-ui.cjs',
      cssFileName: 'style'
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        'vue-router',
        'axios',
        'js-cookie',
        'gsap',
        'cropperjs',
        'artplayer',
        '@cropper/element-canvas',
        '@cropper/element-image'
      ],
      output: {
        exports: 'named'
      }
    },
    sourcemap: true
  }
})
