<template>
    <div :class="cardClass">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
    isHover?: boolean
}>(), {
    isHover: false
})

// computed 保证 isHover 动态变化时类名同步更新
const cardClass = computed(() => [
    'd-card',
    { 'is-hover': props.isHover }
])

</script>

<style scoped lang="scss">
.d-card {
    background: var(--dz-bg);
    border: 1px solid var(--dz-border);
    border-radius: 12px;
    box-shadow: var(--dz-shadow-sm);
    padding: 1rem;

    // 组件不做兄弟间距：竖排堆叠的间距由父容器 gap 控制，
    // 相邻 margin 会污染 grid/flex 横向布局（同排卡片整体下坠错位）

    &.is-hover {
        transition: all 0.4s;

        &:hover {
            transform: translate3d(0,-8px,0);
            box-shadow: var(--dz-shadow-md);
        }
    }
}
</style>