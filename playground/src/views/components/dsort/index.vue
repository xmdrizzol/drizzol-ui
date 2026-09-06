<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DSort<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">排序筛选组件：排序字段 + 日期范围 + 状态筛选（状态选项由宿主传入），v-model 绑定筛选参数。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-sort v-model="sort" :sort-options="opts" :status-options="status" show-admin />'>
            <div class="component-page__stack">
                <d-sort v-model="sortModel" :sort-options="sortOptions" :status-options="statusOptions" show-admin />
                <p class="component-page__echo">排序值：{{ JSON.stringify(sortModel) }}</p>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const sortModel = ref({ sortBy: 'createdAt', desc: true, dateStart: '', dateEnd: '', status: '' })
const sortOptions = [
    { field: 'createdAt', label: '创建时间' },
    { field: 'updatedAt', label: '更新时间' },
]
const statusOptions = [
    { value: '', label: '全部' },
    { value: 'published', label: '已发布' },
    { value: 'draft', label: '草稿' },
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
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
