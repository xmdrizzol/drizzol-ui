<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DSearch<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">搜索框组件：输入防抖 300ms 后触发 search 事件，回车立即触发，支持一键清空。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-search placeholder="搜索..." @search="onSearch" />'>
            <div class="component-page__stack">
                <d-search placeholder="搜索（防抖 300ms）" @search="onSearch" />
                <p class="component-page__echo">搜索词：{{ searchWord || '（空）' }}</p>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const searchWord = ref('')
function onSearch(keyword: string) {
    searchWord.value = keyword
}
</script>

<style scoped lang="scss">
.component-page {
    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
