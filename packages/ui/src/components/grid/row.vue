<template>
    <component :is="tag" class="d-row" :class="classes" :style="rowStyle">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

/**
 * 栅格行：与 DCol 搭配（24 分栏），gutter 为列间距（px），子列自动左右内边距
 */
const props = withDefaults(defineProps<{
    /** 列间距（px），两侧各 gutter / 2 */
    gutter?: number
    /** 水平对齐 */
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
    /** 垂直对齐 */
    align?: 'top' | 'middle' | 'bottom' | 'stretch'
    /** 是否换行 */
    wrap?: boolean
    /** 渲染标签 */
    tag?: string
}>(), {
    gutter: 0,
    justify: 'flex-start',
    align: 'top',
    wrap: true,
    tag: 'div',
})

provide('dz-row-gutter', props.gutter)

const classes = computed(() => ({
    [`d-row--justify-${props.justify}`]: true,
    [`d-row--align-${props.align}`]: true,
    'd-row--no-wrap': !props.wrap,
}))

const rowStyle = computed(() => {
    if (!props.gutter) return undefined
    return {
        marginLeft: `-${props.gutter / 2}px`,
        marginRight: `-${props.gutter / 2}px`,
    }
})
</script>

<style scoped lang="scss">
.d-row {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;

    &--no-wrap {
        flex-wrap: nowrap;
    }

    &--justify-center { justify-content: center; }
    &--justify-flex-end { justify-content: flex-end; }
    &--justify-space-between { justify-content: space-between; }
    &--justify-space-around { justify-content: space-around; }
    &--justify-space-evenly { justify-content: space-evenly; }

    &--align-middle { align-items: center; }
    &--align-bottom { align-items: flex-end; }
    &--align-stretch { align-items: stretch; }
}
</style>
