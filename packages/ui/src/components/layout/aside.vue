<template>
    <aside class="d-aside" :class="{ 'is-fixed': fixed }" :style="style">
        <slot />
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toSize } from './size'

/**
 * 侧边栏：水平布局容器内占满高度
 * - width 数字按 px 转 rem，纯数字串同样处理；不传时用 CSS 默认值（桌面 240px / 移动端 200px，构建时转 rem）
 * - fixed 后 position: sticky 吸顶：自身收缩为内容高度，在可滚动的祖先容器内吸附
 * - 上方有吸顶头部（DHeader fixed）时，用 --dz-aside-sticky-top 让出头部高度避免重叠
 */
const props = withDefaults(defineProps<{
    /** 侧栏宽；数字按 px 转 rem；可传 rem/%/auto 等带单位值；不传用 CSS 默认（可响应式收窄） */
    width?: number | string
    /** 悬浮：滚动时吸顶（position: sticky） */
    fixed?: boolean
}>(), {
    width: undefined,
    fixed: false,
})

const style = computed(() => {
    const width = toSize(props.width)
    return width == null ? undefined : { width }
})
</script>

<style scoped lang="scss">
.d-aside {
    flex: 0 0 auto;
    overflow: auto;
    background: var(--dz-bg);
    border-right: 1px solid var(--dz-border);
    box-sizing: border-box;
    padding: 20px 16px;
    width: 240px;

    &.is-fixed {
        // 不参与 flex 拉伸：否则自身高度等于容器高度，sticky 无可位移空间而失效
        align-self: flex-start;
        position: sticky;
        top: var(--dz-aside-sticky-top, 0);
        z-index: 100;
    }

    @include mobile {
        width: 200px;
    }
}
</style>
