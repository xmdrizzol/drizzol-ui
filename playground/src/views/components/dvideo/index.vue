<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DVideo<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">视频播放器组件（ArtPlayer 封装）：容器即尺寸盒（aspect-ratio），切换 src 复用实例；ready/play/pause/ended 事件透传。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-video src="..." @ready="onReady" />'>
            <div class="component-page__video">
                <d-video src="https://www.w3schools.com/html/mov_bbb.mp4" @ready="onVideoReady" />
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import DemoBlock from '@/components/demo-block'

function onVideoReady() {
    ElMessage.success('播放器就绪')
}
</script>

<style scoped lang="scss">
.component-page {
    &__video {
        width: 100%;
        max-width: 640px;
        background: var(--dz-bg);
        border-radius: 8px;
    }
}
</style>
