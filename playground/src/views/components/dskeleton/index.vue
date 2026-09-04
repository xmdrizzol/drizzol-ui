<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DSkeleton<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">骨架屏：loading 数据前的占位；rows/title/avatar 组合，active 控制流光动画。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-skeleton :rows="3" title />
<d-skeleton :rows="4" avatar />'>
            <div class="component-page__stack">
                <d-card style="width:100%">
                    <d-skeleton :rows="3" title />
                </d-card>
                <d-card style="width:100%">
                    <d-skeleton :rows="2" avatar />
                </d-card>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'
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
