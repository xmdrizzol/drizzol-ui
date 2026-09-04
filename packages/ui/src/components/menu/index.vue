<template>
    <nav class="d-menu">
        <template v-for="group in renderGroups" :key="group.label || 'group'">
            <p v-if="group.label" class="d-menu__group-title">{{ group.label }}</p>
            <component
                :is="resolveTag(item)"
                v-for="item in group.items"
                :key="item.key"
                :to="item.to && router ? item.to : undefined"
                class="d-menu__item"
                :class="{ 'is-active': item.key === modelValue, 'is-disabled': item.disabled }"
                @click="handleSelect(item)"
            >
                <d-icon v-if="item.icon" :name="item.icon" size="1" class="d-menu__icon" />
                <span class="d-menu__label">{{ item.label }}</span>
            </component>
        </template>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, type Router } from 'vue-router'
import DIcon from '@ui/components/icon'
import type { DMenuGroup, DMenuItem } from './index'

/**
 * 导航菜单：分组标题 + 条目（图标/路由/禁用），激活项高亮
 * - 平铺传 items；分组传 groups（优先）
 * - item.to 存在且宿主安装了 vue-router 时渲染 router-link，否则为纯点击项
 */
const props = withDefaults(defineProps<{
    /** 平铺条目 */
    items: DMenuItem[]
    /** 分组（存在时优先渲染分组） */
    groups?: DMenuGroup[]
    /** 选中项 key（v-model） */
    modelValue?: string
}>(), {
    groups: undefined,
    modelValue: '',
})

const emit = defineEmits<{
    'update:modelValue': [key: string]
    'select': [item: DMenuItem]
}>()

// 宿主未安装 vue-router 时 useRouter 抛错：可选能力，回退为纯点击菜单
let router: Router | undefined
try {
    router = useRouter()
} catch {
    router = undefined
}

const renderGroups = computed<{ label: string; items: DMenuItem[] }[]>(() => {
    if (props.groups?.length) {
        return props.groups.map(g => ({ label: g.label, items: g.items }))
    }
    return [{ label: '', items: props.items }]
})

/** 条目标签：带链接且可用 router 时渲染 router-link，否则纯按钮 */
function resolveTag(item: DMenuItem) {
    return item.to && router ? 'router-link' : 'button'
}

function handleSelect(item: DMenuItem) {
    if (item.disabled) return
    emit('update:modelValue', item.key)
    emit('select', item)
}
</script>

<style scoped lang="scss">
.d-menu {
    display: flex;
    flex-direction: column;

    &__group-title {
        margin: 0 10px 6px;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 1px;
        color: var(--dz-text-l);

        &:not(:first-child) {
            margin-top: 16px;
        }
    }

    &__item {
        @include flex(flex-start, center);
        gap: 8px;
        width: 100%;
        padding: 6px 10px;
        margin-bottom: 2px;
        border: none;
        border-radius: 6px;
        background: transparent;
        text-align: left;
        text-decoration: none;
        font-size: 0.8125rem;
        line-height: 1.4;
        color: var(--dz-text-d);
        cursor: pointer;
        box-sizing: border-box;
        transition: background 0.15s, color 0.15s;

        &:hover {
            color: var(--dz-primary);
            background: var(--dz-bg);
        }

        &.is-active {
            background: var(--dz-primary-hover-2);
            color: var(--dz-primary);
            font-weight: 500;
        }

        &.is-disabled {
            opacity: 0.5;
            cursor: not-allowed;

            &:hover {
                color: var(--dz-text-d);
                background: transparent;
            }
        }
    }

    &__icon {
        color: inherit;
        flex-shrink: 0;
    }

    &__label {
        color: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
