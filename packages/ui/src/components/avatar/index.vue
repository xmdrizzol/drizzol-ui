<template>
    <div class="d-avatar" :class="[`d-avatar--${shape}`, { 'd-avatar--fallback': showFallback }]"
        :style="rootStyle" :title="alt">
        <!-- 正常态：图片铺满（fileRef/URL 统一解析，与 DImage 同一套规则） -->
        <img v-if="!showFallback" class="d-avatar__img" v-bind="imgAttrs" />

        <!-- 空引用或加载失败：文字兜底（m-avatar 模式），#fallback 插槽可完全自定义 -->
        <span v-else class="d-avatar__fallback">
            <slot name="fallback">
                {{ fallbackText }}
            </slot>
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { resolveAccessUrl } from '@ui/utils/file'
import { toSize } from '@ui/components/layout/size'

const props = withDefaults(defineProps<{
    /** 图片地址：完整 URL（http/blob/data）与 / 开头同源路径原样使用；fileRef 按访问前缀配置解析（未配置原样返回，见 resolveAccessUrl） */
    src?: string
    /** 替代文本，同时作为悬浮提示（title） */
    alt?: string
    /** 尺寸；数字按 px 转 rem，可传 rem 等 */
    size?: number | string
    /** 形状 */
    shape?: 'circle' | 'square'
    /** 图片为空或加载失败时的兜底文案（如用户名首字） */
    fallbackText?: string
}>(), {
    src: '',
    alt: '',
    size: 40,
    shape: 'circle',
    fallbackText: '',
})

// 空引用或加载失败即进入兜底态
const errored = ref(false)
const showFallback = computed(() => !props.src || errored.value)
// src 变化后重置：换成有效地址即自动重试
watch(() => props.src, () => { errored.value = false })

const displayUrl = computed(() => resolveAccessUrl(props.src))

const imgAttrs = computed(() => ({
    src: displayUrl.value,
    alt: props.alt,
    decoding: 'async' as const,
    onError: () => { errored.value = true },
}))

const rootStyle = computed(() => {
    const size = toSize(props.size)
    return size ? { width: size, height: size } : undefined
})
</script>

<style scoped lang="scss">
.d-avatar {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    box-sizing: border-box;
    vertical-align: middle;
    // 图片未覆盖前（加载中）与兜底态的底色
    background: var(--dz-gray-3);
    border: 1px solid var(--dz-border);
    font-size: 0.875rem;
    line-height: 1;

    &--circle {
        border-radius: 50%;
    }

    &--square {
        border-radius: 8px;
    }

    &__img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__fallback {
        overflow: hidden;
        max-width: 100%;
        padding: 0 4px;
        // 兜底文案随头像缩小而收敛（相对根字号，大头像等比放大）
        font-size: 0.75em;
        font-weight: 600;
        color: var(--dz-text-d);
        text-overflow: ellipsis;
        white-space: nowrap;
        user-select: none;
    }
}
</style>
