<template>
    <span class="d-badge">
        <slot />
        <sup v-if="visible" class="d-badge__content" :class="{ 'is-dot': dot }">
            {{ dot ? '' : displayValue }}
        </sup>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    /** 数值（受 max 封顶） */
    value?: string | number
    /** 显示上限，超出显示 max+ */
    max?: number
    /** 仅圆形红点 */
    dot?: boolean
    /** 值为 0 时也显示 */
    showZero?: boolean
    /** 隐藏 */
    hidden?: boolean
}>(), {
    value: 0,
    max: 99,
    dot: false,
    showZero: false,
    hidden: false,
})

const visible = computed(() => {
    if (props.hidden) return false
    if (props.dot) return props.value !== '' && props.value !== undefined
    const num = Number(props.value)
    if (props.showZero) return true
    return num > 0
})

const displayValue = computed(() => {
    const num = Number(props.value)
    return num > props.max ? `${props.max}+` : String(props.value)
})
</script>

<style scoped lang="scss">
.d-badge {
    position: relative;
    display: inline-flex;
    vertical-align: middle;

    &__content {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        box-sizing: border-box;
        border-radius: 99px;
        background: var(--dz-danger);
        color: var(--dz-on-fill);
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        font-family: var(--dz-ff-mono);
        box-shadow: 0 0 0 2px var(--dz-bg);
        z-index: 1;

        &.is-dot {
            min-width: 8px;
            width: 8px;
            height: 8px;
            padding: 0;
            box-shadow: 0 0 0 2px var(--dz-bg);
        }
    }
}
</style>
