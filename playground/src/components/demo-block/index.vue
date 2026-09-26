<template>
    <section class="demo-block" :id="anchorId">
        <header class="demo-block__header">
            <h2 class="demo-block__title">{{ title }}</h2>
            <!-- #desc 插槽：说明里需要放链接等富文本时用（覆盖 desc prop） -->
            <slot name="desc">
                <p v-if="desc" class="demo-block__desc">{{ desc }}</p>
            </slot>
        </header>

        <div class="demo-block__body" :class="{ 'demo-block__body--bare': bare }">
            <slot />
        </div>

        <details v-if="code" class="demo-block__details">
            <summary>示例代码</summary>
            <d-code-block class="demo-block__code" :code="code" :language="resolvedLanguage" />
        </details>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    /** 组件标题，如 "DCard 卡片" */
    title: string
    /** 锚点 id（供侧边导航定位） */
    anchorId: string
    /** 一句话说明 */
    desc?: string
    /** 示例代码（可展开查看，经 DCodeBlock 渲染：Shiki 高亮 + 复制按钮） */
    code?: string
    /** 语言标识；省略时按内容启发式判断（`<` 开头视为 vue，其余 ts） */
    language?: string
    /** 去掉演示区外框：用于内容自带完整外观的区块（如 DCodeBlock 深色卡），避免盒套盒 */
    bare?: boolean
}>(), {
    desc: '',
    code: '',
    language: '',
    bare: false,
})

/** 示例代码语言：模板片段按 vue、脚本片段按 ts 交给 Shiki（可显式覆盖） */
const resolvedLanguage = computed(() => {
    if (props.language) return props.language
    return /^\s*</.test(props.code) ? 'vue' : 'ts'
})
</script>

<style scoped lang="scss">
.demo-block {
    margin-bottom: 40px;
    scroll-margin-top: 76px; // 锚点定位为粘性头部留出空间

    // 说明段落：行高与正文排版（介绍页）一致，支持多段换行
    // （插槽版作用域在父页面，需 v-slotted 才能吃到本组件的排版）
    &__desc,
    :slotted(.demo-block__desc) {
        margin: 0;
        font-size: 0.875rem;
        line-height: var(--dz-line-height);
    }

    :slotted(.demo-block__desc + .demo-block__desc) {
        margin-top: 4px;
    }

    &__title {
        margin: 0 0 4px;
        font-size: 1.25rem;
        color: var(--dz-text-h);
        font-weight: 600;
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

    // 无外框模式：内容自带完整外观（DCodeBlock 深色卡等）时不再套一层盒子
    &__body--bare {
        padding: 0;
        border: none;
        background: transparent;
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
        // 落在 DCodeBlock 根元素上：只覆盖它自带的下外边距，其余样式（深色卡、头部、复制）随组件
        margin: 0;
    }
}
</style>
