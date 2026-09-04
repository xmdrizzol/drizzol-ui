<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DTabs<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">标签页：v-model 激活 key，内容按 key 通过同名插槽渲染；支持禁用。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-tabs v-model="key" :tabs="tabs">
  <template #t1>概览内容</template>
  <template #t2>设置内容</template>
</d-tabs>'>
            <div class="component-page__stack">
                <d-tabs v-model="activeKey" :tabs="tabs">
                    <template #t1>
                        <p class="component-page__echo">选项卡一：总览页内容。</p>
                    </template>
                    <template #t2>
                        <p class="component-page__echo">选项卡二：设置页内容。</p>
                    </template>
                    <template #t3>
                        <p class="component-page__echo">禁用标签页不会出现在内容区。</p>
                    </template>
                </d-tabs>
                <p class="component-page__echo">当前：{{ activeKey }}</p>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const activeKey = ref('t1')
const tabs = [
    { key: 't1', label: '概览' },
    { key: 't2', label: '设置' },
    { key: 't3', label: '禁用', disabled: true },
]
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
        margin: 4px 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
    }
}
</style>
