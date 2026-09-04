<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DLayout<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">布局系统：DLayout 容器 + DHeader / DAside / DMain / DFooter 组合出「头部 + 侧边 + 内容 + 底部」完整页面骨架。</p>
        </header>

        <demo-block title="头部 + 内容 + 底部（垂直）" anchor-id="demo"
            code='<d-layout>
  <d-header height="48">头部</d-header>
  <d-main>内容区</d-main>
  <d-footer height="48">底部</d-footer>
</d-layout>'>
            <div class="component-page__stack">
                <d-layout class="component-page__frame" style="height: 220px">
                    <d-header height="48">头部导航区（d-header）</d-header>
                    <d-main>内容区（d-main，占满剩余空间）</d-main>
                    <d-footer height="48">底部信息区（d-footer）</d-footer>
                </d-layout>
            </div>
        </demo-block>

        <demo-block title="侧边栏 + 内容（自动水平）" anchor-id="aside"
            code='<d-layout>
  <d-aside width="200">侧栏</d-aside>
  <d-main>内容区</d-main>
</d-layout>'>
            <div class="component-page__stack">
                <d-layout class="component-page__frame" style="height: 180px">
                    <d-aside width="200">侧边栏（d-aside，存在时 DLayout 自动水平排列）</d-aside>
                    <d-main>内容区（d-main）</d-main>
                </d-layout>
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

    &__frame {
        border: 1px solid var(--dz-border);
        border-radius: 8px;
        overflow: hidden;
    }
}
</style>
