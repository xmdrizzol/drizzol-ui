<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DPagination<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">分页：total + pageSize 自动算页数（或显式 pageCount）；页码窗口带省略号，v-model 当前页 + change 事件。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-pagination v-model="page" :total="236" :page-size="10" />'>
            <div class="component-page__stack">
                <d-pagination v-model="page" :total="236" :page-size="10" @change="onChange" />
                <p class="component-page__echo">当前第 {{ page }} 页</p>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const page = ref(1)

function onChange(p: number) {
    page.value = p
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
    }
}
</style>
