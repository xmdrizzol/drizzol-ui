<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DPageHero<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">页面横幅组件：title / en / subtitle / cover / height 全参数化；封面缺省时渲染深色渐变遮罩。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-page-hero title="Drizzol UI" en="Enjoy the harmony of design" :cover="cover" />'>
            <div class="component-page__stack">
                <d-page-hero title="Drizzol UI" en="Enjoy the harmony of design" subtitle="沉浸式页面横幅，封面/高度/负边距均可配置"
                    :cover="coverSvg" />
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'

// 内联渐变封面（避免演示站依赖外部图床）
const coverSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="400">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>' +
    '<rect fill="url(#g)" width="1600" height="400"/></svg>'
)
</script>

<style scoped lang="scss">
.component-page {
    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
}
</style>
