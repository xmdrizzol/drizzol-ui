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
        <div class="d-tabs__panel" role="tabpanel">
            <slot :name="modelValue" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DTabItem } from './index'

const props = withDefaults(defineProps<{
    /** 标签数据（内容通过 同名插槽 提供，如 #t1） */
    tabs: DTabItem[]
    /** 当前激活 key（v-model） */
    modelValue?: string
}>(), {
    modelValue: '',
})

const emit = defineEmits<{
    'update:modelValue': [key: string]
    'change': [key: string]
}>()

function select(tab: DTabItem) {
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
            font-weight: 500;

            &::after {
                content: '';
                position: absolute;
                left: 12px;
                right: 12px;
                bottom: -1px;
                height: 2px;
                border-radius: 99px;
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
