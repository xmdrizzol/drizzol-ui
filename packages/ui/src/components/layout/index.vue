<template>
    <section class="d-layout" :class="direction === 'row' ? 'is-row' : 'is-column'" :style="{ flexDirection: direction }">
        <slot />
    </section>
</template>

<script setup lang="ts">
import { computed, useSlots, type VNode } from 'vue'
import Aside from './aside.vue'

/**
 * 布局容器：DLayout + DHeader + DAside + DMain + DFooter 组合使用
 * - 默认垂直排列；默认插槽直接含 DAside 时自动水平排列（可用 direction 强制）
 * - 完整「顶栏 + 侧边 + 内容 + 底栏」请用嵌套 DLayout：外层垂直（header + 内层 + footer），内层水平（aside + main）
 */
const props = withDefaults(defineProps<{
    /** 排列方向：horizontal（左右）| vertical（上下），默认按子组件自动推断 */
    direction?: 'horizontal' | 'vertical'
}>(), {
    direction: undefined,
})

const slots = useSlots()

// 渲染期探测默认插槽是否直接包含 DAside → 自动切换为水平（row）。
// withInstall 只是给 SFC 挂 install 并返回同一对象，因此 v.type === Aside 对
// 「<d-aside>」全局注册与「DAside」导入均成立。
function hasAside(vnodes?: VNode[]): boolean {
    return !!vnodes?.some(v => v.type === Aside)
}

const direction = computed<'row' | 'column'>(() => {
    if (props.direction) return props.direction === 'horizontal' ? 'row' : 'column'
    return hasAside(slots.default?.()) ? 'row' : 'column'
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
