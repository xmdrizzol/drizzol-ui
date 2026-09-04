<template>
    <section class="d-layout" :style="{ flexDirection: direction }">
        <slot />
    </section>
</template>

<script setup lang="ts">
import { computed, provide, reactive } from 'vue'
import { LAYOUT_KEY } from './layout-key'

/**
 * 布局容器：DLayout + DHeader + DAside + DMain + DFooter 组合使用
 * - 默认垂直排列；存在 DAside 时自动水平排列（可用 direction 强制）
 * - 布局上下文：子组件挂载时登记 aside/header/footer 标记
 */
const props = withDefaults(defineProps<{
    /** 排列方向：horizontal（左右）| vertical（上下），默认按子组件自动推断 */
    direction?: 'horizontal' | 'vertical'
}>(), {
    direction: undefined,
})

// 子组件挂载后写标记（响应式），决定自动方向
const flags = reactive({ aside: false, header: false, footer: false })
provide(LAYOUT_KEY, flags)

const direction = computed(() => {
    if (props.direction) return props.direction === 'horizontal' ? 'row' : 'column'
    return flags.aside ? 'row' : 'column'
})
</script>

<style scoped lang="scss">
.d-layout {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
}
</style>
