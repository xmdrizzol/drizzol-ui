<template>
    <nav class="d-pagination">
        <button
            class="d-pagination__item d-pagination__arrow"
            :disabled="modelValue <= 1"
            title="上一页"
            @click="go(modelValue - 1)"
        >
            <d-icon name="arrow-back" size="1" />
        </button>

        <template v-for="(p, i) in pages" :key="`${p}-${i}`">
            <button v-if="p === '...'" class="d-pagination__item d-pagination__ellipsis" disabled>…</button>
            <button
                v-else
                class="d-pagination__item"
                :class="{ 'is-active': p === modelValue }"
                @click="go(p)"
            >
                {{ p }}
            </button>
        </template>

        <button
            class="d-pagination__item d-pagination__arrow"
            :disabled="modelValue >= pageCount"
            title="下一页"
            @click="go(modelValue + 1)"
        >
            <d-icon name="arrow-forward" size="1" />
        </button>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DIcon from '@ui/components/icon'

const props = withDefaults(defineProps<{
    /** 当前页码（v-model） */
    modelValue?: number
    /** 每页条数 */
    pageSize?: number
    /** 总条数（与 pageCount 二选一） */
    total?: number
    /** 总页数（显式传入时优先） */
    pageCount?: number
    /** 当前页两侧显示的页码数 */
    siblingCount?: number
}>(), {
    modelValue: 1,
    pageSize: 10,
    total: 0,
    pageCount: 0,
    siblingCount: 1,
})

const emit = defineEmits<{
    'update:modelValue': [page: number]
    'change': [page: number, pageSize: number]
}>()

const pageCount = computed(() => {
    if (props.pageCount) return props.pageCount
    return Math.max(1, Math.ceil(props.total / props.pageSize))
})

/** 页码窗口：1 … (cur±sibling) … N */
const pages = computed<(number | '...')[]>(() => {
    const total = pageCount.value
    const sibling = props.siblingCount
    if (total <= 3 + sibling * 2) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const cur = props.modelValue
    const start = Math.max(2, cur - sibling)
    const end = Math.min(total - 1, cur + sibling)

    const result: (number | '...')[] = [1]
    if (start > 2) result.push('...')
    for (let p = start; p <= end; p++) result.push(p)
    if (end < total - 1) result.push('...')
    result.push(total)
    return result
})

function go(page: number) {
    if (page < 1 || page > pageCount.value || page === props.modelValue) return
    emit('update:modelValue', page)
    emit('change', page, props.pageSize)
}
</script>

<style scoped lang="scss">
.d-pagination {
    @include flex(flex-start, center);
    gap: 6px;
    flex-wrap: wrap;

    &__item {
        @include flex(center, center);
        min-width: 32px;
        height: 32px;
        padding: 0 8px;
        border: 1px solid var(--dz-border);
        border-radius: 6px;
        background: var(--dz-bg);
        color: var(--dz-text-d);
        font-size: 0.8125rem;
        font-family: var(--dz-ff-mono);
        cursor: pointer;
        box-sizing: border-box;
        transition: all 0.15s;

        &:hover:not(.is-active):not(:disabled) {
            border-color: var(--dz-primary);
            color: var(--dz-primary);
        }

        &.is-active {
            background: var(--dz-primary);
            border-color: var(--dz-primary);
            color: #fff;
            font-weight: 600;
        }

        &:disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }
    }

    &__arrow {
        svg {
            color: inherit;
        }
    }

    &__ellipsis {
        border: none;
        background: transparent;
        cursor: default;
        opacity: 0.6;
    }
}
</style>
