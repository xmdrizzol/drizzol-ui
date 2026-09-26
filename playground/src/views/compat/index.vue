<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">浏览器兼容</h1>
            <p class="component-page__desc">
                组件库的产物基线为 <strong>最低支持 Chrome 86</strong>：构建时已按该目标降级并逐次校验，
                你不需要为旧内核浏览器编写任何"两份样式"。本页说明各浏览器的支持版本、
                你的项目需要做的一次性配置，以及自己写样式时的兼容写法。
            </p>
        </header>

        <h2>支持范围</h2>
        <table>
            <thead>
                <tr><th>浏览器</th><th>完整支持</th><th>可用（细节退化）</th><th>说明</th></tr>
            </thead>
            <tbody>
                <tr><td>Chrome / Edge（Chromium 内核）</td><td><strong>≥ 86</strong></td><td>≥ 79</td><td>声明的构建基线；约束特性为 flex 间距（gap，86 ≥ 84）</td></tr>
                <tr><td>Firefox</td><td><strong>≥ 75</strong></td><td>≥ 63</td><td>约束特性为 <code>clamp() / max()</code>（75）；间距 gap 需 63</td></tr>
                <tr><td>Safari</td><td><strong>≥ 14.1</strong></td><td>≥ 13.1</td><td>约束特性为 flex 间距（gap，14.1）；<code>clamp()</code> 需 13.1</td></tr>
                <tr><td>iOS Safari</td><td><strong>≥ 14.5</strong></td><td>≥ 13.4</td><td>同 Safari</td></tr>
            </tbody>
        </table>
        <p>
            <strong>"完整支持"</strong>指渲染结果与新版本浏览器一致；<strong>"可用（细节退化）"</strong>指核心功能与交互正常，
            但 flex 布局的间距会塌陷（元素贴合）、个别字号与高度回退到默认值。
            所有主题能力依赖 CSS 变量（Chrome 49 / Firefox 31 / Safari 9.1 起支持），远低于上表版本，不构成额外限制。
        </p>
        <p>
            JS 侧依赖 Vue 3（需要 ES2015 环境）与 <code>IntersectionObserver</code>，上表版本均满足；
            库产物的 JS 语法下限由<strong>你的构建配置</strong>决定（打包时会重新转译），无需单独处理。
        </p>

        <h2>第一步：在你的构建里声明同一基线（必做）</h2>
        <p>
            库发版的产物是按 Chrome 86 降级过的，但<strong>打包你的项目时会把它当普通 CSS 再压缩一遍</strong>，
            用的是你项目的压缩目标。Vite 8 默认目标较高（chrome111），会把样式重新"现代化"
            （合并出旧内核不认识的 <code>inset</code>、改写媒体查询），静默抵消兼容性——
            所以必须声明一次：
        </p>
        <d-code-block language="ts" copyable :code="viteConfigDoc" />
        <p>
            注意是 <code>build.cssTarget</code>：<code>css.lightningcss.targets</code> 不作用于 CSS 压缩，设了不生效。
            使用其他构建工具时同理——把 CSS 压缩目标（lightningcss 的 targets、esbuild 的 target）
            或 browserslist 设为 <code>chrome &gt;= 86</code> 即可。
        </p>

        <h2>写样式时的兼容写法</h2>
        <p>
            库自身的样式遵循一套"只写新旧浏览器都认识的语法"的约定；你自己的业务样式建议照做，
            这样你的项目在旧内核下与本库表现一致。四条最常用：
        </p>
        <d-code-block language="scss" copyable :code="styleRulesDoc" />
        <p>对应地，这些高于基线的语法请避免（构建不会替你降级你自己写的这些部分）：</p>
        <table>
            <thead>
                <tr><th>不要写</th><th>替代写法</th></tr>
            </thead>
            <tbody>
                <tr><td><code>color-mix()</code></td><td>半透明罩层用 <code>rgba(var(--dz-xxx-rgb), 透明度)</code></td></tr>
                <tr><td><code>inset: 0</code></td><td><code>top / right / bottom / left</code> 四个长写属性</td></tr>
                <tr><td>range 语法媒体查询 <code>(width &lt;= 768px)</code></td><td>经典 <code>(max-width: 768px)</code></td></tr>
                <tr><td><code>:is() / :where() / :has()</code></td><td>展开选择器；父级状态用 Vue 响应式 class 绑定</td></tr>
                <tr><td><code>dvh / svh / lvh</code>、独立 <code>translate / rotate / scale</code> 属性</td><td><code>vh / vw</code>、<code>transform</code></td></tr>
                <tr><td>裸写 <code>aspect-ratio</code></td><td>加 padding 兜底，见下节</td></tr>
            </tbody>
        </table>
        <p>
            容差说明：<code>text-underline-offset</code> 这类"旧内核丢弃后只少一层装饰"的属性可以放心用，
            不会引起布局问题。
        </p>

        <h2>自己的宽高比：aspect-ratio 的兜底</h2>
        <p>
            <code>aspect-ratio</code> 需要 Chrome 88+，直接裸写在更低版本会整条失效、盒子塌陷。
            库导出了纯函数 <code>ratioToPaddingTop</code>，一行接入经典的 padding 兜底
            （现代内核走 <code>aspect-ratio</code>，旧内核走占位，两者高度一致、互不冲突）：
        </p>
        <d-code-block language="vue" copyable :code="ratioDoc" />

        <h2>自定义颜色时：成对覆盖</h2>
        <p>
            覆盖主题色时，除了颜色本身，还要把对应的 RGB 三元组一并覆盖——
            浅色底、描边、悬浮罩层都消费三元组版本，只改颜色不改三元组，这些半透明部分会停在旧色：
        </p>
        <d-code-block language="css" copyable :code="colorOverrideDoc" />
        <p>
            可用的三元组：<code>--dz-primary-rgb</code>、<code>--dz-success-rgb</code>、<code>--dz-warning-rgb</code>、
            <code>--dz-danger-rgb</code>、<code>--dz-gray-7-rgb</code>、<code>--dz-gray-9-rgb</code>、<code>--dz-bg-rgb</code> 等，
            亮暗主题各有一份、切换主题时自动跟随。
        </p>

        <h2>自查：你的产物是否兼容</h2>
        <p>构建你的项目后，对产物 CSS 跑三条检查。出现任何输出，说明压缩目标没设对（回到第一步）：</p>
        <d-code-block language="bash" copyable :code="selfCheckDoc" />
        <p>
            常见问题：<strong>升级库之后弹窗还是错位 / 卡片还是透明？</strong>
            九成是忘了第一步的 <code>cssTarget</code>，或构建缓存未清理；补上配置并重新构建即可。
            <strong>覆盖了主题色但浅色底没变？</strong>补上成对的 <code>-rgb</code> 三元组。
        </p>

        <h2>已知限制</h2>
        <p>
            <code>DVideo</code> 内部的播放器（ArtPlayer）自带一份运行时注入的样式，其中包含旧内核不支持的
            <code>inset</code> 声明（第三方代码，不经过本库构建）。视频容器的比例已由本库兜底，
            但播放器内部个别浮层（如网页全屏）在非常旧的内核下可能偏位；如有硬性要求，
            可用 patch-package 修正该依赖的样式。
        </p>
    </div>
</template>

<script setup lang="ts">
const viteConfigDoc = `// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // 与组件库保持一致：让 CSS 压缩目标停留在 Chrome 86
    cssTarget: 'chrome86',
  },
})`

const styleRulesDoc = `// 1. 引颜色：一律用变量，深浅主题自动跟随
color: var(--dz-text);
background: var(--dz-bg-secondary);
border: 1px solid var(--dz-border);

// 2. 半透明罩层（标签浅底、遮罩、微光这类本该透出内容的装饰）
background: rgba(var(--dz-primary-rgb), 0.12);

// 3. 不透明的卡片底（消息、通知这类浮在内容之上的面板）：
//    不要写 background: rgba(...)，会透出下层内容；
//    库导出了可 @use 的 mixin，用"不透明底色 + 罩层"合成
@use '@xmdrizzol/drizzol-ui/styles/_mixin.scss' as *;
.card {
    @include tint-on-bg(--dz-success-rgb, 0.1, 0.4, var(--dz-shadow-md));
}

// 4. 铺满定位与响应式
.overlay {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;   // 不要写 inset: 0
}
@media screen and (max-width: 768px) {       // 不要写 (width <= 768px)
    …
}`

const ratioDoc = `<script setup lang="ts">
import { computed } from 'vue'
import { ratioToPaddingTop } from '@xmdrizzol/drizzol-ui'

// '16 / 9' → '56.25%'；解析失败返回 null，此时不下发兜底
const pad = computed(() => ratioToPaddingTop('16 / 9') ?? '0')
</` + `script>

<template>
    <div class="video">
        <i class="video__ratio" :style="{ paddingTop: pad }"></i>
        <video class="video__player" src="…" />
    </div>
</template>

<style scoped>
.video { position: relative; width: 100%; }
.video__ratio { display: block; height: 0; }
.video__player {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
}
</style>`

const colorOverrideDoc = `:root {
  --dz-primary: #7c3aed;            /* 实心按钮、链接、文字色跟随这个 */
  --dz-primary-rgb: 124, 58, 237;   /* 浅色底、描边、悬浮罩层跟随这个（必须成对） */
}`

const selfCheckDoc = `# 以下命令在你的项目根目录执行，出现任何输出都说明压缩目标没设对
grep -oE "(^|[;{])inset *:" dist/assets/*.css       # inset 简写
grep -oE "@media[^{]*\\(width *[<>]" dist/assets/*.css  # range 语法媒体查询
grep -c "color-mix(" dist/assets/*.css               # color-mix()（应输出 0）`
</script>
