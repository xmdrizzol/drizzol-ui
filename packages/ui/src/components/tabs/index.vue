<template>
    <div class="d-tabs">
        <div class="d-tabs__bar" role="tablist">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                role="tab"
                class="d-tabs__tab"
                :class="{ 'is-active': tab.key === modelValue, 'is-disabled': tab.disabled }"
                :disabled="tab.disabled"
                @click="select(tab)"
            >
                <slot :name="`tab-${tab.key}`">{{ tab.label }}</slot>
            </button>
        </div>
        <!-- 无面板模式（panel=false）只渲染标签行：切换后由宿主自行拉取数据渲染 -->
        <div v-if="panel" class="d-tabs__panel" role="tabpanel">
            <slot :name="modelValue" />
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends string">
import type { DTabItem } from './index'

const props = withDefaults(defineProps<{
    /** 标签数据（内容通过 同名插槽 提供，如 #t1） */
    tabs: DTabItem<T>[]
    /** 当前激活 key（v-model）；未传入时无激活项 */
    modelValue?: T
    /** 是否渲染内容面板；false 时仅渲染标签行（排序/筛选页签场景，切换由宿主自行渲染） */
    panel?: boolean
}>(), {
    panel: true,
})

const emit = defineEmits<{
    'update:modelValue': [key: T]
    'change': [key: T]
}>()

function select(tab: DTabItem<T>) {
    if (tab.disabled || tab.key === props.modelValue) return
    emit('update:modelValue', tab.key)
    emit('change', tab.key)
}
</script>

<style scoped lang="scss">
.d-tabs {
    &__bar {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid var(--dz-border);
        overflow-x: auto;
    }

    &__tab {
        position: relative;
        padding: 9px 16px;
        border: none;
        background: transparent;
        color: var(--dz-text-d);
        font-size: 0.875rem;
        cursor: pointer;
        white-space: nowrap;
        transition: color 0.15s;

        &:hover:not(.is-disabled) {
            color: var(--dz-primary);
        }

        &.is-active {
            color: var(--dz-primary);
            font-size: 0.9375rem;
            font-weight: 600;

            &::after {
                content: '';
                position: absolute;
                left: 50%;
                width: 24px;
                transform: translateX(-50%);
                // 贴着 bar 边框线上方，不要 -1px 叠进边框：bar 是 overflow-x 滚动容器
                // （另一轴随之变 auto），任何 1px 纵向溢出都会带出纵向滚动条
                bottom: 0;
                height: 2px;
                border-radius: 2px;
                background: var(--dz-primary);
            }
        }

        &.is-disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }
    }

    &__panel {
        padding-top: 16px;
    }
}
</style>
