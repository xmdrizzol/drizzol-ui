<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DFloatBar<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">浮动条组件：右下角浮动按钮；滚动超过 threshold 显示返回顶部，目录按钮通过 catalog 事件交给宿主。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-float-bar show-catalog catalog-tooltip="目录" @catalog="onCatalog" />'>
            <p class="component-page__echo">本组件已挂载在页面右下角，滚动本页可见「返回顶部」按钮。</p>
        </demo-block>

        <d-float-bar show-catalog catalog-tooltip="目录" @catalog="onCatalog" />
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import DemoBlock from '@/components/demo-block'

function onCatalog() {
    ElMessage.info('目录事件（示例）')
}
</script>

<style scoped lang="scss">
.component-page {
    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
