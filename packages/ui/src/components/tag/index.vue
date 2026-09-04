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
        background: color-mix(in srgb, var(--dz-primary) 12%, transparent);
        border-color: color-mix(in srgb, var(--dz-primary) 30%, transparent);
        color: var(--dz-primary);
    }

    &--success {
        background: color-mix(in srgb, var(--dz-success) 12%, transparent);
        border-color: color-mix(in srgb, var(--dz-success) 30%, transparent);
        color: var(--dz-success);
    }

    &--warning {
        background: color-mix(in srgb, var(--dz-warning) 14%, transparent);
        border-color: color-mix(in srgb, var(--dz-warning) 32%, transparent);
        color: var(--dz-warning);
    }

    &--danger {
        background: color-mix(in srgb, var(--dz-danger) 12%, transparent);
        border-color: color-mix(in srgb, var(--dz-danger) 30%, transparent);
        color: var(--dz-danger);
    }

    &--info {
        background: color-mix(in srgb, var(--dz-primary-6) 12%, transparent);
        border-color: color-mix(in srgb, var(--dz-primary-6) 30%, transparent);
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
            background: color-mix(in srgb, currentColor 12%, transparent);
            color: var(--dz-text);
        }
    }
}
</style>
