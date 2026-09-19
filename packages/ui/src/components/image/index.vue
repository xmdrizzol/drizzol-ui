<template>
    <!-- 加载失败：兜底占位（hasError 切换展示），fallback 插槽可完全自定义 -->
    <div v-if="hasError" class="d-image d-image--error" v-bind="rootAttrs" :style="rootStyle">
        <slot name="fallback">
            <d-icon name="image" size="1.4" class="d-image__fallback-icon" />
            <span v-if="fallbackText" class="d-image__fallback-text">{{ fallbackText }}</span>
        </slot>
    </div>

    <!-- 独立预览：不在分组内时自带 Provider（Fragment 渲染无实际 DOM，不产生包装元素） -->
    <PhotoProvider v-else-if="preview && !inGroup">
        <PhotoConsumer :src="displayUrl" :intro="alt" class="d-image d-image--preview" v-bind="rootAttrs" :style="rootStyle">
            <img class="d-image__img" v-bind="imgAttrs" :style="imgStyle" />
        </PhotoConsumer>
    </PhotoProvider>

    <!-- 分组预览：点击交给 DImageGroup 的 Provider（组内左右切换）。
         PhotoConsumer 根 span 必须是组件根：分组内各图片的 span 互为兄弟节点，
         预览器按兄弟位置排序，包一层 div 会打乱预览顺序 -->
    <PhotoConsumer v-else-if="preview" :src="displayUrl" :intro="alt" class="d-image d-image--preview" v-bind="rootAttrs" :style="rootStyle">
        <img class="d-image__img" v-bind="imgAttrs" :style="imgStyle" />
    </PhotoConsumer>

    <!-- 关闭预览（preview=false）：纯展示图片 -->
    <img v-else class="d-image" v-bind="{ ...rootAttrs, ...imgAttrs }" :style="{ ...rootStyle, ...imgStyle }" />
</template>

<script setup lang="ts">
import { computed, inject, ref, useAttrs, watch } from 'vue'
import { PhotoProvider, PhotoConsumer } from 'vue-photo-preview-next'
import { resolveAccessUrl } from '@ui/utils/file'
import { toSize } from '@ui/components/layout/size'
import DIcon from '@ui/components/icon'
import { D_IMAGE_GROUP_KEY } from './context'
// 预览器的结构样式（深色遮罩/箭头/操作栏）；库构建时并入 dist/style.css
import 'vue-photo-preview-next/dist/index.css'

defineOptions({ name: 'DImage', inheritAttrs: false })

const props = withDefaults(defineProps<{
    /** 图片地址：完整 URL（http/blob/data）与 / 开头同源路径原样使用；fileRef 按访问前缀配置解析（未配置原样返回，见 resolveAccessUrl） */
    src?: string
    /** 替代文本，同时作为预览态的图片介绍 */
    alt?: string
    /** 填充模式（object-fit） */
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    /** 宽度；数字按 px 转 rem，可传 rem/%/auto 等 */
    width?: number | string
    /** 高度；数字按 px 转 rem，可传 rem/%/vh 等 */
    height?: number | string
    /** 圆角；数字按 px 转 rem。不传无圆角 */
    radius?: number | string
    /** 原生懒加载（loading="lazy"） */
    lazy?: boolean
    /** 点击预览大图；在 DImageGroup 内自动并入分组预览 */
    preview?: boolean
    /** 加载失败文案（fallback 插槽未自定义时的占位提示） */
    fallbackText?: string
}>(), {
    src: '',
    alt: '',
    fit: 'cover',
    width: undefined,
    height: undefined,
    radius: undefined,
    lazy: false,
    preview: true,
    fallbackText: '',
})

// 分组内标记由 DImageGroup 注入：此时不再自带 Provider，避免嵌套抢占注入链
const inGroup = inject(D_IMAGE_GROUP_KEY, false)

// 多分支根元素（class/style 等透传手动接管：预览分支的 Provider 根是 Fragment，无法自动透传）
const rootAttrs = useAttrs()

/** fileRef/URL 统一解析为可访问地址（完整 URL 幂等、类型前缀拆解、纯文件名按 image 拼接） */
const displayUrl = computed(() => resolveAccessUrl(props.src || ''))

// 加载失败状态（src 变化后重置：换成有效地址即自动重试）
const errored = ref(false)
const hasError = computed(() => !displayUrl.value || errored.value)
watch(() => props.src, () => { errored.value = false })

/** 透传给 img 的公共属性（各渲染分支共用） */
const imgAttrs = computed(() => ({
    src: displayUrl.value,
    alt: props.alt,
    loading: props.lazy ? ('lazy' as const) : ('eager' as const),
    decoding: 'async' as const,
    onError: () => { errored.value = true },
}))

const rootStyle = computed(() => ({
    width: toSize(props.width),
    height: toSize(props.height),
    borderRadius: toSize(props.radius),
}))

const imgStyle = computed(() => ({ objectFit: props.fit }))
</script>

<style scoped lang="scss">
.d-image {
    // 无尺寸时收缩为图片自然尺寸，同时不超出父容器
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    // 加载中/透明图区域的底色（图片加载完成后被完全覆盖）
    background: var(--dz-bg-secondary);

    // 点击预览态
    &--preview {
        cursor: zoom-in;
    }

    // 失败兜底：图标 + 文案纵排居中；无固定尺寸时给最小占位
    &--error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 96px;
        min-width: 128px;
        padding: 12px;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
    }

    &__fallback-icon {
        color: var(--dz-text-l);
    }

    // 预览包装内的 img：铺满根元素（根负责尺寸，img 负责裁切）
    &__img {
        display: block;
        width: 100%;
        height: 100%;
    }
}
</style>
