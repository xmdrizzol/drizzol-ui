<template>
    <component :is="tag" class="d-col" :class="colClasses" :style="colStyle">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

/** 栅格断点值：数字为 span，对象可带 span/offset */
export type GridBreak = number | { span?: number; offset?: number }

const props = withDefaults(defineProps<{
    /** 占 24 分栏中的几份（默认占满） */
    span?: number
    /** 左偏移份数 */
    offset?: number
    /** 响应式（xs < 768 / sm ≥ 768 / md ≥ 992 / lg ≥ 1200 / xl ≥ 1600） */
    xs?: GridBreak
    sm?: GridBreak
    md?: GridBreak
    lg?: GridBreak
    xl?: GridBreak
    /** 渲染标签 */
    tag?: string
}>(), {
    span: 24,
    offset: 0,
    tag: 'div',
})

const gutter = inject<number>('dz-row-gutter', 0)

function resolve(b: GridBreak | undefined) {
    return typeof b === 'number' ? { span: b } : (b || {})
}

function breakClasses(prefix: string, b?: GridBreak) {
    const v = resolve(b)
    const classes: Record<string, boolean> = {}
    if (v.span) classes[`d-col--${prefix}-${v.span}`] = true
    if (v.offset) classes[`d-col--${prefix}-offset-${v.offset}`] = true
    return classes
}

const colClasses = computed<Record<string, boolean>>(() => ({
    [`d-col--span-${props.span}`]: true,
    [`d-col--offset-${props.offset}`]: props.offset > 0,
    ...breakClasses('xs', props.xs),
    ...breakClasses('sm', props.sm),
    ...breakClasses('md', props.md),
    ...breakClasses('lg', props.lg),
    ...breakClasses('xl', props.xl),
}))

const colStyle = computed(() => {
    if (!gutter) return undefined
    return {
        paddingLeft: `${gutter / 2}px`,
        paddingRight: `${gutter / 2}px`,
    }
})
</script>

<style scoped lang="scss">
.d-col {
    box-sizing: border-box;
    flex: 0 0 auto;
    max-width: 100%;
}

@for $i from 1 through 24 {
    .d-col--span-#{$i} {
        flex: 0 0 percentage($i / 24);
        max-width: percentage($i / 24);
    }
}

@for $i from 1 through 24 {
    .d-col--offset-#{$i} {
        margin-left: percentage($i / 24);
    }
}

// 响应式：xs（<768）直接生效，sm/md/lg/xl 需达断点覆盖
@for $i from 1 through 24 {
    .d-col--xs-#{$i} {
        flex: 0 0 percentage($i / 24);
        max-width: percentage($i / 24);
    }
}

@for $i from 1 through 24 {
    .d-col--xs-offset-#{$i} {
        margin-left: percentage($i / 24);
    }
}

@mixin grid-break($prefix, $bp) {
    @media (min-width: #{$bp}) {
        @for $i from 1 through 24 {
            .d-col--#{$prefix}-#{$i} {
                flex: 0 0 percentage($i / 24);
                max-width: percentage($i / 24);
            }
        }
        @for $i from 1 through 24 {
            .d-col--#{$prefix}-offset-#{$i} {
                margin-left: percentage($i / 24);
            }
        }
    }
}

@include grid-break('sm', 768px);
@include grid-break('md', 992px);
@include grid-break('lg', 1200px);
@include grid-break('xl', 1600px);
</style>
