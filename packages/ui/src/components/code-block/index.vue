<template>
    <div class="d-code-block">
        <div v-if="showHeader" class="d-code-block__header">
            <span class="d-code-block__lang">{{ language || 'code' }}</span>
            <button v-if="copyable" class="d-code-block__copy" @click="handleCopy">
                {{ copied ? '已复制' : '复制' }}
            </button>
        </div>
        <pre class="d-code-block__body"><code><slot>{{ code }}</slot></code></pre>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
    /** 代码内容（也支持默认插槽传入） */
    code?: string
    /** 语言标识（显示在头部，如 ts / vue / scss） */
    language?: string
    /** 显示头部 */
    showHeader?: boolean
    /** 显示复制按钮 */
    copyable?: boolean
}>(), {
    code: '',
    language: '',
    showHeader: true,
    copyable: true,
})

const copied = ref(false)

const source = computed(() => props.code)

async function handleCopy() {
    const text = source.value || ''
    try {
        await navigator.clipboard.writeText(text)
    } catch {
        // 剪贴板不可用（非安全上下文等）：静默，不打断演示
    }
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
}
</script>

<style scoped lang="scss">
.d-code-block {
    margin: 0 0 1em;
    border: 1px solid var(--dz-border);
    border-radius: 8px;
    overflow: hidden;
    background: var(--dz-code-block-bg);

    &__header {
        @include flex(space-between, center);
        padding: 8px 14px;
        // 最低支持 Chrome 86 无 color-mix()，罩层用 rgba(var(--dz-code-block-text-rgb), <alpha>) 等价表达
        background: rgba(var(--dz-code-block-text-rgb), 0.06);
        border-bottom: 1px solid rgba(var(--dz-code-block-text-rgb), 0.08);
    }

    &__lang {
        font-size: 0.75rem;
        font-family: var(--dz-ff-mono);
        color: var(--dz-code-block-text-d);
        letter-spacing: 0.5px;
    }

    &__copy {
        padding: 2px 10px;
        border: 1px solid rgba(var(--dz-code-block-text-rgb), 0.16);
        border-radius: 4px;
        background: transparent;
        color: var(--dz-code-block-text);
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
            background: rgba(var(--dz-code-block-text-rgb), 0.1);
            color: var(--dz-on-fill);
        }
    }

    &__body {
        margin: 0;
        // 横向内边距交给内部 code：滚动容器（pre）自身的右内边距在滚到尽头时会被吃掉，
        // 内边距随 code（宽度跟随内容）一起滚动，长代码滚到底仍保留右侧留白
        padding: 0;
        overflow-x: auto;

        code {
            display: block;
            width: max-content;
            min-width: 100%;
            background: transparent;
            // 复位全局 pre > code 的边框/外边距，避免组件内部出现双重盒子
            margin: 0;
            border: none;
            padding: 16px;
            border-radius: 0;
            font-size: 0.8125rem;
            line-height: 1.7;
            color: var(--dz-code-block-text);
            white-space: pre;
            tab-size: 4;
        }
    }
}
</style>
