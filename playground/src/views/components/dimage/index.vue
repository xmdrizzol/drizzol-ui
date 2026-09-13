<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DImage<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">
                图片：fileRef/URL 统一解析、加载失败兜底、点击预览大图（vue-photo-preview-next）；
                DImageGroup 分组后预览可左右切换。
            </p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-image src="image/e6fe8463.png" alt="风景" :width="240" :height="160" radius="8" />
<d-image src="https://picsum.photos/seed/dz1/400/240" fit="contain" :width="240" :height="160" />'>
            <div class="component-page__row">
                <d-image :src="demoImages[0]" alt="封面（cover）" :width="240" :height="160" radius="8" />
                <d-image :src="demoImages[1]" alt="contain 留白" fit="contain" :width="240" :height="160" radius="8"
                    class="demo-fit-contain" />
            </div>
        </demo-block>

        <demo-block title="点击预览" anchor-id="preview"
            code='<!-- 默认开启预览（cursor: zoom-in），单图点击放大，可缩放/旋转/下载 -->
<d-image :src="url" alt="点击查看大图" :width="240" :height="160" />

<!-- 分组预览：组内图片左右切换（mask-closable / loop 等参数透传给预览器） -->
<d-image-group :loop="false">
  <d-image v-for="img in list" :key="img" :src="img" :width="160" :height="110" />
</d-image-group>

<!-- 关闭预览：纯展示 -->
<d-image :src="url" :preview="false" :width="240" :height="160" />'>
            <div class="component-page__row">
                <d-image-group>
                    <d-image v-for="img in demoImages" :key="img" :src="img" alt="分组图片" :width="180" :height="120"
                        radius="8" />
                </d-image-group>
            </div>
            <div class="component-page__row" style="margin-top: 16px">
                <d-image :src="demoImages[2]" alt="关闭预览的图片" :preview="false" :width="240" :height="140" radius="8" />
            </div>
        </demo-block>

        <demo-block title="加载失败兜底" anchor-id="fallback"
            code='<d-image src="not-exists.png" fallback-text="图片走丢了" :width="240" :height="160" />

<!-- 自定义兜底内容 -->
<d-image src="not-exists.png" :width="240" :height="160">
  <template #fallback>
    <d-button size="small">重新上传</d-button>
  </template>
</d-image>'>
            <div class="component-page__row">
                <d-image src="not-exists.png" fallback-text="图片走丢了" :width="240" :height="160" radius="8" />
                <d-image src="not-exists.png" :width="240" :height="160" radius="8">
                    <template #fallback>
                        <d-button size="small">重新上传</d-button>
                    </template>
                </d-image>
            </div>
        </demo-block>

        <demo-block title="懒加载" anchor-id="lazy"
            code='<!-- 原生 loading="lazy"：滚动到视口附近才请求 -->
<d-image v-for="img in list" :key="img" :src="img" lazy :width="180" :height="120" />'>
            <div class="component-page__row">
                <d-image v-for="img in demoImages" :key="img" :src="img" lazy :width="180" :height="120" radius="8" />
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'

// 内联 SVG 演示图：离线可用、fileRef 之外的 data: URL 场景（getFileAccessUrl 原样放行）
function svgImage(from: string, to: string, label: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient></defs>
  <rect width="480" height="320" fill="url(#g)"/>
  <text x="50%" y="50%" fill="rgba(255,255,255,.85)" font-size="42" font-family="sans-serif"
    text-anchor="middle" dominant-baseline="central">${label}</text>
</svg>`
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const demoImages = [
    svgImage('#4f7cf6', '#22c1dc', 'Drizzol 01'),
    svgImage('#8e5cf6', '#f65c8e', 'Drizzol 02'),
    svgImage('#f6a54f', '#f65c5c', 'Drizzol 03'),
    svgImage('#2fb56b', '#a8d84f', 'Drizzol 04'),
]
</script>

<style scoped lang="scss">
.component-page {
    &__row {
        width: 100%;
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }
}

// contain 模式的留白区域可见（与浅色页面底区分）
.demo-fit-contain {
    background: var(--dz-code-block-bg);
}
</style>
