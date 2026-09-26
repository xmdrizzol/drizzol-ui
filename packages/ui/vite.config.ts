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
    // 产物基线：最低支持 Chrome 86（约定见 README「浏览器兼容性」）。
    // Vite 8 默认 build.target = 'baseline-widely-available'（chrome111 / edge111 / firefox114 / safari16.4），
    // cssTarget 继承它，而 cssMinify 默认 lightningcss 会按目标"现代化"CSS：把 top/right/bottom/left
    // 合并成 inset、把经典媒体查询改写成 range 语法、保留 color-mix()——因此必须显式声明 cssTarget，
    // 压缩器才会按 Chrome 86 降级。（注意：css.lightningcss.targets 在这里无效，
    // Vite 的压缩路径会用 build.cssTarget 覆盖它；详见 CLAUDE.md 踩坑记录。）
    // 宿主项目自建构建同样要声明，否则会把这份产物重新压回现代语法。
    cssTarget: 'chrome86',
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
