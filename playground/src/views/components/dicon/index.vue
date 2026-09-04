<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DIcon<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">图标组件：内联 SVG 雪碧图（52 个符号，id 前缀 dz-icon-）；在根组件渲染一次 &lt;d-icon-sprite /&gt; 后任意使用。</p>
        </header>

        <demo-block title="图标列表" anchor-id="demo"
            code='<d-icon-sprite />  <!-- App.vue 根节点一次 -->
<d-icon name="fd-sunny" size="1.5" />'>
            <div class="component-page__icons">
                <div v-for="name in iconNames" :key="name" class="component-page__icon">
                    <d-icon :name="name" size="1.5" />
                    <span>{{ name }}</span>
                </div>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'

const iconNames = [
    'user', 'heart', 'star', 'menu', 'close',
    'arrow-forward', 'arrow-dropup', 'fd-sunny', 'fd-moon',
    'fd-rocket', 'fd-book', 'fd-gamepad',
]
</script>

<style scoped lang="scss">
.component-page {
    &__icons {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
    }

    &__icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        width: 92px;
        padding: 12px 4px;
        border: 1px solid var(--dz-border);
        border-radius: 8px;
        background: var(--dz-bg);

        span {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.68rem;
            color: var(--dz-text-l);
        }
    }
}
</style>
