<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DRow / DCol<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">24 分栏栅格：DRow 提供 gutter 列间距与对齐，DCol 支持 span/offset 与 xs/sm/md/lg/xl 响应式断点。</p>
        </header>

        <demo-block title="基础栅格（span 12 + gutter 16）" anchor-id="demo"
            code='<d-row :gutter="16">
  <d-col :span="12"><d-card>左 12</d-card></d-col>
  <d-col :span="12"><d-card>右 12</d-card></d-col>
</d-row>'>
            <div class="component-page__stack">
                <d-row :gutter="16">
                    <d-col v-for="i in 2" :key="i" :span="12">
                        <d-card>列 {{ i }} / span 12</d-card>
                    </d-col>
                </d-row>
                <d-row :gutter="16">
                    <d-col v-for="i in 4" :key="i" :span="6">
                        <d-card>列 {{ i }} / span 6</d-card>
                    </d-col>
                </d-row>
            </div>
        </demo-block>

        <demo-block title="offset 偏移" anchor-id="offset"
            code='<d-col :span="8" :offset="8"><d-card>偏移 8</d-card></d-col>'>
            <d-row :gutter="12">
                <d-col :span="8" :offset="8">
                    <d-card>span 8 + offset 8（居中观感）</d-card>
                </d-col>
            </d-row>
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
