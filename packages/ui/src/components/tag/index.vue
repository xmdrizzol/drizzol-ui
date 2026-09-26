<template>
    <span class="d-tag" :class="[`d-tag--${type}`, { 'is-round': round, 'is-closable': closable, 'is-small': size === 'small' }]">
        <slot />
        <button v-if="closable" class="d-tag__close" :title="'关闭'" @click.stop="emit('close')">×</button>
    </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    /** 语义类型 */
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    /** 尺寸 */
    size?: 'default' | 'small'
    /** 圆角胶囊 */
    round?: boolean
    /** 可关闭（展示 ×，点击 emit close） */
    closable?: boolean
}>(), {
    type: 'default',
    size: 'default',
    round: false,
    closable: false,
})

const emit = defineEmits<{
    close: []
}>()
</script>

<style scoped lang="scss">
.d-tag {
    @include flex(flex-start, center);
    gap: 4px;
    display: inline-flex;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    line-height: 1.6;
    border: 1px solid transparent;
    vertical-align: middle;
    white-space: nowrap;
    max-width: 100%;
    box-sizing: border-box;

    // 变体色三元组：浅底/描边/hover 罩层统一写 rgba(var(--dz-tag-rgb), <alpha>)。
    // 最低支持 Chrome 86 无 color-mix()，三元组 + rgba 与 color-mix(X p%, transparent) 数值等价。
    --dz-tag-rgb: var(--dz-gray-7-rgb); // 默认/信息：弱化灰（= --dz-text-d）
    --dz-tag-close-rgb: var(--dz-tag-rgb); // 关闭键 hover 罩层（原 currentColor 12%）

    &.is-round {
        border-radius: 99px;
    }

    &.is-small {
        padding: 0 8px;
        font-size: 0.6875rem;
    }

    // 各语义类型：底色为主色 12% 罩，文字为主色
    &--default {
        background: var(--dz-bg-secondary);
        border-color: var(--dz-border);
        color: var(--dz-text-d);
    }

    &--primary {
        --dz-tag-rgb: var(--dz-primary-rgb);
        background: rgba(var(--dz-tag-rgb), 0.12);
        border-color: rgba(var(--dz-tag-rgb), 0.3);
        color: var(--dz-primary);
    }

    &--success {
        --dz-tag-rgb: var(--dz-success-rgb);
        background: rgba(var(--dz-tag-rgb), 0.12);
        border-color: rgba(var(--dz-tag-rgb), 0.3);
        color: var(--dz-success);
    }

    &--warning {
        --dz-tag-rgb: var(--dz-warning-rgb);
        background: rgba(var(--dz-tag-rgb), 0.14);
        border-color: rgba(var(--dz-tag-rgb), 0.32);
        color: var(--dz-warning);
    }

    &--danger {
        --dz-tag-rgb: var(--dz-danger-rgb);
        background: rgba(var(--dz-tag-rgb), 0.12);
        border-color: rgba(var(--dz-tag-rgb), 0.3);
        color: var(--dz-danger);
    }

    &--info {
        // 底色/描边随主色，文字与关闭键罩层保持弱化灰
        --dz-tag-close-rgb: var(--dz-gray-7-rgb);
        background: rgba(var(--dz-primary-rgb), 0.12);
        border-color: rgba(var(--dz-primary-rgb), 0.3);
        color: var(--dz-text-d);
    }

    &__close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: inherit;
        font-size: 14px;
        line-height: 1;
        padding: 0;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.15s, background 0.15s;

        &:hover {
            opacity: 1;
            background: rgba(var(--dz-tag-close-rgb), 0.12);
            color: var(--dz-text);
        }
    }
}
</style>
