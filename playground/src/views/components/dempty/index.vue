<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DEmpty<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">空状态：占位图标 + 描述 + 底部插槽（放置"去创建"等操作入口），icon 可换裸名。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-empty description="暂无数据" />
<d-empty icon="fd-cloud" description="什么都没有">
  <d-button type="primary">去创建</d-button>
</d-empty>'>
            <div class="component-page__row">
                <d-card style="width: 300px">
                    <d-empty description="暂无数据" />
                </d-card>
                <d-card style="width: 300px">
                    <d-empty icon="fd-cloud" description="什么都没有">
                        <d-button type="primary">去创建</d-button>
                    </d-empty>
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
    &__row {
        width: 100%;
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }
}
</style>
