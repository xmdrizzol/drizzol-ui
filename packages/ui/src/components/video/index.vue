<template>
    <div class="d-video">
        <div ref="containerRef" class="d-video__inner"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch, onMounted, onBeforeUnmount } from 'vue'
import Artplayer from 'artplayer'
import type { Option } from 'artplayer'
import { ratioToPaddingTop } from '@ui/utils/ratio'

/**
 * 通用视频播放器（ArtPlayer 封装）
 *
 * - 容器即尺寸盒：`.art-video-player` 铺满容器，尺寸完全由容器 CSS 决定，无需手动 setSize
 * - 不 import css 文件：v5 样式运行时自动注入 `<style id="artplayer-style">`，类名收敛在 `.art-video-player` 下
 * - `autoSize: false`（默认即 false，显式写出防误改）：保持固定容器比例，不按视频原生比例脱离容器
 * - 非 16:9 视频源会出现上下黑边（黑底承载，不拉伸），属既定取舍
 * - 比例有两条等价路径：现代内核走 `aspect-ratio`，Chrome 86 等低版本走 `::before` 的 padding-top 兜底
 */

const props = withDefaults(defineProps<{
    /** 视频地址（必填） */
    src: string
    /** 封面图地址 */
    poster?: string
    /** 自动播放（一般需配合 muted） */
    autoplay?: boolean
    /** 静音 */
    muted?: boolean
    /** 循环播放 */
    loop?: boolean
    /** 主题色（空则读取 --dz-primary） */
    theme?: string
    /** 容器宽高比（默认 16 / 9） */
    ratio?: string
}>(), {
    poster: '',
    autoplay: false,
    muted: false,
    loop: false,
    theme: '',
    ratio: '16 / 9',
})

const emit = defineEmits<{
    (e: 'ready', player: Artplayer): void
    (e: 'play'): void
    (e: 'pause'): void
    (e: 'ended'): void
}>()

const containerRef = ref<HTMLDivElement>()
const player = shallowRef<Artplayer>()

/** 兜底比例（16 / 9 → 56.25%）；ratio 解析不出正数时给空值，此时不下发 padding，行为同旧版 */
const paddingTop = computed(() => ratioToPaddingTop(props.ratio) ?? '')

/** 解析主题色：props.theme 优先，否则读取全局 CSS 变量 --dz-primary */
function resolveTheme(): string {
    if (props.theme) return props.theme
    // 兜底为库浅色主色（_variables.scss 的 $light-primary-6）
    return getComputedStyle(document.documentElement).getPropertyValue('--dz-primary').trim() || '#1677ff'
}

function createPlayer() {
    if (!containerRef.value) return
    const option: Option = {
        container: containerRef.value,
        url: props.src,
        // poster 省略而非传 undefined：ArtPlayer 的 option 校验器要求 string 类型，传 undefined 会抛 [Type Error]
        ...(props.poster ? { poster: props.poster } : {}),
        autoplay: props.autoplay,
        muted: props.muted,
        loop: props.loop,
        theme: resolveTheme(),
        lang: 'zh-cn',
        // v5 默认几乎全关闭，需显式开启常用控制项
        setting: true,
        fullscreen: true,
        fullscreenWeb: true,
        pip: true,
        playbackRate: true,
        // 容器即尺寸盒，禁用自动缩放避免脱离固定容器
        autoSize: false,
        aspectRatio: false,
        volume: 0.7,
        moreVideoAttr: {
            controls: false,
            playsInline: true,
            preload: 'metadata',
        },
    }
    player.value = new Artplayer(option)
    // 事件透传给父级（Events 含宽松 string 重载，裸名 play/pause/ended 合法）
    player.value.on('play', () => emit('play'))
    player.value.on('pause', () => emit('pause'))
    player.value.on('ended', () => emit('ended'))
    emit('ready', player.value)
}

// 切换视频源：复用实例换流，避免重建播放器
watch(() => props.src, (url) => {
    if (player.value && url) {
        player.value.switchUrl(url)
    }
})

onMounted(createPlayer)

onBeforeUnmount(() => {
    // destroy(true)：去 src、清空容器、销毁事件，防多实例内存泄漏
    player.value?.destroy(true)
    player.value = undefined
})

defineExpose({ player })
</script>

<style scoped lang="scss">
.d-video {
    position: relative;
    width: 100%;
    aspect-ratio: v-bind('props.ratio');
    border-radius: 8px;
    overflow: hidden;
    background: var(--dz-bg-secondary);

    // Chrome 86 等无 aspect-ratio 的内核：靠占位块撑出同一比例
    //（padding 百分比按宽度解析，与 aspect-ratio 的高度一致，现代内核两条路径并存也不冲突）
    &::before {
        content: '';
        display: block;
        padding-top: v-bind('paddingTop');
    }

    // ArtPlayer 挂载点：绝对铺满，任何内核下父盒都有确定高度（其 .art-video-player 依赖 height: 100%）
    &__inner {
        @include absolute(0, 0, 0, 0);
    }
}
</style>
