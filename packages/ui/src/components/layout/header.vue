<template>
    <header class="d-header" :class="{ 'is-fixed': fixed }" :style="style">
        <slot />
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toSize } from './size'

/**
 * 顶部栏：垂直布局容器内占满宽度
 * - height 数字按 px 转 rem，纯数字串同样处理；不传时用 CSS 变量默认值（桌面 3.5rem / 移动端 3rem）
 * - fixed 后 position: sticky 吸顶（需外层/页面滚动才会悬浮；仍占文档流，不遮挡 main 内容）
 */
const props = withDefaults(defineProps<{
    /** 头高；数字按 px 转 rem；可传 rem/%/auto 等带单位值；不传用 CSS 默认（可响应式收窄） */
    height?: number | string
    /** 悬浮：滚动时吸顶（position: sticky） */
    fixed?: boolean
}>(), {
    height: undefined,
    fixed: false,
})

const style = computed(() => {
    const height = toSize(props.height)
    return height == null ? undefined : { height }
})
</script>

<style scoped lang="scss">
.d-header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    width: 100%;
    padding: 0 20px;
    background: var(--dz-bg-secondary);
    border-bottom: 1px solid var(--dz-border);
    box-sizing: border-box;
    height: 56px;

    &.is-fixed {
        position: sticky;
        top: 0;
        z-index: 100;
    }

    @include mobile {
        padding: 0 16px;
        height: 48px;
    }
}
</style>
