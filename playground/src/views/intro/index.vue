<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">介绍<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">
                Drizzol UI 是一套 Vue 3 组件库，统一维护组件、工具函数与样式/主题基准，
                可作为个人与小型项目的前端基建直接消费。本页说明技术栈、版本要求、内置第三方库与图标许可合规。
            </p>
        </header>
            <h2>安装与使用</h2>
            <d-code-block language="bash" copyable :code="installDoc" />
            <p>
                <code>vue</code> 为 peerDependency（宿主自行安装；<code>vue-router</code> 可选）；
                按需具名导入可配合 tree-shaking，全量安装 <code>app.use(DrizzolUI)</code> 会注册全部 <code>d-*</code> 组件。
            </p>
            <h2>技术栈</h2>
            <table>
                <thead>
                    <tr><th>层</th><th>选型</th><th>版本</th><th>说明</th></tr>
                </thead>
                <tbody>
                    <tr><td>框架</td><td>Vue</td><td>^3.5</td><td>Composition API + <code>&lt;script setup&gt;</code></td></tr>
                    <tr><td>语言</td><td>TypeScript</td><td>~6.0</td><td>全量类型，产出 <code>d.ts</code></td></tr>
                    <tr><td>构建</td><td>Vite</td><td>^8</td><td>es + cjs 双产物，运行时依赖 external</td></tr>
                    <tr><td>样式</td><td>Sass</td><td>^1.99</td><td><code>--dz-*</code> 变量 + 双色板，源文件随包输出</td></tr>
                    <tr><td>测试</td><td>Vitest + Vue Test Utils</td><td>^5 / ^2.5</td><td>单测 + 组件挂载冒烟，pre-commit 回归</td></tr>
                    <tr><td>发布</td><td>changesets + husky + commitlint</td><td>—</td><td>语义化版本、Conventional Commits 校验</td></tr>
                </tbody>
            </table>
            <h2>版本要求</h2>
            <ul>
                <li><strong>运行时</strong>：Vue <code>≥ 3.5</code>。提示/通知/确认/抽屉均为库内自研，<strong>不依赖任何第三方 UI 库</strong>。</li>
                <li><strong>可选</strong>：vue-router（<code>DMenu</code> 的链接能力，未装则回退纯点击项）。</li>
                <li><strong>构建工具链</strong>：Node <code>≥ 20.19</code>（Vite 8 要求），随仓库 devDependencies 安装。</li>
                <li><strong>浏览器</strong>：依赖 <code>color-mix()</code>、CSS 变量、IntersectionObserver——即现代常青浏览器（Chrome/Safari/Firefox/Edge 近两年版本）。</li>
            </ul>
            <h2>内置第三方库与许可证</h2>
            <p>
                以下为随包依赖（安装后各自带 LICENSE）；许可证据其 npm 包 <code>license</code> 字段核对：
            </p>
            <table>
                <thead>
                    <tr><th>依赖</th><th>用途</th><th>许可证</th><th>注意</th></tr>
                </thead>
                <tbody>
                    <tr><td>axios</td><td>request 网络层</td><td>MIT</td><td>—</td></tr>
                    <tr><td>js-cookie</td><td>cookie 工具</td><td>MIT</td><td>—</td></tr>
                    <tr><td>cropperjs + <code>@cropper/element-*</code></td><td>DCropper 裁剪</td><td>MIT</td><td>—</td></tr>
                    <tr><td>artplayer</td><td>DVideo 播放器</td><td>MIT</td><td>—</td></tr>
                </tbody>
            </table>
            <h2>内置图标与许可</h2>
            <p>
                内置雪碧图共 {{ iconCount }} 个 symbol，<strong>全部来自
                <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a></strong>（24×24 描边、<code>stroke=currentColor</code> 随主题色），
                许可为 <strong>ISC</strong>（等价宽松许可，<code>lucide.dev</code> 图标本体 ISC、文档 CC-BY-4.0），可安全内联并随本库 MIT 再分发。
            </p>
            <ul>
                <li>组件侧以 <code>dz-icon-*</code> 命名引用；Lucide 名称 → <code>dz-icon</code> 的对应关系维护在 <code>icon/symbols.vue</code>。</li>
                <li>描边为默认；另有 4 个 <code>*-fill</code> 填充变体（如 <code>heart-fill</code> / <code>circle-close-fill</code>），用 <code>fill=currentColor</code> 实现，与描边版一样自动跟随主题色，无需为深浅主题各备一套色值。</li>
                <li>内置图标<strong>不含第三方品牌 logo</strong>（github、discord、qq、bilibili 等均受商标保护）；如需指向对应平台，请自行引入资源。</li>
                <li><strong>新增图标</strong>：一律走 <a href="https://icon-sets.iconify.design/lucide/" target="_blank" rel="noopener">Iconify 的 Lucide 集</a> 拉取 SVG 后并入 <code>symbols.vue</code>，<strong>不要</strong>从 iconfont 等用户贡献平台下载内联（无法确认再分发授权）。</li>
            </ul>
            <h2>许可</h2>
            <p>
                本库源码采用 <strong>MIT</strong> 许可（见仓库 <code>LICENSE</code>）。MIT 仅覆盖本仓库自有代码，
                <strong>不改变</strong>上述内置第三方依赖与图标各自的许可条款；消费者需同时遵守它们。
            </p>
    </div>
</template>

<script setup lang="ts">
const installDoc = `npm i @xmdrizzol/drizzol-ui vue

// main.ts
import { createApp } from 'vue'
import DrizzolUi from '@xmdrizzol/drizzol-ui'
import '@xmdrizzol/drizzol-ui/style.css'

const app = createApp(App)
app.use(DrizzolUi)   // 全量注册 d-* 组件
app.mount('#app')

// App.vue：根节点渲染一次图标雪碧图
// <d-icon-sprite />`

// 与内置雪碧图的 symbol 数保持一致（DIconSprite，图标源 Lucide）
const iconCount = 53
</script>
