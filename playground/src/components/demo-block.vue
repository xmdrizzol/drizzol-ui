<template>
    <section class="demo-block" :id="anchorId">
        <header class="demo-block__header">
            <h2 class="demo-block__title">{{ title }}</h2>
            <p v-if="desc" class="demo-block__desc">{{ desc }}</p>
        </header>

        <div class="demo-block__body">
            <slot />
        </div>

        <details v-if="code" class="demo-block__details">
            <summary>示例代码</summary>
            <pre class="demo-block__code"><code>{{ code }}</code></pre>
        </details>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    /** 组件标题，如 "DCard 卡片" */
    title: string
    /** 锚点 id（供侧边导航定位） */
    anchorId: string
    /** 一句话说明 */
    desc?: string
    /** 示例代码（可展开查看） */
    code?: string
}>()
</script>

<style scoped lang="scss">
.demo-block {
    margin-bottom: 40px;
    scroll-margin-top: 76px; // 锚点定位为粘性头部留出空间

    &__header {
        margin-bottom: 12px;
    }

    &__title {
        margin: 0 0 4px;
        font-size: 1.25rem;
        color: var(--dz-text-h);
        font-weight: 600;
    }

    &__desc {
        margin: 0;
        font-size: 0.875rem;
        color: var(--dz-text-l);
    }

    &__body {
        padding: 24px;
        border: 1px solid var(--dz-border);
        border-radius: 12px;
        background: var(--dz-bg-secondary);
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;

        // 列表式 demo（如表单）占满整行
        > .demo-block__stack {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    }

    &__details {
        margin-top: 10px;

        summary {
            cursor: pointer;
            font-size: 0.8125rem;
            color: var(--dz-text-d);
            user-select: none;
        }

        &[open] summary {
            margin-bottom: 8px;
        }
    }

    &__code {
        margin: 0;
        padding: 16px;
        border-radius: 8px;
        background: var(--dz-bg);
        border: 1px solid var(--dz-border);
        overflow-x: auto;
        font-family: var(--dz-ff-mono);
        font-size: 0.8125rem;
        line-height: 1.7;
        color: var(--dz-text);
    }
}
</style>
