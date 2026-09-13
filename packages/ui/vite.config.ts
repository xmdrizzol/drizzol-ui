import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssPxtorem from 'postcss-pxtorem'
import path from 'path'

// px → rem：源码里写 px（正常开发心智），构建时 1rem = 16px 自动换算。
// minPixelValue: 2 让 1px 细边框/阴影线保持 px，避免缩放后发虚。
const pxtorem = postcssPxtorem({ rootValue: 16, propList: ['*'], minPixelValue: 2 })

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@ui': path.resolve(import.meta.dirname, './src')
    }
  },
  css: {
    postcss: {
      plugins: [pxtorem]
    },
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
        'vue-router',
        'axios',
        'js-cookie',
        'cropperjs',
        'artplayer',
        'vue-photo-preview-next',
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
