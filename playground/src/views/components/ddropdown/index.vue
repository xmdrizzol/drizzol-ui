<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DDropdown<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">下拉菜单组件：click / hover 两种触发方式；菜单插槽自定义内容，CSS 过渡，点击外部自动关闭。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-dropdown trigger="click">
  <d-button>点击打开</d-button>
  <template #menu>...</template>
</d-dropdown>'>
            <div class="component-page__row">
                <d-dropdown trigger="click">
                    <d-button>点击打开</d-button>
                    <template #menu>
                        <div class="component-page__menu">纯文本项</div>
                        <div class="component-page__menu">也可以放任意内容</div>
                    </template>
                </d-dropdown>
                <d-dropdown trigger="hover">
                    <d-button>悬停打开</d-button>
                    <template #menu>
                        <div class="component-page__menu">悬停选项</div>
                    </template>
                </d-dropdown>
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
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__menu {
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
            background: var(--dz-bg-secondary);
            color: var(--dz-primary);
        }
    }
}
</style>
