<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DPageCover<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">封面组件：带滚动视差；height / overlayOpacity 可配置。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-page-cover :src="cover" height="200px" :overlay-opacity="0" />'>
            <div class="component-page__stack">
                <d-page-cover :src="coverSvg" height="200px" :overlay-opacity="0" />
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'

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
